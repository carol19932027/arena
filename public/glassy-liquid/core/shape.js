import { clamp } from "./spring.js";
function resolveRadius(radius, width, height) {
  const max = Math.min(width, height) / 2;
  if (radius === "capsule" || radius === "circle") return max;
  return clamp(radius ?? 16, 0, max);
}
function shapeMetrics(width, height, radius, bezel) {
  const w = Math.max(1, width);
  const h = Math.max(1, height);
  const r = resolveRadius(radius, w, h);
  const b = clamp(bezel, 0, Math.min(w, h) / 2);
  const k = Math.max(r, b);
  return {
    width: w,
    height: h,
    radius: r,
    bezel: b,
    kx: Math.min(k, w / 2),
    ky: Math.min(k, h / 2)
  };
}
function cornerField(x, y, kx, ky, r, out) {
  const px = kx - x;
  const py = ky - y;
  const qx = px - (kx - r);
  const qy = py - (ky - r);
  if (qx > 0 && qy > 0) {
    const len = Math.hypot(qx, qy);
    out.depth = r - len;
    out.nx = -qx / len;
    out.ny = -qy / len;
  } else if (qx > qy) {
    out.depth = r - qx;
    out.nx = -1;
    out.ny = 0;
  } else {
    out.depth = r - qy;
    out.nx = 0;
    out.ny = -1;
  }
  if (!Number.isFinite(out.nx)) {
    out.nx = -Math.SQRT1_2;
    out.ny = -Math.SQRT1_2;
  }
  return out;
}
function roundedRectField(x, y, w, h, r, out) {
  const sx = x < w / 2 ? 1 : -1;
  const sy = y < h / 2 ? 1 : -1;
  const lx = sx > 0 ? x : w - x;
  const ly = sy > 0 ? y : h - y;
  cornerField(lx, ly, w / 2, h / 2, r, out);
  out.nx *= sx;
  out.ny *= sy;
  return out;
}
function sliceLayout(m) {
  const { width: w, height: h, kx, ky } = m;
  const slices = [
    { key: "tl", x: 0, y: 0, width: kx, height: ky },
    { key: "tr", x: w - kx, y: 0, width: kx, height: ky },
    { key: "bl", x: 0, y: h - ky, width: kx, height: ky },
    { key: "br", x: w - kx, y: h - ky, width: kx, height: ky }
  ];
  const ew = w - 2 * kx;
  const eh = h - 2 * ky;
  if (ew > 0.01) {
    slices.push({ key: "t", x: kx, y: 0, width: ew, height: ky });
    slices.push({ key: "b", x: kx, y: h - ky, width: ew, height: ky });
  }
  if (eh > 0.01) {
    slices.push({ key: "l", x: 0, y: ky, width: kx, height: eh });
    slices.push({ key: "r", x: w - kx, y: ky, width: kx, height: eh });
  }
  return slices;
}
function cssRadius(radius) {
  if (radius === "capsule" || radius === "circle") return "9999px";
  return `${radius ?? 16}px`;
}
export {
  cornerField,
  cssRadius,
  resolveRadius,
  roundedRectField,
  shapeMetrics,
  sliceLayout
};
