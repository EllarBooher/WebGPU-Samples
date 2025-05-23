function ot(M, S) {
  return class extends M {
    constructor(...J) {
      super(...J), S(this);
    }
  };
}
const et = ot(Array, (M) => M.fill(0));
let F = 1e-6;
function ut(M) {
  function S(l = 0, D = 0) {
    const d = new M(2);
    return l !== void 0 && (d[0] = l, D !== void 0 && (d[1] = D)), d;
  }
  const J = S;
  function ln(l, D, d) {
    const n = d ?? new M(2);
    return n[0] = l, n[1] = D, n;
  }
  function Mn(l, D) {
    const d = D ?? new M(2);
    return d[0] = Math.ceil(l[0]), d[1] = Math.ceil(l[1]), d;
  }
  function on(l, D) {
    const d = D ?? new M(2);
    return d[0] = Math.floor(l[0]), d[1] = Math.floor(l[1]), d;
  }
  function Zn(l, D) {
    const d = D ?? new M(2);
    return d[0] = Math.round(l[0]), d[1] = Math.round(l[1]), d;
  }
  function Fn(l, D = 0, d = 1, n) {
    const i = n ?? new M(2);
    return i[0] = Math.min(d, Math.max(D, l[0])), i[1] = Math.min(d, Math.max(D, l[1])), i;
  }
  function en(l, D, d) {
    const n = d ?? new M(2);
    return n[0] = l[0] + D[0], n[1] = l[1] + D[1], n;
  }
  function Xn(l, D, d, n) {
    const i = n ?? new M(2);
    return i[0] = l[0] + D[0] * d, i[1] = l[1] + D[1] * d, i;
  }
  function un(l, D) {
    const d = l[0], n = l[1], i = D[0], c = D[1], e = Math.sqrt(d * d + n * n), s = Math.sqrt(i * i + c * c), u = e * s, h = u && xn(l, D) / u;
    return Math.acos(h);
  }
  function b(l, D, d) {
    const n = d ?? new M(2);
    return n[0] = l[0] - D[0], n[1] = l[1] - D[1], n;
  }
  const Yn = b;
  function rn(l, D) {
    return Math.abs(l[0] - D[0]) < F && Math.abs(l[1] - D[1]) < F;
  }
  function Dn(l, D) {
    return l[0] === D[0] && l[1] === D[1];
  }
  function fn(l, D, d, n) {
    const i = n ?? new M(2);
    return i[0] = l[0] + d * (D[0] - l[0]), i[1] = l[1] + d * (D[1] - l[1]), i;
  }
  function qn(l, D, d, n) {
    const i = n ?? new M(2);
    return i[0] = l[0] + d[0] * (D[0] - l[0]), i[1] = l[1] + d[1] * (D[1] - l[1]), i;
  }
  function Sn(l, D, d) {
    const n = d ?? new M(2);
    return n[0] = Math.max(l[0], D[0]), n[1] = Math.max(l[1], D[1]), n;
  }
  function wn(l, D, d) {
    const n = d ?? new M(2);
    return n[0] = Math.min(l[0], D[0]), n[1] = Math.min(l[1], D[1]), n;
  }
  function K(l, D, d) {
    const n = d ?? new M(2);
    return n[0] = l[0] * D, n[1] = l[1] * D, n;
  }
  const Pn = K;
  function dn(l, D, d) {
    const n = d ?? new M(2);
    return n[0] = l[0] / D, n[1] = l[1] / D, n;
  }
  function yn(l, D) {
    const d = D ?? new M(2);
    return d[0] = 1 / l[0], d[1] = 1 / l[1], d;
  }
  const In = yn;
  function pn(l, D, d) {
    const n = d ?? new M(3), i = l[0] * D[1] - l[1] * D[0];
    return n[0] = 0, n[1] = 0, n[2] = i, n;
  }
  function xn(l, D) {
    return l[0] * D[0] + l[1] * D[1];
  }
  function B(l) {
    const D = l[0], d = l[1];
    return Math.sqrt(D * D + d * d);
  }
  const Tn = B;
  function m(l) {
    const D = l[0], d = l[1];
    return D * D + d * d;
  }
  const Qn = m;
  function U(l, D) {
    const d = l[0] - D[0], n = l[1] - D[1];
    return Math.sqrt(d * d + n * n);
  }
  const Y = U;
  function T(l, D) {
    const d = l[0] - D[0], n = l[1] - D[1];
    return d * d + n * n;
  }
  const X = T;
  function C(l, D) {
    const d = D ?? new M(2), n = l[0], i = l[1], c = Math.sqrt(n * n + i * i);
    return c > 1e-5 ? (d[0] = n / c, d[1] = i / c) : (d[0] = 0, d[1] = 0), d;
  }
  function En(l, D) {
    const d = D ?? new M(2);
    return d[0] = -l[0], d[1] = -l[1], d;
  }
  function H(l, D) {
    const d = D ?? new M(2);
    return d[0] = l[0], d[1] = l[1], d;
  }
  const Hn = H;
  function an(l, D, d) {
    const n = d ?? new M(2);
    return n[0] = l[0] * D[0], n[1] = l[1] * D[1], n;
  }
  const On = an;
  function hn(l, D, d) {
    const n = d ?? new M(2);
    return n[0] = l[0] / D[0], n[1] = l[1] / D[1], n;
  }
  const $n = hn;
  function Vn(l = 1, D) {
    const d = D ?? new M(2), n = Math.random() * 2 * Math.PI;
    return d[0] = Math.cos(n) * l, d[1] = Math.sin(n) * l, d;
  }
  function y(l) {
    const D = l ?? new M(2);
    return D[0] = 0, D[1] = 0, D;
  }
  function g(l, D, d) {
    const n = d ?? new M(2), i = l[0], c = l[1];
    return n[0] = i * D[0] + c * D[4] + D[12], n[1] = i * D[1] + c * D[5] + D[13], n;
  }
  function a(l, D, d) {
    const n = d ?? new M(2), i = l[0], c = l[1];
    return n[0] = D[0] * i + D[4] * c + D[8], n[1] = D[1] * i + D[5] * c + D[9], n;
  }
  function t(l, D, d, n) {
    const i = n ?? new M(2), c = l[0] - D[0], e = l[1] - D[1], s = Math.sin(d), u = Math.cos(d);
    return i[0] = c * u - e * s + D[0], i[1] = c * s + e * u + D[1], i;
  }
  function r(l, D, d) {
    const n = d ?? new M(2);
    return C(l, n), K(n, D, n);
  }
  function o(l, D, d) {
    const n = d ?? new M(2);
    return B(l) > D ? r(l, D, n) : H(l, n);
  }
  function f(l, D, d) {
    const n = d ?? new M(2);
    return fn(l, D, 0.5, n);
  }
  return {
    create: S,
    fromValues: J,
    set: ln,
    ceil: Mn,
    floor: on,
    round: Zn,
    clamp: Fn,
    add: en,
    addScaled: Xn,
    angle: un,
    subtract: b,
    sub: Yn,
    equalsApproximately: rn,
    equals: Dn,
    lerp: fn,
    lerpV: qn,
    max: Sn,
    min: wn,
    mulScalar: K,
    scale: Pn,
    divScalar: dn,
    inverse: yn,
    invert: In,
    cross: pn,
    dot: xn,
    length: B,
    len: Tn,
    lengthSq: m,
    lenSq: Qn,
    distance: U,
    dist: Y,
    distanceSq: T,
    distSq: X,
    normalize: C,
    negate: En,
    copy: H,
    clone: Hn,
    multiply: an,
    mul: On,
    divide: hn,
    div: $n,
    random: Vn,
    zero: y,
    transformMat4: g,
    transformMat3: a,
    rotate: t,
    setLength: r,
    truncate: o,
    midpoint: f
  };
}
const bn = /* @__PURE__ */ new Map();
function ct(M) {
  let S = bn.get(M);
  return S || (S = ut(M), bn.set(M, S)), S;
}
function rt(M) {
  function S(s, u, h) {
    const w = new M(3);
    return s !== void 0 && (w[0] = s, u !== void 0 && (w[1] = u, h !== void 0 && (w[2] = h))), w;
  }
  const J = S;
  function ln(s, u, h, w) {
    const p = w ?? new M(3);
    return p[0] = s, p[1] = u, p[2] = h, p;
  }
  function Mn(s, u) {
    const h = u ?? new M(3);
    return h[0] = Math.ceil(s[0]), h[1] = Math.ceil(s[1]), h[2] = Math.ceil(s[2]), h;
  }
  function on(s, u) {
    const h = u ?? new M(3);
    return h[0] = Math.floor(s[0]), h[1] = Math.floor(s[1]), h[2] = Math.floor(s[2]), h;
  }
  function Zn(s, u) {
    const h = u ?? new M(3);
    return h[0] = Math.round(s[0]), h[1] = Math.round(s[1]), h[2] = Math.round(s[2]), h;
  }
  function Fn(s, u = 0, h = 1, w) {
    const p = w ?? new M(3);
    return p[0] = Math.min(h, Math.max(u, s[0])), p[1] = Math.min(h, Math.max(u, s[1])), p[2] = Math.min(h, Math.max(u, s[2])), p;
  }
  function en(s, u, h) {
    const w = h ?? new M(3);
    return w[0] = s[0] + u[0], w[1] = s[1] + u[1], w[2] = s[2] + u[2], w;
  }
  function Xn(s, u, h, w) {
    const p = w ?? new M(3);
    return p[0] = s[0] + u[0] * h, p[1] = s[1] + u[1] * h, p[2] = s[2] + u[2] * h, p;
  }
  function un(s, u) {
    const h = s[0], w = s[1], p = s[2], x = u[0], z = u[1], P = u[2], A = Math.sqrt(h * h + w * w + p * p), q = Math.sqrt(x * x + z * z + P * P), I = A * q, Z = I && xn(s, u) / I;
    return Math.acos(Z);
  }
  function b(s, u, h) {
    const w = h ?? new M(3);
    return w[0] = s[0] - u[0], w[1] = s[1] - u[1], w[2] = s[2] - u[2], w;
  }
  const Yn = b;
  function rn(s, u) {
    return Math.abs(s[0] - u[0]) < F && Math.abs(s[1] - u[1]) < F && Math.abs(s[2] - u[2]) < F;
  }
  function Dn(s, u) {
    return s[0] === u[0] && s[1] === u[1] && s[2] === u[2];
  }
  function fn(s, u, h, w) {
    const p = w ?? new M(3);
    return p[0] = s[0] + h * (u[0] - s[0]), p[1] = s[1] + h * (u[1] - s[1]), p[2] = s[2] + h * (u[2] - s[2]), p;
  }
  function qn(s, u, h, w) {
    const p = w ?? new M(3);
    return p[0] = s[0] + h[0] * (u[0] - s[0]), p[1] = s[1] + h[1] * (u[1] - s[1]), p[2] = s[2] + h[2] * (u[2] - s[2]), p;
  }
  function Sn(s, u, h) {
    const w = h ?? new M(3);
    return w[0] = Math.max(s[0], u[0]), w[1] = Math.max(s[1], u[1]), w[2] = Math.max(s[2], u[2]), w;
  }
  function wn(s, u, h) {
    const w = h ?? new M(3);
    return w[0] = Math.min(s[0], u[0]), w[1] = Math.min(s[1], u[1]), w[2] = Math.min(s[2], u[2]), w;
  }
  function K(s, u, h) {
    const w = h ?? new M(3);
    return w[0] = s[0] * u, w[1] = s[1] * u, w[2] = s[2] * u, w;
  }
  const Pn = K;
  function dn(s, u, h) {
    const w = h ?? new M(3);
    return w[0] = s[0] / u, w[1] = s[1] / u, w[2] = s[2] / u, w;
  }
  function yn(s, u) {
    const h = u ?? new M(3);
    return h[0] = 1 / s[0], h[1] = 1 / s[1], h[2] = 1 / s[2], h;
  }
  const In = yn;
  function pn(s, u, h) {
    const w = h ?? new M(3), p = s[2] * u[0] - s[0] * u[2], x = s[0] * u[1] - s[1] * u[0];
    return w[0] = s[1] * u[2] - s[2] * u[1], w[1] = p, w[2] = x, w;
  }
  function xn(s, u) {
    return s[0] * u[0] + s[1] * u[1] + s[2] * u[2];
  }
  function B(s) {
    const u = s[0], h = s[1], w = s[2];
    return Math.sqrt(u * u + h * h + w * w);
  }
  const Tn = B;
  function m(s) {
    const u = s[0], h = s[1], w = s[2];
    return u * u + h * h + w * w;
  }
  const Qn = m;
  function U(s, u) {
    const h = s[0] - u[0], w = s[1] - u[1], p = s[2] - u[2];
    return Math.sqrt(h * h + w * w + p * p);
  }
  const Y = U;
  function T(s, u) {
    const h = s[0] - u[0], w = s[1] - u[1], p = s[2] - u[2];
    return h * h + w * w + p * p;
  }
  const X = T;
  function C(s, u) {
    const h = u ?? new M(3), w = s[0], p = s[1], x = s[2], z = Math.sqrt(w * w + p * p + x * x);
    return z > 1e-5 ? (h[0] = w / z, h[1] = p / z, h[2] = x / z) : (h[0] = 0, h[1] = 0, h[2] = 0), h;
  }
  function En(s, u) {
    const h = u ?? new M(3);
    return h[0] = -s[0], h[1] = -s[1], h[2] = -s[2], h;
  }
  function H(s, u) {
    const h = u ?? new M(3);
    return h[0] = s[0], h[1] = s[1], h[2] = s[2], h;
  }
  const Hn = H;
  function an(s, u, h) {
    const w = h ?? new M(3);
    return w[0] = s[0] * u[0], w[1] = s[1] * u[1], w[2] = s[2] * u[2], w;
  }
  const On = an;
  function hn(s, u, h) {
    const w = h ?? new M(3);
    return w[0] = s[0] / u[0], w[1] = s[1] / u[1], w[2] = s[2] / u[2], w;
  }
  const $n = hn;
  function Vn(s = 1, u) {
    const h = u ?? new M(3), w = Math.random() * 2 * Math.PI, p = Math.random() * 2 - 1, x = Math.sqrt(1 - p * p) * s;
    return h[0] = Math.cos(w) * x, h[1] = Math.sin(w) * x, h[2] = p * s, h;
  }
  function y(s) {
    const u = s ?? new M(3);
    return u[0] = 0, u[1] = 0, u[2] = 0, u;
  }
  function g(s, u, h) {
    const w = h ?? new M(3), p = s[0], x = s[1], z = s[2], P = u[3] * p + u[7] * x + u[11] * z + u[15] || 1;
    return w[0] = (u[0] * p + u[4] * x + u[8] * z + u[12]) / P, w[1] = (u[1] * p + u[5] * x + u[9] * z + u[13]) / P, w[2] = (u[2] * p + u[6] * x + u[10] * z + u[14]) / P, w;
  }
  function a(s, u, h) {
    const w = h ?? new M(3), p = s[0], x = s[1], z = s[2];
    return w[0] = p * u[0 * 4 + 0] + x * u[1 * 4 + 0] + z * u[2 * 4 + 0], w[1] = p * u[0 * 4 + 1] + x * u[1 * 4 + 1] + z * u[2 * 4 + 1], w[2] = p * u[0 * 4 + 2] + x * u[1 * 4 + 2] + z * u[2 * 4 + 2], w;
  }
  function t(s, u, h) {
    const w = h ?? new M(3), p = s[0], x = s[1], z = s[2];
    return w[0] = p * u[0] + x * u[4] + z * u[8], w[1] = p * u[1] + x * u[5] + z * u[9], w[2] = p * u[2] + x * u[6] + z * u[10], w;
  }
  function r(s, u, h) {
    const w = h ?? new M(3), p = u[0], x = u[1], z = u[2], P = u[3] * 2, A = s[0], q = s[1], I = s[2], Z = x * I - z * q, $ = z * A - p * I, V = p * q - x * A;
    return w[0] = A + Z * P + (x * V - z * $) * 2, w[1] = q + $ * P + (z * Z - p * V) * 2, w[2] = I + V * P + (p * $ - x * Z) * 2, w;
  }
  function o(s, u) {
    const h = u ?? new M(3);
    return h[0] = s[12], h[1] = s[13], h[2] = s[14], h;
  }
  function f(s, u, h) {
    const w = h ?? new M(3), p = u * 4;
    return w[0] = s[p + 0], w[1] = s[p + 1], w[2] = s[p + 2], w;
  }
  function l(s, u) {
    const h = u ?? new M(3), w = s[0], p = s[1], x = s[2], z = s[4], P = s[5], A = s[6], q = s[8], I = s[9], Z = s[10];
    return h[0] = Math.sqrt(w * w + p * p + x * x), h[1] = Math.sqrt(z * z + P * P + A * A), h[2] = Math.sqrt(q * q + I * I + Z * Z), h;
  }
  function D(s, u, h, w) {
    const p = w ?? new M(3), x = [], z = [];
    return x[0] = s[0] - u[0], x[1] = s[1] - u[1], x[2] = s[2] - u[2], z[0] = x[0], z[1] = x[1] * Math.cos(h) - x[2] * Math.sin(h), z[2] = x[1] * Math.sin(h) + x[2] * Math.cos(h), p[0] = z[0] + u[0], p[1] = z[1] + u[1], p[2] = z[2] + u[2], p;
  }
  function d(s, u, h, w) {
    const p = w ?? new M(3), x = [], z = [];
    return x[0] = s[0] - u[0], x[1] = s[1] - u[1], x[2] = s[2] - u[2], z[0] = x[2] * Math.sin(h) + x[0] * Math.cos(h), z[1] = x[1], z[2] = x[2] * Math.cos(h) - x[0] * Math.sin(h), p[0] = z[0] + u[0], p[1] = z[1] + u[1], p[2] = z[2] + u[2], p;
  }
  function n(s, u, h, w) {
    const p = w ?? new M(3), x = [], z = [];
    return x[0] = s[0] - u[0], x[1] = s[1] - u[1], x[2] = s[2] - u[2], z[0] = x[0] * Math.cos(h) - x[1] * Math.sin(h), z[1] = x[0] * Math.sin(h) + x[1] * Math.cos(h), z[2] = x[2], p[0] = z[0] + u[0], p[1] = z[1] + u[1], p[2] = z[2] + u[2], p;
  }
  function i(s, u, h) {
    const w = h ?? new M(3);
    return C(s, w), K(w, u, w);
  }
  function c(s, u, h) {
    const w = h ?? new M(3);
    return B(s) > u ? i(s, u, w) : H(s, w);
  }
  function e(s, u, h) {
    const w = h ?? new M(3);
    return fn(s, u, 0.5, w);
  }
  return {
    create: S,
    fromValues: J,
    set: ln,
    ceil: Mn,
    floor: on,
    round: Zn,
    clamp: Fn,
    add: en,
    addScaled: Xn,
    angle: un,
    subtract: b,
    sub: Yn,
    equalsApproximately: rn,
    equals: Dn,
    lerp: fn,
    lerpV: qn,
    max: Sn,
    min: wn,
    mulScalar: K,
    scale: Pn,
    divScalar: dn,
    inverse: yn,
    invert: In,
    cross: pn,
    dot: xn,
    length: B,
    len: Tn,
    lengthSq: m,
    lenSq: Qn,
    distance: U,
    dist: Y,
    distanceSq: T,
    distSq: X,
    normalize: C,
    negate: En,
    copy: H,
    clone: Hn,
    multiply: an,
    mul: On,
    divide: hn,
    div: $n,
    random: Vn,
    zero: y,
    transformMat4: g,
    transformMat4Upper3x3: a,
    transformMat3: t,
    transformQuat: r,
    getTranslation: o,
    getAxis: f,
    getScaling: l,
    rotateX: D,
    rotateY: d,
    rotateZ: n,
    setLength: i,
    truncate: c,
    midpoint: e
  };
}
const mn = /* @__PURE__ */ new Map();
function Wn(M) {
  let S = mn.get(M);
  return S || (S = rt(M), mn.set(M, S)), S;
}
function it(M) {
  const S = ct(M), J = Wn(M);
  function ln(t, r, o, f, l, D, d, n, i) {
    const c = new M(12);
    return c[3] = 0, c[7] = 0, c[11] = 0, t !== void 0 && (c[0] = t, r !== void 0 && (c[1] = r, o !== void 0 && (c[2] = o, f !== void 0 && (c[4] = f, l !== void 0 && (c[5] = l, D !== void 0 && (c[6] = D, d !== void 0 && (c[8] = d, n !== void 0 && (c[9] = n, i !== void 0 && (c[10] = i))))))))), c;
  }
  function Mn(t, r, o, f, l, D, d, n, i, c) {
    const e = c ?? new M(12);
    return e[0] = t, e[1] = r, e[2] = o, e[3] = 0, e[4] = f, e[5] = l, e[6] = D, e[7] = 0, e[8] = d, e[9] = n, e[10] = i, e[11] = 0, e;
  }
  function on(t, r) {
    const o = r ?? new M(12);
    return o[0] = t[0], o[1] = t[1], o[2] = t[2], o[3] = 0, o[4] = t[4], o[5] = t[5], o[6] = t[6], o[7] = 0, o[8] = t[8], o[9] = t[9], o[10] = t[10], o[11] = 0, o;
  }
  function Zn(t, r) {
    const o = r ?? new M(12), f = t[0], l = t[1], D = t[2], d = t[3], n = f + f, i = l + l, c = D + D, e = f * n, s = l * n, u = l * i, h = D * n, w = D * i, p = D * c, x = d * n, z = d * i, P = d * c;
    return o[0] = 1 - u - p, o[1] = s + P, o[2] = h - z, o[3] = 0, o[4] = s - P, o[5] = 1 - e - p, o[6] = w + x, o[7] = 0, o[8] = h + z, o[9] = w - x, o[10] = 1 - e - u, o[11] = 0, o;
  }
  function Fn(t, r) {
    const o = r ?? new M(12);
    return o[0] = -t[0], o[1] = -t[1], o[2] = -t[2], o[4] = -t[4], o[5] = -t[5], o[6] = -t[6], o[8] = -t[8], o[9] = -t[9], o[10] = -t[10], o;
  }
  function en(t, r, o) {
    const f = o ?? new M(12);
    return f[0] = t[0] * r, f[1] = t[1] * r, f[2] = t[2] * r, f[4] = t[4] * r, f[5] = t[5] * r, f[6] = t[6] * r, f[8] = t[8] * r, f[9] = t[9] * r, f[10] = t[10] * r, f;
  }
  const Xn = en;
  function un(t, r, o) {
    const f = o ?? new M(12);
    return f[0] = t[0] + r[0], f[1] = t[1] + r[1], f[2] = t[2] + r[2], f[4] = t[4] + r[4], f[5] = t[5] + r[5], f[6] = t[6] + r[6], f[8] = t[8] + r[8], f[9] = t[9] + r[9], f[10] = t[10] + r[10], f;
  }
  function b(t, r) {
    const o = r ?? new M(12);
    return o[0] = t[0], o[1] = t[1], o[2] = t[2], o[4] = t[4], o[5] = t[5], o[6] = t[6], o[8] = t[8], o[9] = t[9], o[10] = t[10], o;
  }
  const Yn = b;
  function rn(t, r) {
    return Math.abs(t[0] - r[0]) < F && Math.abs(t[1] - r[1]) < F && Math.abs(t[2] - r[2]) < F && Math.abs(t[4] - r[4]) < F && Math.abs(t[5] - r[5]) < F && Math.abs(t[6] - r[6]) < F && Math.abs(t[8] - r[8]) < F && Math.abs(t[9] - r[9]) < F && Math.abs(t[10] - r[10]) < F;
  }
  function Dn(t, r) {
    return t[0] === r[0] && t[1] === r[1] && t[2] === r[2] && t[4] === r[4] && t[5] === r[5] && t[6] === r[6] && t[8] === r[8] && t[9] === r[9] && t[10] === r[10];
  }
  function fn(t) {
    const r = t ?? new M(12);
    return r[0] = 1, r[1] = 0, r[2] = 0, r[4] = 0, r[5] = 1, r[6] = 0, r[8] = 0, r[9] = 0, r[10] = 1, r;
  }
  function qn(t, r) {
    const o = r ?? new M(12);
    if (o === t) {
      let u;
      return u = t[1], t[1] = t[4], t[4] = u, u = t[2], t[2] = t[8], t[8] = u, u = t[6], t[6] = t[9], t[9] = u, o;
    }
    const f = t[0 * 4 + 0], l = t[0 * 4 + 1], D = t[0 * 4 + 2], d = t[1 * 4 + 0], n = t[1 * 4 + 1], i = t[1 * 4 + 2], c = t[2 * 4 + 0], e = t[2 * 4 + 1], s = t[2 * 4 + 2];
    return o[0] = f, o[1] = d, o[2] = c, o[4] = l, o[5] = n, o[6] = e, o[8] = D, o[9] = i, o[10] = s, o;
  }
  function Sn(t, r) {
    const o = r ?? new M(12), f = t[0 * 4 + 0], l = t[0 * 4 + 1], D = t[0 * 4 + 2], d = t[1 * 4 + 0], n = t[1 * 4 + 1], i = t[1 * 4 + 2], c = t[2 * 4 + 0], e = t[2 * 4 + 1], s = t[2 * 4 + 2], u = s * n - i * e, h = -s * d + i * c, w = e * d - n * c, p = 1 / (f * u + l * h + D * w);
    return o[0] = u * p, o[1] = (-s * l + D * e) * p, o[2] = (i * l - D * n) * p, o[4] = h * p, o[5] = (s * f - D * c) * p, o[6] = (-i * f + D * d) * p, o[8] = w * p, o[9] = (-e * f + l * c) * p, o[10] = (n * f - l * d) * p, o;
  }
  function wn(t) {
    const r = t[0], o = t[0 * 4 + 1], f = t[0 * 4 + 2], l = t[1 * 4 + 0], D = t[1 * 4 + 1], d = t[1 * 4 + 2], n = t[2 * 4 + 0], i = t[2 * 4 + 1], c = t[2 * 4 + 2];
    return r * (D * c - i * d) - l * (o * c - i * f) + n * (o * d - D * f);
  }
  const K = Sn;
  function Pn(t, r, o) {
    const f = o ?? new M(12), l = t[0], D = t[1], d = t[2], n = t[4], i = t[5], c = t[6], e = t[8], s = t[9], u = t[10], h = r[0], w = r[1], p = r[2], x = r[4], z = r[5], P = r[6], A = r[8], q = r[9], I = r[10];
    return f[0] = l * h + n * w + e * p, f[1] = D * h + i * w + s * p, f[2] = d * h + c * w + u * p, f[4] = l * x + n * z + e * P, f[5] = D * x + i * z + s * P, f[6] = d * x + c * z + u * P, f[8] = l * A + n * q + e * I, f[9] = D * A + i * q + s * I, f[10] = d * A + c * q + u * I, f;
  }
  const dn = Pn;
  function yn(t, r, o) {
    const f = o ?? fn();
    return t !== f && (f[0] = t[0], f[1] = t[1], f[2] = t[2], f[4] = t[4], f[5] = t[5], f[6] = t[6]), f[8] = r[0], f[9] = r[1], f[10] = 1, f;
  }
  function In(t, r) {
    const o = r ?? S.create();
    return o[0] = t[8], o[1] = t[9], o;
  }
  function pn(t, r, o) {
    const f = o ?? S.create(), l = r * 4;
    return f[0] = t[l + 0], f[1] = t[l + 1], f;
  }
  function xn(t, r, o, f) {
    const l = f === t ? t : b(t, f), D = o * 4;
    return l[D + 0] = r[0], l[D + 1] = r[1], l;
  }
  function B(t, r) {
    const o = r ?? S.create(), f = t[0], l = t[1], D = t[4], d = t[5];
    return o[0] = Math.sqrt(f * f + l * l), o[1] = Math.sqrt(D * D + d * d), o;
  }
  function Tn(t, r) {
    const o = r ?? J.create(), f = t[0], l = t[1], D = t[2], d = t[4], n = t[5], i = t[6], c = t[8], e = t[9], s = t[10];
    return o[0] = Math.sqrt(f * f + l * l + D * D), o[1] = Math.sqrt(d * d + n * n + i * i), o[2] = Math.sqrt(c * c + e * e + s * s), o;
  }
  function m(t, r) {
    const o = r ?? new M(12);
    return o[0] = 1, o[1] = 0, o[2] = 0, o[4] = 0, o[5] = 1, o[6] = 0, o[8] = t[0], o[9] = t[1], o[10] = 1, o;
  }
  function Qn(t, r, o) {
    const f = o ?? new M(12), l = r[0], D = r[1], d = t[0], n = t[1], i = t[2], c = t[1 * 4 + 0], e = t[1 * 4 + 1], s = t[1 * 4 + 2], u = t[2 * 4 + 0], h = t[2 * 4 + 1], w = t[2 * 4 + 2];
    return t !== f && (f[0] = d, f[1] = n, f[2] = i, f[4] = c, f[5] = e, f[6] = s), f[8] = d * l + c * D + u, f[9] = n * l + e * D + h, f[10] = i * l + s * D + w, f;
  }
  function U(t, r) {
    const o = r ?? new M(12), f = Math.cos(t), l = Math.sin(t);
    return o[0] = f, o[1] = l, o[2] = 0, o[4] = -l, o[5] = f, o[6] = 0, o[8] = 0, o[9] = 0, o[10] = 1, o;
  }
  function Y(t, r, o) {
    const f = o ?? new M(12), l = t[0 * 4 + 0], D = t[0 * 4 + 1], d = t[0 * 4 + 2], n = t[1 * 4 + 0], i = t[1 * 4 + 1], c = t[1 * 4 + 2], e = Math.cos(r), s = Math.sin(r);
    return f[0] = e * l + s * n, f[1] = e * D + s * i, f[2] = e * d + s * c, f[4] = e * n - s * l, f[5] = e * i - s * D, f[6] = e * c - s * d, t !== f && (f[8] = t[8], f[9] = t[9], f[10] = t[10]), f;
  }
  function T(t, r) {
    const o = r ?? new M(12), f = Math.cos(t), l = Math.sin(t);
    return o[0] = 1, o[1] = 0, o[2] = 0, o[4] = 0, o[5] = f, o[6] = l, o[8] = 0, o[9] = -l, o[10] = f, o;
  }
  function X(t, r, o) {
    const f = o ?? new M(12), l = t[4], D = t[5], d = t[6], n = t[8], i = t[9], c = t[10], e = Math.cos(r), s = Math.sin(r);
    return f[4] = e * l + s * n, f[5] = e * D + s * i, f[6] = e * d + s * c, f[8] = e * n - s * l, f[9] = e * i - s * D, f[10] = e * c - s * d, t !== f && (f[0] = t[0], f[1] = t[1], f[2] = t[2]), f;
  }
  function C(t, r) {
    const o = r ?? new M(12), f = Math.cos(t), l = Math.sin(t);
    return o[0] = f, o[1] = 0, o[2] = -l, o[4] = 0, o[5] = 1, o[6] = 0, o[8] = l, o[9] = 0, o[10] = f, o;
  }
  function En(t, r, o) {
    const f = o ?? new M(12), l = t[0 * 4 + 0], D = t[0 * 4 + 1], d = t[0 * 4 + 2], n = t[2 * 4 + 0], i = t[2 * 4 + 1], c = t[2 * 4 + 2], e = Math.cos(r), s = Math.sin(r);
    return f[0] = e * l - s * n, f[1] = e * D - s * i, f[2] = e * d - s * c, f[8] = e * n + s * l, f[9] = e * i + s * D, f[10] = e * c + s * d, t !== f && (f[4] = t[4], f[5] = t[5], f[6] = t[6]), f;
  }
  const H = U, Hn = Y;
  function an(t, r) {
    const o = r ?? new M(12);
    return o[0] = t[0], o[1] = 0, o[2] = 0, o[4] = 0, o[5] = t[1], o[6] = 0, o[8] = 0, o[9] = 0, o[10] = 1, o;
  }
  function On(t, r, o) {
    const f = o ?? new M(12), l = r[0], D = r[1];
    return f[0] = l * t[0 * 4 + 0], f[1] = l * t[0 * 4 + 1], f[2] = l * t[0 * 4 + 2], f[4] = D * t[1 * 4 + 0], f[5] = D * t[1 * 4 + 1], f[6] = D * t[1 * 4 + 2], t !== f && (f[8] = t[8], f[9] = t[9], f[10] = t[10]), f;
  }
  function hn(t, r) {
    const o = r ?? new M(12);
    return o[0] = t[0], o[1] = 0, o[2] = 0, o[4] = 0, o[5] = t[1], o[6] = 0, o[8] = 0, o[9] = 0, o[10] = t[2], o;
  }
  function $n(t, r, o) {
    const f = o ?? new M(12), l = r[0], D = r[1], d = r[2];
    return f[0] = l * t[0 * 4 + 0], f[1] = l * t[0 * 4 + 1], f[2] = l * t[0 * 4 + 2], f[4] = D * t[1 * 4 + 0], f[5] = D * t[1 * 4 + 1], f[6] = D * t[1 * 4 + 2], f[8] = d * t[2 * 4 + 0], f[9] = d * t[2 * 4 + 1], f[10] = d * t[2 * 4 + 2], f;
  }
  function Vn(t, r) {
    const o = r ?? new M(12);
    return o[0] = t, o[1] = 0, o[2] = 0, o[4] = 0, o[5] = t, o[6] = 0, o[8] = 0, o[9] = 0, o[10] = 1, o;
  }
  function y(t, r, o) {
    const f = o ?? new M(12);
    return f[0] = r * t[0 * 4 + 0], f[1] = r * t[0 * 4 + 1], f[2] = r * t[0 * 4 + 2], f[4] = r * t[1 * 4 + 0], f[5] = r * t[1 * 4 + 1], f[6] = r * t[1 * 4 + 2], t !== f && (f[8] = t[8], f[9] = t[9], f[10] = t[10]), f;
  }
  function g(t, r) {
    const o = r ?? new M(12);
    return o[0] = t, o[1] = 0, o[2] = 0, o[4] = 0, o[5] = t, o[6] = 0, o[8] = 0, o[9] = 0, o[10] = t, o;
  }
  function a(t, r, o) {
    const f = o ?? new M(12);
    return f[0] = r * t[0 * 4 + 0], f[1] = r * t[0 * 4 + 1], f[2] = r * t[0 * 4 + 2], f[4] = r * t[1 * 4 + 0], f[5] = r * t[1 * 4 + 1], f[6] = r * t[1 * 4 + 2], f[8] = r * t[2 * 4 + 0], f[9] = r * t[2 * 4 + 1], f[10] = r * t[2 * 4 + 2], f;
  }
  return {
    add: un,
    clone: Yn,
    copy: b,
    create: ln,
    determinant: wn,
    equals: Dn,
    equalsApproximately: rn,
    fromMat4: on,
    fromQuat: Zn,
    get3DScaling: Tn,
    getAxis: pn,
    getScaling: B,
    getTranslation: In,
    identity: fn,
    inverse: Sn,
    invert: K,
    mul: dn,
    mulScalar: Xn,
    multiply: Pn,
    multiplyScalar: en,
    negate: Fn,
    rotate: Y,
    rotateX: X,
    rotateY: En,
    rotateZ: Hn,
    rotation: U,
    rotationX: T,
    rotationY: C,
    rotationZ: H,
    scale: On,
    scale3D: $n,
    scaling: an,
    scaling3D: hn,
    set: Mn,
    setAxis: xn,
    setTranslation: yn,
    translate: Qn,
    translation: m,
    transpose: qn,
    uniformScale: y,
    uniformScale3D: a,
    uniformScaling: Vn,
    uniformScaling3D: g
  };
}
const Cn = /* @__PURE__ */ new Map();
function ft(M) {
  let S = Cn.get(M);
  return S || (S = it(M), Cn.set(M, S)), S;
}
function wt(M) {
  const S = Wn(M);
  function J(n, i, c, e, s, u, h, w, p, x, z, P, A, q, I, Z) {
    const $ = new M(16);
    return n !== void 0 && ($[0] = n, i !== void 0 && ($[1] = i, c !== void 0 && ($[2] = c, e !== void 0 && ($[3] = e, s !== void 0 && ($[4] = s, u !== void 0 && ($[5] = u, h !== void 0 && ($[6] = h, w !== void 0 && ($[7] = w, p !== void 0 && ($[8] = p, x !== void 0 && ($[9] = x, z !== void 0 && ($[10] = z, P !== void 0 && ($[11] = P, A !== void 0 && ($[12] = A, q !== void 0 && ($[13] = q, I !== void 0 && ($[14] = I, Z !== void 0 && ($[15] = Z)))))))))))))))), $;
  }
  function ln(n, i, c, e, s, u, h, w, p, x, z, P, A, q, I, Z, $) {
    const V = $ ?? new M(16);
    return V[0] = n, V[1] = i, V[2] = c, V[3] = e, V[4] = s, V[5] = u, V[6] = h, V[7] = w, V[8] = p, V[9] = x, V[10] = z, V[11] = P, V[12] = A, V[13] = q, V[14] = I, V[15] = Z, V;
  }
  function Mn(n, i) {
    const c = i ?? new M(16);
    return c[0] = n[0], c[1] = n[1], c[2] = n[2], c[3] = 0, c[4] = n[4], c[5] = n[5], c[6] = n[6], c[7] = 0, c[8] = n[8], c[9] = n[9], c[10] = n[10], c[11] = 0, c[12] = 0, c[13] = 0, c[14] = 0, c[15] = 1, c;
  }
  function on(n, i) {
    const c = i ?? new M(16), e = n[0], s = n[1], u = n[2], h = n[3], w = e + e, p = s + s, x = u + u, z = e * w, P = s * w, A = s * p, q = u * w, I = u * p, Z = u * x, $ = h * w, V = h * p, E = h * x;
    return c[0] = 1 - A - Z, c[1] = P + E, c[2] = q - V, c[3] = 0, c[4] = P - E, c[5] = 1 - z - Z, c[6] = I + $, c[7] = 0, c[8] = q + V, c[9] = I - $, c[10] = 1 - z - A, c[11] = 0, c[12] = 0, c[13] = 0, c[14] = 0, c[15] = 1, c;
  }
  function Zn(n, i) {
    const c = i ?? new M(16);
    return c[0] = -n[0], c[1] = -n[1], c[2] = -n[2], c[3] = -n[3], c[4] = -n[4], c[5] = -n[5], c[6] = -n[6], c[7] = -n[7], c[8] = -n[8], c[9] = -n[9], c[10] = -n[10], c[11] = -n[11], c[12] = -n[12], c[13] = -n[13], c[14] = -n[14], c[15] = -n[15], c;
  }
  function Fn(n, i, c) {
    const e = c ?? new M(16);
    return e[0] = n[0] + i[0], e[1] = n[1] + i[1], e[2] = n[2] + i[2], e[3] = n[3] + i[3], e[4] = n[4] + i[4], e[5] = n[5] + i[5], e[6] = n[6] + i[6], e[7] = n[7] + i[7], e[8] = n[8] + i[8], e[9] = n[9] + i[9], e[10] = n[10] + i[10], e[11] = n[11] + i[11], e[12] = n[12] + i[12], e[13] = n[13] + i[13], e[14] = n[14] + i[14], e[15] = n[15] + i[15], e;
  }
  function en(n, i, c) {
    const e = c ?? new M(16);
    return e[0] = n[0] * i, e[1] = n[1] * i, e[2] = n[2] * i, e[3] = n[3] * i, e[4] = n[4] * i, e[5] = n[5] * i, e[6] = n[6] * i, e[7] = n[7] * i, e[8] = n[8] * i, e[9] = n[9] * i, e[10] = n[10] * i, e[11] = n[11] * i, e[12] = n[12] * i, e[13] = n[13] * i, e[14] = n[14] * i, e[15] = n[15] * i, e;
  }
  const Xn = en;
  function un(n, i) {
    const c = i ?? new M(16);
    return c[0] = n[0], c[1] = n[1], c[2] = n[2], c[3] = n[3], c[4] = n[4], c[5] = n[5], c[6] = n[6], c[7] = n[7], c[8] = n[8], c[9] = n[9], c[10] = n[10], c[11] = n[11], c[12] = n[12], c[13] = n[13], c[14] = n[14], c[15] = n[15], c;
  }
  const b = un;
  function Yn(n, i) {
    return Math.abs(n[0] - i[0]) < F && Math.abs(n[1] - i[1]) < F && Math.abs(n[2] - i[2]) < F && Math.abs(n[3] - i[3]) < F && Math.abs(n[4] - i[4]) < F && Math.abs(n[5] - i[5]) < F && Math.abs(n[6] - i[6]) < F && Math.abs(n[7] - i[7]) < F && Math.abs(n[8] - i[8]) < F && Math.abs(n[9] - i[9]) < F && Math.abs(n[10] - i[10]) < F && Math.abs(n[11] - i[11]) < F && Math.abs(n[12] - i[12]) < F && Math.abs(n[13] - i[13]) < F && Math.abs(n[14] - i[14]) < F && Math.abs(n[15] - i[15]) < F;
  }
  function rn(n, i) {
    return n[0] === i[0] && n[1] === i[1] && n[2] === i[2] && n[3] === i[3] && n[4] === i[4] && n[5] === i[5] && n[6] === i[6] && n[7] === i[7] && n[8] === i[8] && n[9] === i[9] && n[10] === i[10] && n[11] === i[11] && n[12] === i[12] && n[13] === i[13] && n[14] === i[14] && n[15] === i[15];
  }
  function Dn(n) {
    const i = n ?? new M(16);
    return i[0] = 1, i[1] = 0, i[2] = 0, i[3] = 0, i[4] = 0, i[5] = 1, i[6] = 0, i[7] = 0, i[8] = 0, i[9] = 0, i[10] = 1, i[11] = 0, i[12] = 0, i[13] = 0, i[14] = 0, i[15] = 1, i;
  }
  function fn(n, i) {
    const c = i ?? new M(16);
    if (c === n) {
      let Q;
      return Q = n[1], n[1] = n[4], n[4] = Q, Q = n[2], n[2] = n[8], n[8] = Q, Q = n[3], n[3] = n[12], n[12] = Q, Q = n[6], n[6] = n[9], n[9] = Q, Q = n[7], n[7] = n[13], n[13] = Q, Q = n[11], n[11] = n[14], n[14] = Q, c;
    }
    const e = n[0 * 4 + 0], s = n[0 * 4 + 1], u = n[0 * 4 + 2], h = n[0 * 4 + 3], w = n[1 * 4 + 0], p = n[1 * 4 + 1], x = n[1 * 4 + 2], z = n[1 * 4 + 3], P = n[2 * 4 + 0], A = n[2 * 4 + 1], q = n[2 * 4 + 2], I = n[2 * 4 + 3], Z = n[3 * 4 + 0], $ = n[3 * 4 + 1], V = n[3 * 4 + 2], E = n[3 * 4 + 3];
    return c[0] = e, c[1] = w, c[2] = P, c[3] = Z, c[4] = s, c[5] = p, c[6] = A, c[7] = $, c[8] = u, c[9] = x, c[10] = q, c[11] = V, c[12] = h, c[13] = z, c[14] = I, c[15] = E, c;
  }
  function qn(n, i) {
    const c = i ?? new M(16), e = n[0 * 4 + 0], s = n[0 * 4 + 1], u = n[0 * 4 + 2], h = n[0 * 4 + 3], w = n[1 * 4 + 0], p = n[1 * 4 + 1], x = n[1 * 4 + 2], z = n[1 * 4 + 3], P = n[2 * 4 + 0], A = n[2 * 4 + 1], q = n[2 * 4 + 2], I = n[2 * 4 + 3], Z = n[3 * 4 + 0], $ = n[3 * 4 + 1], V = n[3 * 4 + 2], E = n[3 * 4 + 3], Q = q * E, O = V * I, j = x * E, L = V * z, G = x * I, W = q * z, _ = u * E, N = V * h, R = u * I, k = q * h, nn = u * z, tn = x * h, sn = P * $, cn = Z * A, zn = w * $, gn = Z * p, An = w * A, jn = P * p, Ln = e * $, Bn = Z * s, Gn = e * A, Jn = P * s, Kn = e * p, Un = w * s, Nn = Q * p + L * A + G * $ - (O * p + j * A + W * $), Rn = O * s + _ * A + k * $ - (Q * s + N * A + R * $), kn = j * s + N * p + nn * $ - (L * s + _ * p + tn * $), vn = W * s + R * p + tn * A - (G * s + k * p + nn * A), v = 1 / (e * Nn + w * Rn + P * kn + Z * vn);
    return c[0] = v * Nn, c[1] = v * Rn, c[2] = v * kn, c[3] = v * vn, c[4] = v * (O * w + j * P + W * Z - (Q * w + L * P + G * Z)), c[5] = v * (Q * e + N * P + R * Z - (O * e + _ * P + k * Z)), c[6] = v * (L * e + _ * w + tn * Z - (j * e + N * w + nn * Z)), c[7] = v * (G * e + k * w + nn * P - (W * e + R * w + tn * P)), c[8] = v * (sn * z + gn * I + An * E - (cn * z + zn * I + jn * E)), c[9] = v * (cn * h + Ln * I + Jn * E - (sn * h + Bn * I + Gn * E)), c[10] = v * (zn * h + Bn * z + Kn * E - (gn * h + Ln * z + Un * E)), c[11] = v * (jn * h + Gn * z + Un * I - (An * h + Jn * z + Kn * I)), c[12] = v * (zn * q + jn * V + cn * x - (An * V + sn * x + gn * q)), c[13] = v * (Gn * V + sn * u + Bn * q - (Ln * q + Jn * V + cn * u)), c[14] = v * (Ln * x + Un * V + gn * u - (Kn * V + zn * u + Bn * x)), c[15] = v * (Kn * q + An * u + Jn * x - (Gn * x + Un * q + jn * u)), c;
  }
  function Sn(n) {
    const i = n[0], c = n[0 * 4 + 1], e = n[0 * 4 + 2], s = n[0 * 4 + 3], u = n[1 * 4 + 0], h = n[1 * 4 + 1], w = n[1 * 4 + 2], p = n[1 * 4 + 3], x = n[2 * 4 + 0], z = n[2 * 4 + 1], P = n[2 * 4 + 2], A = n[2 * 4 + 3], q = n[3 * 4 + 0], I = n[3 * 4 + 1], Z = n[3 * 4 + 2], $ = n[3 * 4 + 3], V = P * $, E = Z * A, Q = w * $, O = Z * p, j = w * A, L = P * p, G = e * $, W = Z * s, _ = e * A, N = P * s, R = e * p, k = w * s, nn = V * h + O * z + j * I - (E * h + Q * z + L * I), tn = E * c + G * z + N * I - (V * c + W * z + _ * I), sn = Q * c + W * h + R * I - (O * c + G * h + k * I), cn = L * c + _ * h + k * z - (j * c + N * h + R * z);
    return i * nn + u * tn + x * sn + q * cn;
  }
  const wn = qn;
  function K(n, i, c) {
    const e = c ?? new M(16), s = n[0], u = n[1], h = n[2], w = n[3], p = n[4], x = n[5], z = n[6], P = n[7], A = n[8], q = n[9], I = n[10], Z = n[11], $ = n[12], V = n[13], E = n[14], Q = n[15], O = i[0], j = i[1], L = i[2], G = i[3], W = i[4], _ = i[5], N = i[6], R = i[7], k = i[8], nn = i[9], tn = i[10], sn = i[11], cn = i[12], zn = i[13], gn = i[14], An = i[15];
    return e[0] = s * O + p * j + A * L + $ * G, e[1] = u * O + x * j + q * L + V * G, e[2] = h * O + z * j + I * L + E * G, e[3] = w * O + P * j + Z * L + Q * G, e[4] = s * W + p * _ + A * N + $ * R, e[5] = u * W + x * _ + q * N + V * R, e[6] = h * W + z * _ + I * N + E * R, e[7] = w * W + P * _ + Z * N + Q * R, e[8] = s * k + p * nn + A * tn + $ * sn, e[9] = u * k + x * nn + q * tn + V * sn, e[10] = h * k + z * nn + I * tn + E * sn, e[11] = w * k + P * nn + Z * tn + Q * sn, e[12] = s * cn + p * zn + A * gn + $ * An, e[13] = u * cn + x * zn + q * gn + V * An, e[14] = h * cn + z * zn + I * gn + E * An, e[15] = w * cn + P * zn + Z * gn + Q * An, e;
  }
  const Pn = K;
  function dn(n, i, c) {
    const e = c ?? Dn();
    return n !== e && (e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], e[9] = n[9], e[10] = n[10], e[11] = n[11]), e[12] = i[0], e[13] = i[1], e[14] = i[2], e[15] = 1, e;
  }
  function yn(n, i) {
    const c = i ?? S.create();
    return c[0] = n[12], c[1] = n[13], c[2] = n[14], c;
  }
  function In(n, i, c) {
    const e = c ?? S.create(), s = i * 4;
    return e[0] = n[s + 0], e[1] = n[s + 1], e[2] = n[s + 2], e;
  }
  function pn(n, i, c, e) {
    const s = e === n ? e : un(n, e), u = c * 4;
    return s[u + 0] = i[0], s[u + 1] = i[1], s[u + 2] = i[2], s;
  }
  function xn(n, i) {
    const c = i ?? S.create(), e = n[0], s = n[1], u = n[2], h = n[4], w = n[5], p = n[6], x = n[8], z = n[9], P = n[10];
    return c[0] = Math.sqrt(e * e + s * s + u * u), c[1] = Math.sqrt(h * h + w * w + p * p), c[2] = Math.sqrt(x * x + z * z + P * P), c;
  }
  function B(n, i, c, e, s) {
    const u = s ?? new M(16), h = Math.tan(Math.PI * 0.5 - 0.5 * n);
    if (u[0] = h / i, u[1] = 0, u[2] = 0, u[3] = 0, u[4] = 0, u[5] = h, u[6] = 0, u[7] = 0, u[8] = 0, u[9] = 0, u[11] = -1, u[12] = 0, u[13] = 0, u[15] = 0, Number.isFinite(e)) {
      const w = 1 / (c - e);
      u[10] = e * w, u[14] = e * c * w;
    } else
      u[10] = -1, u[14] = -c;
    return u;
  }
  function Tn(n, i, c, e = 1 / 0, s) {
    const u = s ?? new M(16), h = 1 / Math.tan(n * 0.5);
    if (u[0] = h / i, u[1] = 0, u[2] = 0, u[3] = 0, u[4] = 0, u[5] = h, u[6] = 0, u[7] = 0, u[8] = 0, u[9] = 0, u[11] = -1, u[12] = 0, u[13] = 0, u[15] = 0, e === 1 / 0)
      u[10] = 0, u[14] = c;
    else {
      const w = 1 / (e - c);
      u[10] = c * w, u[14] = e * c * w;
    }
    return u;
  }
  function m(n, i, c, e, s, u, h) {
    const w = h ?? new M(16);
    return w[0] = 2 / (i - n), w[1] = 0, w[2] = 0, w[3] = 0, w[4] = 0, w[5] = 2 / (e - c), w[6] = 0, w[7] = 0, w[8] = 0, w[9] = 0, w[10] = 1 / (s - u), w[11] = 0, w[12] = (i + n) / (n - i), w[13] = (e + c) / (c - e), w[14] = s / (s - u), w[15] = 1, w;
  }
  function Qn(n, i, c, e, s, u, h) {
    const w = h ?? new M(16), p = i - n, x = e - c, z = s - u;
    return w[0] = 2 * s / p, w[1] = 0, w[2] = 0, w[3] = 0, w[4] = 0, w[5] = 2 * s / x, w[6] = 0, w[7] = 0, w[8] = (n + i) / p, w[9] = (e + c) / x, w[10] = u / z, w[11] = -1, w[12] = 0, w[13] = 0, w[14] = s * u / z, w[15] = 0, w;
  }
  function U(n, i, c, e, s, u = 1 / 0, h) {
    const w = h ?? new M(16), p = i - n, x = e - c;
    if (w[0] = 2 * s / p, w[1] = 0, w[2] = 0, w[3] = 0, w[4] = 0, w[5] = 2 * s / x, w[6] = 0, w[7] = 0, w[8] = (n + i) / p, w[9] = (e + c) / x, w[11] = -1, w[12] = 0, w[13] = 0, w[15] = 0, u === 1 / 0)
      w[10] = 0, w[14] = s;
    else {
      const z = 1 / (u - s);
      w[10] = s * z, w[14] = u * s * z;
    }
    return w;
  }
  const Y = S.create(), T = S.create(), X = S.create();
  function C(n, i, c, e) {
    const s = e ?? new M(16);
    return S.normalize(S.subtract(i, n, X), X), S.normalize(S.cross(c, X, Y), Y), S.normalize(S.cross(X, Y, T), T), s[0] = Y[0], s[1] = Y[1], s[2] = Y[2], s[3] = 0, s[4] = T[0], s[5] = T[1], s[6] = T[2], s[7] = 0, s[8] = X[0], s[9] = X[1], s[10] = X[2], s[11] = 0, s[12] = n[0], s[13] = n[1], s[14] = n[2], s[15] = 1, s;
  }
  function En(n, i, c, e) {
    const s = e ?? new M(16);
    return S.normalize(S.subtract(n, i, X), X), S.normalize(S.cross(c, X, Y), Y), S.normalize(S.cross(X, Y, T), T), s[0] = Y[0], s[1] = Y[1], s[2] = Y[2], s[3] = 0, s[4] = T[0], s[5] = T[1], s[6] = T[2], s[7] = 0, s[8] = X[0], s[9] = X[1], s[10] = X[2], s[11] = 0, s[12] = n[0], s[13] = n[1], s[14] = n[2], s[15] = 1, s;
  }
  function H(n, i, c, e) {
    const s = e ?? new M(16);
    return S.normalize(S.subtract(n, i, X), X), S.normalize(S.cross(c, X, Y), Y), S.normalize(S.cross(X, Y, T), T), s[0] = Y[0], s[1] = T[0], s[2] = X[0], s[3] = 0, s[4] = Y[1], s[5] = T[1], s[6] = X[1], s[7] = 0, s[8] = Y[2], s[9] = T[2], s[10] = X[2], s[11] = 0, s[12] = -(Y[0] * n[0] + Y[1] * n[1] + Y[2] * n[2]), s[13] = -(T[0] * n[0] + T[1] * n[1] + T[2] * n[2]), s[14] = -(X[0] * n[0] + X[1] * n[1] + X[2] * n[2]), s[15] = 1, s;
  }
  function Hn(n, i) {
    const c = i ?? new M(16);
    return c[0] = 1, c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = 1, c[6] = 0, c[7] = 0, c[8] = 0, c[9] = 0, c[10] = 1, c[11] = 0, c[12] = n[0], c[13] = n[1], c[14] = n[2], c[15] = 1, c;
  }
  function an(n, i, c) {
    const e = c ?? new M(16), s = i[0], u = i[1], h = i[2], w = n[0], p = n[1], x = n[2], z = n[3], P = n[1 * 4 + 0], A = n[1 * 4 + 1], q = n[1 * 4 + 2], I = n[1 * 4 + 3], Z = n[2 * 4 + 0], $ = n[2 * 4 + 1], V = n[2 * 4 + 2], E = n[2 * 4 + 3], Q = n[3 * 4 + 0], O = n[3 * 4 + 1], j = n[3 * 4 + 2], L = n[3 * 4 + 3];
    return n !== e && (e[0] = w, e[1] = p, e[2] = x, e[3] = z, e[4] = P, e[5] = A, e[6] = q, e[7] = I, e[8] = Z, e[9] = $, e[10] = V, e[11] = E), e[12] = w * s + P * u + Z * h + Q, e[13] = p * s + A * u + $ * h + O, e[14] = x * s + q * u + V * h + j, e[15] = z * s + I * u + E * h + L, e;
  }
  function On(n, i) {
    const c = i ?? new M(16), e = Math.cos(n), s = Math.sin(n);
    return c[0] = 1, c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = e, c[6] = s, c[7] = 0, c[8] = 0, c[9] = -s, c[10] = e, c[11] = 0, c[12] = 0, c[13] = 0, c[14] = 0, c[15] = 1, c;
  }
  function hn(n, i, c) {
    const e = c ?? new M(16), s = n[4], u = n[5], h = n[6], w = n[7], p = n[8], x = n[9], z = n[10], P = n[11], A = Math.cos(i), q = Math.sin(i);
    return e[4] = A * s + q * p, e[5] = A * u + q * x, e[6] = A * h + q * z, e[7] = A * w + q * P, e[8] = A * p - q * s, e[9] = A * x - q * u, e[10] = A * z - q * h, e[11] = A * P - q * w, n !== e && (e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15]), e;
  }
  function $n(n, i) {
    const c = i ?? new M(16), e = Math.cos(n), s = Math.sin(n);
    return c[0] = e, c[1] = 0, c[2] = -s, c[3] = 0, c[4] = 0, c[5] = 1, c[6] = 0, c[7] = 0, c[8] = s, c[9] = 0, c[10] = e, c[11] = 0, c[12] = 0, c[13] = 0, c[14] = 0, c[15] = 1, c;
  }
  function Vn(n, i, c) {
    const e = c ?? new M(16), s = n[0 * 4 + 0], u = n[0 * 4 + 1], h = n[0 * 4 + 2], w = n[0 * 4 + 3], p = n[2 * 4 + 0], x = n[2 * 4 + 1], z = n[2 * 4 + 2], P = n[2 * 4 + 3], A = Math.cos(i), q = Math.sin(i);
    return e[0] = A * s - q * p, e[1] = A * u - q * x, e[2] = A * h - q * z, e[3] = A * w - q * P, e[8] = A * p + q * s, e[9] = A * x + q * u, e[10] = A * z + q * h, e[11] = A * P + q * w, n !== e && (e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15]), e;
  }
  function y(n, i) {
    const c = i ?? new M(16), e = Math.cos(n), s = Math.sin(n);
    return c[0] = e, c[1] = s, c[2] = 0, c[3] = 0, c[4] = -s, c[5] = e, c[6] = 0, c[7] = 0, c[8] = 0, c[9] = 0, c[10] = 1, c[11] = 0, c[12] = 0, c[13] = 0, c[14] = 0, c[15] = 1, c;
  }
  function g(n, i, c) {
    const e = c ?? new M(16), s = n[0 * 4 + 0], u = n[0 * 4 + 1], h = n[0 * 4 + 2], w = n[0 * 4 + 3], p = n[1 * 4 + 0], x = n[1 * 4 + 1], z = n[1 * 4 + 2], P = n[1 * 4 + 3], A = Math.cos(i), q = Math.sin(i);
    return e[0] = A * s + q * p, e[1] = A * u + q * x, e[2] = A * h + q * z, e[3] = A * w + q * P, e[4] = A * p - q * s, e[5] = A * x - q * u, e[6] = A * z - q * h, e[7] = A * P - q * w, n !== e && (e[8] = n[8], e[9] = n[9], e[10] = n[10], e[11] = n[11], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15]), e;
  }
  function a(n, i, c) {
    const e = c ?? new M(16);
    let s = n[0], u = n[1], h = n[2];
    const w = Math.sqrt(s * s + u * u + h * h);
    s /= w, u /= w, h /= w;
    const p = s * s, x = u * u, z = h * h, P = Math.cos(i), A = Math.sin(i), q = 1 - P;
    return e[0] = p + (1 - p) * P, e[1] = s * u * q + h * A, e[2] = s * h * q - u * A, e[3] = 0, e[4] = s * u * q - h * A, e[5] = x + (1 - x) * P, e[6] = u * h * q + s * A, e[7] = 0, e[8] = s * h * q + u * A, e[9] = u * h * q - s * A, e[10] = z + (1 - z) * P, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
  }
  const t = a;
  function r(n, i, c, e) {
    const s = e ?? new M(16);
    let u = i[0], h = i[1], w = i[2];
    const p = Math.sqrt(u * u + h * h + w * w);
    u /= p, h /= p, w /= p;
    const x = u * u, z = h * h, P = w * w, A = Math.cos(c), q = Math.sin(c), I = 1 - A, Z = x + (1 - x) * A, $ = u * h * I + w * q, V = u * w * I - h * q, E = u * h * I - w * q, Q = z + (1 - z) * A, O = h * w * I + u * q, j = u * w * I + h * q, L = h * w * I - u * q, G = P + (1 - P) * A, W = n[0], _ = n[1], N = n[2], R = n[3], k = n[4], nn = n[5], tn = n[6], sn = n[7], cn = n[8], zn = n[9], gn = n[10], An = n[11];
    return s[0] = Z * W + $ * k + V * cn, s[1] = Z * _ + $ * nn + V * zn, s[2] = Z * N + $ * tn + V * gn, s[3] = Z * R + $ * sn + V * An, s[4] = E * W + Q * k + O * cn, s[5] = E * _ + Q * nn + O * zn, s[6] = E * N + Q * tn + O * gn, s[7] = E * R + Q * sn + O * An, s[8] = j * W + L * k + G * cn, s[9] = j * _ + L * nn + G * zn, s[10] = j * N + L * tn + G * gn, s[11] = j * R + L * sn + G * An, n !== s && (s[12] = n[12], s[13] = n[13], s[14] = n[14], s[15] = n[15]), s;
  }
  const o = r;
  function f(n, i) {
    const c = i ?? new M(16);
    return c[0] = n[0], c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = n[1], c[6] = 0, c[7] = 0, c[8] = 0, c[9] = 0, c[10] = n[2], c[11] = 0, c[12] = 0, c[13] = 0, c[14] = 0, c[15] = 1, c;
  }
  function l(n, i, c) {
    const e = c ?? new M(16), s = i[0], u = i[1], h = i[2];
    return e[0] = s * n[0 * 4 + 0], e[1] = s * n[0 * 4 + 1], e[2] = s * n[0 * 4 + 2], e[3] = s * n[0 * 4 + 3], e[4] = u * n[1 * 4 + 0], e[5] = u * n[1 * 4 + 1], e[6] = u * n[1 * 4 + 2], e[7] = u * n[1 * 4 + 3], e[8] = h * n[2 * 4 + 0], e[9] = h * n[2 * 4 + 1], e[10] = h * n[2 * 4 + 2], e[11] = h * n[2 * 4 + 3], n !== e && (e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15]), e;
  }
  function D(n, i) {
    const c = i ?? new M(16);
    return c[0] = n, c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = n, c[6] = 0, c[7] = 0, c[8] = 0, c[9] = 0, c[10] = n, c[11] = 0, c[12] = 0, c[13] = 0, c[14] = 0, c[15] = 1, c;
  }
  function d(n, i, c) {
    const e = c ?? new M(16);
    return e[0] = i * n[0 * 4 + 0], e[1] = i * n[0 * 4 + 1], e[2] = i * n[0 * 4 + 2], e[3] = i * n[0 * 4 + 3], e[4] = i * n[1 * 4 + 0], e[5] = i * n[1 * 4 + 1], e[6] = i * n[1 * 4 + 2], e[7] = i * n[1 * 4 + 3], e[8] = i * n[2 * 4 + 0], e[9] = i * n[2 * 4 + 1], e[10] = i * n[2 * 4 + 2], e[11] = i * n[2 * 4 + 3], n !== e && (e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15]), e;
  }
  return {
    add: Fn,
    aim: C,
    axisRotate: r,
    axisRotation: a,
    cameraAim: En,
    clone: b,
    copy: un,
    create: J,
    determinant: Sn,
    equals: rn,
    equalsApproximately: Yn,
    fromMat3: Mn,
    fromQuat: on,
    frustum: Qn,
    frustumReverseZ: U,
    getAxis: In,
    getScaling: xn,
    getTranslation: yn,
    identity: Dn,
    inverse: qn,
    invert: wn,
    lookAt: H,
    mul: Pn,
    mulScalar: Xn,
    multiply: K,
    multiplyScalar: en,
    negate: Zn,
    ortho: m,
    perspective: B,
    perspectiveReverseZ: Tn,
    rotate: o,
    rotateX: hn,
    rotateY: Vn,
    rotateZ: g,
    rotation: t,
    rotationX: On,
    rotationY: $n,
    rotationZ: y,
    scale: l,
    scaling: f,
    set: ln,
    setAxis: pn,
    setTranslation: dn,
    translate: an,
    translation: Hn,
    transpose: fn,
    uniformScale: d,
    uniformScaling: D
  };
}
const nt = /* @__PURE__ */ new Map();
function at(M) {
  let S = nt.get(M);
  return S || (S = wt(M), nt.set(M, S)), S;
}
function ht(M) {
  const S = Wn(M);
  function J(y, g, a, t) {
    const r = new M(4);
    return y !== void 0 && (r[0] = y, g !== void 0 && (r[1] = g, a !== void 0 && (r[2] = a, t !== void 0 && (r[3] = t)))), r;
  }
  const ln = J;
  function Mn(y, g, a, t, r) {
    const o = r ?? new M(4);
    return o[0] = y, o[1] = g, o[2] = a, o[3] = t, o;
  }
  function on(y, g, a) {
    const t = a ?? new M(4), r = g * 0.5, o = Math.sin(r);
    return t[0] = o * y[0], t[1] = o * y[1], t[2] = o * y[2], t[3] = Math.cos(r), t;
  }
  function Zn(y, g) {
    const a = g ?? S.create(3), t = Math.acos(y[3]) * 2, r = Math.sin(t * 0.5);
    return r > F ? (a[0] = y[0] / r, a[1] = y[1] / r, a[2] = y[2] / r) : (a[0] = 1, a[1] = 0, a[2] = 0), { angle: t, axis: a };
  }
  function Fn(y, g) {
    const a = B(y, g);
    return Math.acos(2 * a * a - 1);
  }
  function en(y, g, a) {
    const t = a ?? new M(4), r = y[0], o = y[1], f = y[2], l = y[3], D = g[0], d = g[1], n = g[2], i = g[3];
    return t[0] = r * i + l * D + o * n - f * d, t[1] = o * i + l * d + f * D - r * n, t[2] = f * i + l * n + r * d - o * D, t[3] = l * i - r * D - o * d - f * n, t;
  }
  const Xn = en;
  function un(y, g, a) {
    const t = a ?? new M(4), r = g * 0.5, o = y[0], f = y[1], l = y[2], D = y[3], d = Math.sin(r), n = Math.cos(r);
    return t[0] = o * n + D * d, t[1] = f * n + l * d, t[2] = l * n - f * d, t[3] = D * n - o * d, t;
  }
  function b(y, g, a) {
    const t = a ?? new M(4), r = g * 0.5, o = y[0], f = y[1], l = y[2], D = y[3], d = Math.sin(r), n = Math.cos(r);
    return t[0] = o * n - l * d, t[1] = f * n + D * d, t[2] = l * n + o * d, t[3] = D * n - f * d, t;
  }
  function Yn(y, g, a) {
    const t = a ?? new M(4), r = g * 0.5, o = y[0], f = y[1], l = y[2], D = y[3], d = Math.sin(r), n = Math.cos(r);
    return t[0] = o * n + f * d, t[1] = f * n - o * d, t[2] = l * n + D * d, t[3] = D * n - l * d, t;
  }
  function rn(y, g, a, t) {
    const r = t ?? new M(4), o = y[0], f = y[1], l = y[2], D = y[3];
    let d = g[0], n = g[1], i = g[2], c = g[3], e = o * d + f * n + l * i + D * c;
    e < 0 && (e = -e, d = -d, n = -n, i = -i, c = -c);
    let s, u;
    if (1 - e > F) {
      const h = Math.acos(e), w = Math.sin(h);
      s = Math.sin((1 - a) * h) / w, u = Math.sin(a * h) / w;
    } else
      s = 1 - a, u = a;
    return r[0] = s * o + u * d, r[1] = s * f + u * n, r[2] = s * l + u * i, r[3] = s * D + u * c, r;
  }
  function Dn(y, g) {
    const a = g ?? new M(4), t = y[0], r = y[1], o = y[2], f = y[3], l = t * t + r * r + o * o + f * f, D = l ? 1 / l : 0;
    return a[0] = -t * D, a[1] = -r * D, a[2] = -o * D, a[3] = f * D, a;
  }
  function fn(y, g) {
    const a = g ?? new M(4);
    return a[0] = -y[0], a[1] = -y[1], a[2] = -y[2], a[3] = y[3], a;
  }
  function qn(y, g) {
    const a = g ?? new M(4), t = y[0] + y[5] + y[10];
    if (t > 0) {
      const r = Math.sqrt(t + 1);
      a[3] = 0.5 * r;
      const o = 0.5 / r;
      a[0] = (y[6] - y[9]) * o, a[1] = (y[8] - y[2]) * o, a[2] = (y[1] - y[4]) * o;
    } else {
      let r = 0;
      y[5] > y[0] && (r = 1), y[10] > y[r * 4 + r] && (r = 2);
      const o = (r + 1) % 3, f = (r + 2) % 3, l = Math.sqrt(y[r * 4 + r] - y[o * 4 + o] - y[f * 4 + f] + 1);
      a[r] = 0.5 * l;
      const D = 0.5 / l;
      a[3] = (y[o * 4 + f] - y[f * 4 + o]) * D, a[o] = (y[o * 4 + r] + y[r * 4 + o]) * D, a[f] = (y[f * 4 + r] + y[r * 4 + f]) * D;
    }
    return a;
  }
  function Sn(y, g, a, t, r) {
    const o = r ?? new M(4), f = y * 0.5, l = g * 0.5, D = a * 0.5, d = Math.sin(f), n = Math.cos(f), i = Math.sin(l), c = Math.cos(l), e = Math.sin(D), s = Math.cos(D);
    switch (t) {
      case "xyz":
        o[0] = d * c * s + n * i * e, o[1] = n * i * s - d * c * e, o[2] = n * c * e + d * i * s, o[3] = n * c * s - d * i * e;
        break;
      case "xzy":
        o[0] = d * c * s - n * i * e, o[1] = n * i * s - d * c * e, o[2] = n * c * e + d * i * s, o[3] = n * c * s + d * i * e;
        break;
      case "yxz":
        o[0] = d * c * s + n * i * e, o[1] = n * i * s - d * c * e, o[2] = n * c * e - d * i * s, o[3] = n * c * s + d * i * e;
        break;
      case "yzx":
        o[0] = d * c * s + n * i * e, o[1] = n * i * s + d * c * e, o[2] = n * c * e - d * i * s, o[3] = n * c * s - d * i * e;
        break;
      case "zxy":
        o[0] = d * c * s - n * i * e, o[1] = n * i * s + d * c * e, o[2] = n * c * e + d * i * s, o[3] = n * c * s - d * i * e;
        break;
      case "zyx":
        o[0] = d * c * s - n * i * e, o[1] = n * i * s + d * c * e, o[2] = n * c * e - d * i * s, o[3] = n * c * s + d * i * e;
        break;
      default:
        throw new Error(`Unknown rotation order: ${t}`);
    }
    return o;
  }
  function wn(y, g) {
    const a = g ?? new M(4);
    return a[0] = y[0], a[1] = y[1], a[2] = y[2], a[3] = y[3], a;
  }
  const K = wn;
  function Pn(y, g, a) {
    const t = a ?? new M(4);
    return t[0] = y[0] + g[0], t[1] = y[1] + g[1], t[2] = y[2] + g[2], t[3] = y[3] + g[3], t;
  }
  function dn(y, g, a) {
    const t = a ?? new M(4);
    return t[0] = y[0] - g[0], t[1] = y[1] - g[1], t[2] = y[2] - g[2], t[3] = y[3] - g[3], t;
  }
  const yn = dn;
  function In(y, g, a) {
    const t = a ?? new M(4);
    return t[0] = y[0] * g, t[1] = y[1] * g, t[2] = y[2] * g, t[3] = y[3] * g, t;
  }
  const pn = In;
  function xn(y, g, a) {
    const t = a ?? new M(4);
    return t[0] = y[0] / g, t[1] = y[1] / g, t[2] = y[2] / g, t[3] = y[3] / g, t;
  }
  function B(y, g) {
    return y[0] * g[0] + y[1] * g[1] + y[2] * g[2] + y[3] * g[3];
  }
  function Tn(y, g, a, t) {
    const r = t ?? new M(4);
    return r[0] = y[0] + a * (g[0] - y[0]), r[1] = y[1] + a * (g[1] - y[1]), r[2] = y[2] + a * (g[2] - y[2]), r[3] = y[3] + a * (g[3] - y[3]), r;
  }
  function m(y) {
    const g = y[0], a = y[1], t = y[2], r = y[3];
    return Math.sqrt(g * g + a * a + t * t + r * r);
  }
  const Qn = m;
  function U(y) {
    const g = y[0], a = y[1], t = y[2], r = y[3];
    return g * g + a * a + t * t + r * r;
  }
  const Y = U;
  function T(y, g) {
    const a = g ?? new M(4), t = y[0], r = y[1], o = y[2], f = y[3], l = Math.sqrt(t * t + r * r + o * o + f * f);
    return l > 1e-5 ? (a[0] = t / l, a[1] = r / l, a[2] = o / l, a[3] = f / l) : (a[0] = 0, a[1] = 0, a[2] = 0, a[3] = 1), a;
  }
  function X(y, g) {
    return Math.abs(y[0] - g[0]) < F && Math.abs(y[1] - g[1]) < F && Math.abs(y[2] - g[2]) < F && Math.abs(y[3] - g[3]) < F;
  }
  function C(y, g) {
    return y[0] === g[0] && y[1] === g[1] && y[2] === g[2] && y[3] === g[3];
  }
  function En(y) {
    const g = y ?? new M(4);
    return g[0] = 0, g[1] = 0, g[2] = 0, g[3] = 1, g;
  }
  const H = S.create(), Hn = S.create(), an = S.create();
  function On(y, g, a) {
    const t = a ?? new M(4), r = S.dot(y, g);
    return r < -0.999999 ? (S.cross(Hn, y, H), S.len(H) < 1e-6 && S.cross(an, y, H), S.normalize(H, H), on(H, Math.PI, t), t) : r > 0.999999 ? (t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t) : (S.cross(y, g, H), t[0] = H[0], t[1] = H[1], t[2] = H[2], t[3] = 1 + r, T(t, t));
  }
  const hn = new M(4), $n = new M(4);
  function Vn(y, g, a, t, r, o) {
    const f = o ?? new M(4);
    return rn(y, t, r, hn), rn(g, a, r, $n), rn(hn, $n, 2 * r * (1 - r), f), f;
  }
  return {
    create: J,
    fromValues: ln,
    set: Mn,
    fromAxisAngle: on,
    toAxisAngle: Zn,
    angle: Fn,
    multiply: en,
    mul: Xn,
    rotateX: un,
    rotateY: b,
    rotateZ: Yn,
    slerp: rn,
    inverse: Dn,
    conjugate: fn,
    fromMat: qn,
    fromEuler: Sn,
    copy: wn,
    clone: K,
    add: Pn,
    subtract: dn,
    sub: yn,
    mulScalar: In,
    scale: pn,
    divScalar: xn,
    dot: B,
    lerp: Tn,
    length: m,
    len: Qn,
    lengthSq: U,
    lenSq: Y,
    normalize: T,
    equalsApproximately: X,
    equals: C,
    identity: En,
    rotationTo: On,
    sqlerp: Vn
  };
}
const tt = /* @__PURE__ */ new Map();
function lt(M) {
  let S = tt.get(M);
  return S || (S = ht(M), tt.set(M, S)), S;
}
function Mt(M) {
  function S(a, t, r, o) {
    const f = new M(4);
    return a !== void 0 && (f[0] = a, t !== void 0 && (f[1] = t, r !== void 0 && (f[2] = r, o !== void 0 && (f[3] = o)))), f;
  }
  const J = S;
  function ln(a, t, r, o, f) {
    const l = f ?? new M(4);
    return l[0] = a, l[1] = t, l[2] = r, l[3] = o, l;
  }
  function Mn(a, t) {
    const r = t ?? new M(4);
    return r[0] = Math.ceil(a[0]), r[1] = Math.ceil(a[1]), r[2] = Math.ceil(a[2]), r[3] = Math.ceil(a[3]), r;
  }
  function on(a, t) {
    const r = t ?? new M(4);
    return r[0] = Math.floor(a[0]), r[1] = Math.floor(a[1]), r[2] = Math.floor(a[2]), r[3] = Math.floor(a[3]), r;
  }
  function Zn(a, t) {
    const r = t ?? new M(4);
    return r[0] = Math.round(a[0]), r[1] = Math.round(a[1]), r[2] = Math.round(a[2]), r[3] = Math.round(a[3]), r;
  }
  function Fn(a, t = 0, r = 1, o) {
    const f = o ?? new M(4);
    return f[0] = Math.min(r, Math.max(t, a[0])), f[1] = Math.min(r, Math.max(t, a[1])), f[2] = Math.min(r, Math.max(t, a[2])), f[3] = Math.min(r, Math.max(t, a[3])), f;
  }
  function en(a, t, r) {
    const o = r ?? new M(4);
    return o[0] = a[0] + t[0], o[1] = a[1] + t[1], o[2] = a[2] + t[2], o[3] = a[3] + t[3], o;
  }
  function Xn(a, t, r, o) {
    const f = o ?? new M(4);
    return f[0] = a[0] + t[0] * r, f[1] = a[1] + t[1] * r, f[2] = a[2] + t[2] * r, f[3] = a[3] + t[3] * r, f;
  }
  function un(a, t, r) {
    const o = r ?? new M(4);
    return o[0] = a[0] - t[0], o[1] = a[1] - t[1], o[2] = a[2] - t[2], o[3] = a[3] - t[3], o;
  }
  const b = un;
  function Yn(a, t) {
    return Math.abs(a[0] - t[0]) < F && Math.abs(a[1] - t[1]) < F && Math.abs(a[2] - t[2]) < F && Math.abs(a[3] - t[3]) < F;
  }
  function rn(a, t) {
    return a[0] === t[0] && a[1] === t[1] && a[2] === t[2] && a[3] === t[3];
  }
  function Dn(a, t, r, o) {
    const f = o ?? new M(4);
    return f[0] = a[0] + r * (t[0] - a[0]), f[1] = a[1] + r * (t[1] - a[1]), f[2] = a[2] + r * (t[2] - a[2]), f[3] = a[3] + r * (t[3] - a[3]), f;
  }
  function fn(a, t, r, o) {
    const f = o ?? new M(4);
    return f[0] = a[0] + r[0] * (t[0] - a[0]), f[1] = a[1] + r[1] * (t[1] - a[1]), f[2] = a[2] + r[2] * (t[2] - a[2]), f[3] = a[3] + r[3] * (t[3] - a[3]), f;
  }
  function qn(a, t, r) {
    const o = r ?? new M(4);
    return o[0] = Math.max(a[0], t[0]), o[1] = Math.max(a[1], t[1]), o[2] = Math.max(a[2], t[2]), o[3] = Math.max(a[3], t[3]), o;
  }
  function Sn(a, t, r) {
    const o = r ?? new M(4);
    return o[0] = Math.min(a[0], t[0]), o[1] = Math.min(a[1], t[1]), o[2] = Math.min(a[2], t[2]), o[3] = Math.min(a[3], t[3]), o;
  }
  function wn(a, t, r) {
    const o = r ?? new M(4);
    return o[0] = a[0] * t, o[1] = a[1] * t, o[2] = a[2] * t, o[3] = a[3] * t, o;
  }
  const K = wn;
  function Pn(a, t, r) {
    const o = r ?? new M(4);
    return o[0] = a[0] / t, o[1] = a[1] / t, o[2] = a[2] / t, o[3] = a[3] / t, o;
  }
  function dn(a, t) {
    const r = t ?? new M(4);
    return r[0] = 1 / a[0], r[1] = 1 / a[1], r[2] = 1 / a[2], r[3] = 1 / a[3], r;
  }
  const yn = dn;
  function In(a, t) {
    return a[0] * t[0] + a[1] * t[1] + a[2] * t[2] + a[3] * t[3];
  }
  function pn(a) {
    const t = a[0], r = a[1], o = a[2], f = a[3];
    return Math.sqrt(t * t + r * r + o * o + f * f);
  }
  const xn = pn;
  function B(a) {
    const t = a[0], r = a[1], o = a[2], f = a[3];
    return t * t + r * r + o * o + f * f;
  }
  const Tn = B;
  function m(a, t) {
    const r = a[0] - t[0], o = a[1] - t[1], f = a[2] - t[2], l = a[3] - t[3];
    return Math.sqrt(r * r + o * o + f * f + l * l);
  }
  const Qn = m;
  function U(a, t) {
    const r = a[0] - t[0], o = a[1] - t[1], f = a[2] - t[2], l = a[3] - t[3];
    return r * r + o * o + f * f + l * l;
  }
  const Y = U;
  function T(a, t) {
    const r = t ?? new M(4), o = a[0], f = a[1], l = a[2], D = a[3], d = Math.sqrt(o * o + f * f + l * l + D * D);
    return d > 1e-5 ? (r[0] = o / d, r[1] = f / d, r[2] = l / d, r[3] = D / d) : (r[0] = 0, r[1] = 0, r[2] = 0, r[3] = 0), r;
  }
  function X(a, t) {
    const r = t ?? new M(4);
    return r[0] = -a[0], r[1] = -a[1], r[2] = -a[2], r[3] = -a[3], r;
  }
  function C(a, t) {
    const r = t ?? new M(4);
    return r[0] = a[0], r[1] = a[1], r[2] = a[2], r[3] = a[3], r;
  }
  const En = C;
  function H(a, t, r) {
    const o = r ?? new M(4);
    return o[0] = a[0] * t[0], o[1] = a[1] * t[1], o[2] = a[2] * t[2], o[3] = a[3] * t[3], o;
  }
  const Hn = H;
  function an(a, t, r) {
    const o = r ?? new M(4);
    return o[0] = a[0] / t[0], o[1] = a[1] / t[1], o[2] = a[2] / t[2], o[3] = a[3] / t[3], o;
  }
  const On = an;
  function hn(a) {
    const t = a ?? new M(4);
    return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t;
  }
  function $n(a, t, r) {
    const o = r ?? new M(4), f = a[0], l = a[1], D = a[2], d = a[3];
    return o[0] = t[0] * f + t[4] * l + t[8] * D + t[12] * d, o[1] = t[1] * f + t[5] * l + t[9] * D + t[13] * d, o[2] = t[2] * f + t[6] * l + t[10] * D + t[14] * d, o[3] = t[3] * f + t[7] * l + t[11] * D + t[15] * d, o;
  }
  function Vn(a, t, r) {
    const o = r ?? new M(4);
    return T(a, o), wn(o, t, o);
  }
  function y(a, t, r) {
    const o = r ?? new M(4);
    return pn(a) > t ? Vn(a, t, o) : C(a, o);
  }
  function g(a, t, r) {
    const o = r ?? new M(4);
    return Dn(a, t, 0.5, o);
  }
  return {
    create: S,
    fromValues: J,
    set: ln,
    ceil: Mn,
    floor: on,
    round: Zn,
    clamp: Fn,
    add: en,
    addScaled: Xn,
    subtract: un,
    sub: b,
    equalsApproximately: Yn,
    equals: rn,
    lerp: Dn,
    lerpV: fn,
    max: qn,
    min: Sn,
    mulScalar: wn,
    scale: K,
    divScalar: Pn,
    inverse: dn,
    invert: yn,
    dot: In,
    length: pn,
    len: xn,
    lengthSq: B,
    lenSq: Tn,
    distance: m,
    dist: Qn,
    distanceSq: U,
    distSq: Y,
    normalize: T,
    negate: X,
    copy: C,
    clone: En,
    multiply: H,
    mul: Hn,
    divide: an,
    div: On,
    zero: hn,
    transformMat4: $n,
    setLength: Vn,
    truncate: y,
    midpoint: g
  };
}
const st = /* @__PURE__ */ new Map();
function Dt(M) {
  let S = st.get(M);
  return S || (S = Mt(M), st.set(M, S)), S;
}
function _n(M, S, J, ln, Mn, on) {
  return {
    /** @namespace mat3 */
    mat3: ft(M),
    /** @namespace mat4 */
    mat4: at(S),
    /** @namespace quat */
    quat: lt(J),
    /** @namespace vec2 */
    vec2: ct(ln),
    /** @namespace vec3 */
    vec3: Wn(Mn),
    /** @namespace vec4 */
    vec4: Dt(on)
  };
}
const {
  /**
   * 4x4 Matrix functions that default to returning `Float32Array`
   * @namespace
   */
  mat4: dt,
  /**
   * Vec2 functions that default to returning `Float32Array`
   * @namespace
   */
  vec2: yt,
  /**
   * Vec3 functions that default to returning `Float32Array`
   * @namespace
   */
  vec3: pt,
  /**
   * Vec3 functions that default to returning `Float32Array`
   * @namespace
   */
  vec4: xt
} = _n(Float32Array, Float32Array, Float32Array, Float32Array, Float32Array, Float32Array);
_n(Float64Array, Float64Array, Float64Array, Float64Array, Float64Array, Float64Array);
_n(et, Array, Array, Array, Array, Array);
export {
  pt as a,
  yt as b,
  dt as m,
  xt as v
};
