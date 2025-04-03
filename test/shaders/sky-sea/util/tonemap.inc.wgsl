// Transfer implementation as defined in
// https://www.color.org/chardata/rgb/srgb.xalter

// sRGB nonlinear -> sRGB linear
fn sRGB_EOTF(color_nonlinear: vec3<f32>) -> vec3<f32>
{
    let piecewise_boundary = color_nonlinear < vec3<f32>(0.0031308 * 12.92);
    let piecewise_linear = color_nonlinear / vec3<f32>(12.92);
    let piecewise_nonlinear = pow(
        (color_nonlinear + vec3<f32>(0.055)) / vec3<f32>(1.055), vec3<f32>(2.4)
    );

    return 0.95 * select(piecewise_nonlinear, piecewise_linear, piecewise_boundary);
}

// sRGB linear -> sRGB nonlinear
fn sRGB_OETF(color_linear: vec3<f32>) -> vec3<f32>
{
    let piecewise_boundary = color_linear <= vec3<f32>(0.0031308);
    let piecewise_linear = vec3<f32>(12.92) * color_linear;
    let piecewise_nonlinear = vec3<f32>(1.055) * pow(color_linear, vec3<f32>(1 / 2.4)) - vec3<f32>(0.055);

    return select(piecewise_nonlinear, piecewise_linear, piecewise_boundary);
}

// ACES tonemap fitting constants provided by
// https://github.com/TheRealMJP/BakingLab/blob/master/BakingLab/ACES.hlsl

fn RRTAndODTFit(v: vec3<f32>) -> vec3<f32>
{
    let a = v * (v + 0.0245786) - 0.000090537;
    let b = v * (0.983729 * v + 0.4329510) + 0.238081;
    return a / b;
}

/**
* Output is nonlinear-encoded sRGB.
*/
fn HDRtoSRGB_ACES(color_hdr: vec3<f32>) -> vec3<f32>
{
	// sRGB => XYZ => D65_2_D60 => AP1 => RRT_SAT
	const ACES_INPUT_MAT = mat3x3<f32>(
		vec3<f32>(0.59719, 0.07600, 0.02840),
		vec3<f32>(0.35458, 0.90834, 0.13383),
		vec3<f32>(0.04823, 0.01566, 0.83777)
	);

	// ODT_SAT => XYZ => D60_2_D65 => sRGB
	const ACES_OUTPUT_MAT = mat3x3<f32>
	(
		vec3<f32>(1.60475, -0.10208, -0.00327),
		vec3<f32>(-0.53108,  1.10813, -0.07276),
		vec3<f32>(-0.07367, -0.00605,  1.07602)
	);

    var color = ACES_INPUT_MAT * sRGB_OETF(color_hdr);
    color = RRTAndODTFit(color);
    color = ACES_OUTPUT_MAT * color;
    color = clamp(color, vec3<f32>(0.0), vec3<f32>(1.0));
    return color;
}

/**
* Implementation of https://github.com/KhronosGroup/ToneMapping/tree/main/PBR_Neutral
* Input and output are linear color in the Rec. 709 gamut (same as sRGB when linear/not encoded).
* Input components are in [0, infinity), output components are in [0,1]
*/
fn tonemapPBRNeutral(color: vec3<f32>) -> vec3<f32>
{
    let x = min(min(color.r, color.g), color.b);

    // 4% Fresnel Reflection for a standard 1.5 IoR material
    let F_normal = 0.04;

    var f = F_normal;
    if (x <= 2.0 * F_normal)
    {
        f = x - x * x / (4.0 * F_normal);
    }

    var color_minus_f = color - vec3<f32>(f);

    // Parameter that controls when highlight compression starts
    let K_s = 0.8 - F_normal;

    let p = max(max(color_minus_f.r, color_minus_f.g), color_minus_f.b);
    if (p <= K_s)
    {
        return color_minus_f;
    }

    // Speed of desaturation
    let K_d = 0.15;

    let p_n = 1.0 - (1.0 - K_s) * (1.0 - K_s) / (p + 1.0 - 2.0 * K_s);
    let g = 1.0 / (K_d * (p - p_n) + 1.0);

    return mix(vec3(p_n), color_minus_f * p_n / p, g);
}
