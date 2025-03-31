import { Controller as LilController, GUI as LilGUI } from "lil-gui";
import { Extent3D } from "./Common";

/**
 * @see {@link RenderOutputTag} for the enum this array backs.
 */
export const RenderOutputTags = [
	"Scene",
	"GBufferColor",
	"GBufferNormal",
	"AtmosphereTransmittanceLUT",
	"AtmosphereMultiscatterLUT",
	"AtmosphereSkyviewLUT",
	"AtmosphereAerialPerspectiveLUT",
	"FFTWaveSpectrumGaussianNoise",
	"FFTWaveInitialAmplitude",
	"FFTWaveDx_plus_iDy_Dz_iDxdz_Amplitude",
	"FFTWaveDydx_plus_iDydz_Dxdx_plus_iDzdz_Amplitude",
	"FFTWaveTurbulenceJacobian",
	"FFTWaveDx_Dy_Dz_Dxdz_Spatial",
	"FFTWaveDydx_Dydz_Dxdx_Dzdz_Spatial",
] as const;
/**
 * Identifiers for render output targets supported by the renderer.
 */
export type RenderOutputTag = (typeof RenderOutputTags)[number];

/**
 * Stores a view to a texture, alongside information like the depth, mip levels,
 * and dimension, for binding to a pipeline that renders it to the screen.
 */
export class RenderOutputTexture {
	private texture: GPUTexture;
	readonly view: GPUTextureView;
	readonly viewDimension: GPUTextureViewDimension;

	/**
	 * The number of mip levels in the texture.
	 * @readonly
	 */
	get mipLevelCount(): number {
		return this.texture.mipLevelCount;
	}

	/**
	 * The extent of the texture.
	 * @readonly
	 */
	get extent(): Extent3D {
		return {
			width: this.texture.width,
			height: this.texture.height,
			depthOrArrayLayers: this.texture.depthOrArrayLayers,
		};
	}

	/**
	 * Uses the passed texture to create a view, while storing the texture
	 * object so that the properties can be queried later. The resulting view
	 * will have dimension "1d", "2d", "2d-array", or "3d" and will match the
	 * texture.
	 * @param texture - The texture to store and create a view of.
	 */
	constructor(texture: GPUTexture) {
		this.texture = texture;

		let arrayLayerCount = 1;
		let dimension: GPUTextureViewDimension = this.texture.dimension;
		if (
			this.texture.dimension == "2d" &&
			this.texture.depthOrArrayLayers > 1
		) {
			arrayLayerCount = this.texture.depthOrArrayLayers;
			dimension = "2d-array";
		}

		this.viewDimension = dimension;

		this.view = texture.createView({
			label: `Render Output View for '${texture.label}'`,
			dimension: this.viewDimension,
			arrayLayerCount: arrayLayerCount,
			baseArrayLayer: 0,
		});
	}
}

/**
 * The parameters for transforming an instance of `{@link RenderOutputTexture}`
 * while sampling it for presentation.
 */
export class RenderOutputTransform {
	flip = false;
	colorGain: {
		r: number;
		g: number;
		b: number;
	} = { r: 1.0, g: 1.0, b: 1.0 };
	channelMasks: {
		r: boolean;
		g: boolean;
		b: boolean;
	} = { r: true, g: true, b: true };
	swapBARG = false;
	mipLevel = 0;
	arrayLayer = 0;
}

type NestedUniform<T, B> = T extends object
	? { [K in keyof T]: NestedUniform<T[K], B> }
	: B;

const RENDER_OUTPUT_TRANSFORM_DEFAULT_OVERRIDES: ({
	[K in keyof RenderOutputTransform]?: RenderOutputTransform[K];
} & {
	id: RenderOutputTag;
})[] = [
	{ id: "AtmosphereTransmittanceLUT", flip: true },
	{
		id: "AtmosphereMultiscatterLUT",
		flip: true,
		colorGain: { r: 20.0, g: 20.0, b: 20.0 },
	},
	{
		id: "AtmosphereSkyviewLUT",
		colorGain: { r: 8.0, g: 8.0, b: 8.0 },
	},
	{
		id: "AtmosphereAerialPerspectiveLUT",
		colorGain: { r: 8.0, g: 8.0, b: 8.0 },
	},
	{
		id: "FFTWaveInitialAmplitude",
		colorGain: { r: 100.0, g: 100.0, b: 100.0 },
	},
	{
		id: "FFTWaveDx_plus_iDy_Dz_iDxdz_Amplitude",
		colorGain: { r: 100.0, g: 100.0, b: 100.0 },
	},
	{
		id: "FFTWaveDydx_plus_iDydz_Dxdx_plus_iDzdz_Amplitude",
		colorGain: { r: 100.0, g: 100.0, b: 100.0 },
	},
];

/**
 * This manages the selection from a list of possible targets that can be
 * presented as the final output of the renderer, alongside persisting
 * transformations to use when rendering that target. See
 * {@link RenderOutputTags} for the possible outputs, and
 * {@link RenderOutputTransform} for the properties that are transformed during
 * rendering.
 */
export class RenderOutputController {
	private options: {
		outputTexture: RenderOutputTag;
		renderOutputTransforms: Map<RenderOutputTag, RenderOutputTransform>;
	};
	private textureProperties: Map<
		RenderOutputTag,
		{ mipLevelCount: number; depthOrArrayLayerCount: number }
	>;
	private controllers:
		| NestedUniform<RenderOutputTransform, LilController>
		| undefined;

	/**
	 * @returns The target and transform of the currently selected render
	 * output.
	 */
	current(): {
		tag: RenderOutputTag;
		transform: RenderOutputTransform;
	} {
		return {
			tag: this.options.outputTexture,
			transform: structuredClone(
				this.options.renderOutputTransforms.get(
					this.options.outputTexture
				)!
			),
		};
	}

	private updateVariableControllerBounds(): void {
		if (this.controllers === undefined) {
			return;
		}

		const texture = this.textureProperties.get(this.options.outputTexture);
		if (texture !== undefined) {
			this.controllers.mipLevel.max(texture.mipLevelCount - 1);
			this.controllers.mipLevel.disable(texture.mipLevelCount == 1);
			if (texture.mipLevelCount == 1) {
				this.controllers.mipLevel.setValue(0);
			}
			this.controllers.mipLevel.updateDisplay();

			this.controllers.arrayLayer.max(texture.depthOrArrayLayerCount - 1);
			this.controllers.arrayLayer.disable(
				texture.depthOrArrayLayerCount == 1
			);
			if (texture.depthOrArrayLayerCount == 1) {
				this.controllers.arrayLayer.setValue(0);
			}
			this.controllers.arrayLayer.updateDisplay();
		}
	}

	/**
	 * Set the per-texture data for a given render output, restricting what
	 * values can be set in the UI, such as not accessing out-of-bounds mipmap
	 * levels.
	 * @param tag - The render output to tweak the parameters for.
	 * @param mipLevelCount - The upper bound of what mip level can be set in
	 *  the UI.
	 * @param depthOrArrayLayerCount - The upper bound of what array layer (or
	 *  depth) can be set in the UI.
	 */
	setTextureProperties(props: {
		tag: RenderOutputTag;
		mipLevelCount: number;
		depthOrArrayLayerCount: number;
	}): void {
		this.textureProperties.set(props.tag, {
			mipLevelCount: props.mipLevelCount,
			depthOrArrayLayerCount: props.depthOrArrayLayerCount,
		});

		if (props.tag == this.options.outputTexture) {
			this.updateVariableControllerBounds();
		}
	}

	private setOutput(tag: RenderOutputTag): void {
		if (this.controllers === undefined) {
			return;
		}

		this.options.outputTexture = tag;

		/*
		 * There is a tradeoff for using LilGUI without wrapping
		 * 	1) Either we copy the values and keep LilController.object stable
		 * 	2) or we swap out the .object reference with our current saved config sub-object
		 *
		 * We go with option 2 since copying arbitrary types correctly is hard
		 * and for any nested types (which we have) would require updating the
		 * references anyway.
		 */

		const transform = this.options.renderOutputTransforms.get(
			this.options.outputTexture
		)!;

		this.controllers.flip.object = transform;

		this.controllers.colorGain.r.object = transform.colorGain;
		this.controllers.colorGain.g.object = transform.colorGain;
		this.controllers.colorGain.b.object = transform.colorGain;

		this.controllers.channelMasks.r.object = transform.channelMasks;
		this.controllers.channelMasks.g.object = transform.channelMasks;
		this.controllers.channelMasks.b.object = transform.channelMasks;

		this.controllers.swapBARG.object = transform;
		this.controllers.mipLevel.object = transform;
		this.controllers.arrayLayer.object = transform;

		this.updateVariableControllerBounds();
	}

	private setUniformColorScale(scale: number): void {
		const currentTransform = this.options.renderOutputTransforms.get(
			this.options.outputTexture
		)!;
		currentTransform.colorGain.r = scale;
		currentTransform.colorGain.g = scale;
		currentTransform.colorGain.b = scale;
	}

	/**
	 * Adds this controller to the UI.
	 * @param gui - The root level GUI to attach to.
	 */
	setupUI(gui: LilGUI): void {
		const outputTextureFolder = gui.addFolder("Render Output").close();
		outputTextureFolder
			.add({ outputTexture: "Scene" }, "outputTexture", {
				"Final Scene": "Scene",
				"[GBuffer] Color": "GBufferColor",
				"[GBuffer] Normal": "GBufferNormal",
				"[Atmosphere] Transmittance LUT": "AtmosphereTransmittanceLUT",
				"[Atmosphere] Multiscatter LUT": "AtmosphereMultiscatterLUT",
				"[Atmosphere] Skyview LUT": "AtmosphereSkyviewLUT",
				"[Atmosphere] Aerial Perspective LUT":
					"AtmosphereAerialPerspectiveLUT",
				"[FFT Waves] Gaussian Noise": "FFTWaveSpectrumGaussianNoise",
				"[FFT Waves] Initial Amplitude": "FFTWaveInitialAmplitude",
				"[FFT Waves] Frequency Domain (Dx + i * Dy, Dz + i * Dxdz)":
					"FFTWaveDx_plus_iDy_Dz_iDxdz_Amplitude",
				"[FFT Waves] Frequency Domain (Dydx + i * Dydz, Dxdx + i * Dzdz)":
					"FFTWaveDydx_plus_iDydz_Dxdx_plus_iDzdz_Amplitude",
				"[FFT Waves] (Turbulence, Jacobian)":
					"FFTWaveTurbulenceJacobian",
				"[FFT Waves] Spatial Domain (Dx, Dy, Dz, Dxdz)":
					"FFTWaveDx_Dy_Dz_Dxdz_Spatial",
				"[FFT Waves] Spatial Domain (Dydx, Dydz, Dxdx, Dzdz)":
					"FFTWaveDydx_Dydz_Dxdx_Dzdz_Spatial",
			})
			.name("Render Output")
			.listen()
			.onFinishChange((v: RenderOutputTag) => {
				this.setOutput(v);
			});

		const currentTransform = this.options.renderOutputTransforms.get(
			this.options.outputTexture
		)!;

		const flipController = outputTextureFolder
			.add(currentTransform, "flip")
			.name("Flip Image")
			.listen();
		const mipLevelController = outputTextureFolder
			.add(currentTransform, "mipLevel")
			.min(0)
			.max(0)
			.step(1)
			.name("Mip Level")
			.listen();
		const arrayLayerController = outputTextureFolder
			.add(currentTransform, "arrayLayer")
			.min(0)
			.max(0)
			.step(1)
			.name("Array Layer")
			.listen();

		const SCALE_MIN = -10000.0;
		const SCALE_MAX = 10000.0;

		outputTextureFolder
			.add({ scale: 0.0 }, "scale")
			.name("Uniform Scale")
			.min(SCALE_MIN)
			.max(SCALE_MAX)
			.onChange((v: number) => {
				this.setUniformColorScale(v);
			});

		const rMaskController = outputTextureFolder
			.add(currentTransform.channelMasks, "r")
			.name("R")
			.listen();
		const rController = outputTextureFolder
			.add(currentTransform.colorGain, "r")
			.name("")
			.min(SCALE_MIN)
			.max(SCALE_MAX)
			.listen();
		const gMaskController = outputTextureFolder
			.add(currentTransform.channelMasks, "g")
			.name("G")
			.listen();
		const gController = outputTextureFolder
			.add(currentTransform.colorGain, "g")
			.name("")
			.min(SCALE_MIN)
			.max(SCALE_MAX)
			.listen();
		const bMaskController = outputTextureFolder
			.add(currentTransform.channelMasks, "b")
			.name("B")
			.listen();
		const bController = outputTextureFolder
			.add(currentTransform.colorGain, "b")
			.name("")
			.min(SCALE_MIN)
			.max(SCALE_MAX)
			.listen();
		const swapBARGController = outputTextureFolder
			.add(currentTransform, "swapBARG")
			.name("Swap Blue-Alpha and Red-Green Pairs")
			.listen();

		this.controllers = {
			flip: flipController,
			colorGain: {
				r: rController,
				g: gController,
				b: bController,
			},
			channelMasks: {
				r: rMaskController,
				g: gMaskController,
				b: bMaskController,
			},
			swapBARG: swapBARGController,
			mipLevel: mipLevelController,
			arrayLayer: arrayLayerController,
		};
	}

	constructor() {
		this.options = {
			outputTexture: "Scene",
			renderOutputTransforms: new Map(
				RenderOutputTags.map((tag) => {
					return [tag, new RenderOutputTransform()];
				})
			),
		};
		RENDER_OUTPUT_TRANSFORM_DEFAULT_OVERRIDES.forEach(
			({ id, ...overrides }) => {
				const original = this.options.renderOutputTransforms.get(id)!;

				this.options.renderOutputTransforms.set(id, {
					...original,
					...overrides,
				} satisfies RenderOutputTransform);
			}
		);
		this.textureProperties = new Map();
	}
}
