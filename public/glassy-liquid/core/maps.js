import { cornerField } from "./shape.js";
import { defaultOptics, profileTable, sampleProfile } from "./optics.js";
import { pngDataUrl } from "./png.js";
import { clamp } from "./spring.js";
const field = { depth: 0, nx: 0, ny: 0 };
const encode = (v) => clamp(Math.round(127.5 + v * 127.5), 0, 255);
const quant = (v) => Math.round(v * 4) / 4;
const displacementCache = /* @__PURE__ */ new Map();
function displacementSet(m, dpr, optics = defaultOptics) {
  const r = quant(m.radius);
  const b = quant(m.bezel);
  const kx = quant(m.kx);
  const ky = quant(m.ky);
  const d = Math.min(3, Math.max(1, Math.round(dpr * 2) / 2));
  const key = `${r}|${b}|${kx}|${ky}|${d}|${optics.profile}|${optics.ior}|${optics.thickness}|${optics.float}`;
  const cached = displacementCache.get(key);
  if (cached) return cached;
  const table = profileTable(optics);
  const cw = Math.max(1, Math.ceil(kx * d));
  const ch = Math.max(1, Math.ceil(ky * d));
  const magnitude = (depth) => {
    if (b <= 0) return 0;
    return sampleProfile(table, Math.max(0, depth) / b);
  };
  const corner = (flipX, flipY) => {
    const px = new Uint8ClampedArray(cw * ch * 4);
    for (let j = 0; j < ch; j++) {
      const ty = flipY ? ch - 1 - j : j;
      const y = Math.min(ky, (ty + 0.5) / d);
      for (let i = 0; i < cw; i++) {
        const tx = flipX ? cw - 1 - i : i;
        const x = Math.min(kx, (tx + 0.5) / d);
        cornerField(x, y, kx, ky, r, field);
        const mag = magnitude(field.depth);
        const vx = -field.nx * mag * (flipX ? -1 : 1);
        const vy = -field.ny * mag * (flipY ? -1 : 1);
        const o = (j * cw + i) * 4;
        px[o] = encode(vx);
        px[o + 1] = encode(vy);
        px[o + 2] = 128;
        px[o + 3] = 255;
      }
    }
    return { url: pngDataUrl(cw, ch, px), width: cw, height: ch };
  };
  const edge = (side) => {
    const horizontal = side === "t" || side === "b";
    const len = horizontal ? ch : cw;
    const w = horizontal ? 2 : cw;
    const h = horizontal ? ch : 2;
    const px = new Uint8ClampedArray(w * h * 4);
    for (let k = 0; k < len; k++) {
      const depth = (k + 0.5) / d;
      const mag = magnitude(depth);
      const v = side === "t" || side === "l" ? mag : -mag;
      for (let s = 0; s < 2; s++) {
        const idx = side === "t" ? k : side === "b" ? len - 1 - k : side === "l" ? k : len - 1 - k;
        const i = horizontal ? s : idx;
        const j = horizontal ? idx : s;
        const o = (j * w + i) * 4;
        px[o] = encode(horizontal ? 0 : v);
        px[o + 1] = encode(horizontal ? v : 0);
        px[o + 2] = 128;
        px[o + 3] = 255;
      }
    }
    return { url: pngDataUrl(w, h, px), width: w, height: h };
  };
  const set = {
    tl: corner(false, false),
    tr: corner(true, false),
    bl: corner(false, true),
    br: corner(true, true),
    t: edge("t"),
    b: edge("b"),
    l: edge("l"),
    r: edge("r")
  };
  if (displacementCache.size > 256) displacementCache.clear();
  displacementCache.set(key, set);
  return set;
}
const defaultRim = {
  angle: -135,
  intensity: 1,
  width: 1,
  glow: 5,
  glowIntensity: 0.32,
  shade: 0.1,
  back: 0.6,
  ambient: 0.16
};
const rimCache = /* @__PURE__ */ new Map();
function rimExtent(m, rim) {
  const k = Math.max(m.radius, rim.glow * 3 + rim.width + 1);
  return { kx: Math.min(k, m.width / 2), ky: Math.min(k, m.height / 2) };
}
function rimImage(m, dpr, rim = defaultRim) {
  const { kx: ekx, ky: eky } = rimExtent(m, rim);
  const r = quant(m.radius);
  const kx = quant(ekx);
  const ky = quant(eky);
  const d = Math.min(3, Math.max(1, Math.round(dpr * 2) / 2));
  const key = `${r}|${kx}|${ky}|${d}|${rim.angle}|${rim.intensity}|${rim.width}|${rim.glow}|${rim.glowIntensity}|${rim.shade}|${rim.back}|${rim.ambient}`;
  const cached = rimCache.get(key);
  if (cached) return cached;
  const cw = Math.max(1, Math.ceil(kx * d));
  const ch = Math.max(1, Math.ceil(ky * d));
  const w = cw * 2 + 2;
  const h = ch * 2 + 2;
  const px = new Uint8ClampedArray(w * h * 4);
  const a = rim.angle * Math.PI / 180;
  const lx = Math.cos(a);
  const ly = Math.sin(a);
  const aa = 1 / d;
  for (let j = 0; j < h; j++) {
    const bottom = j >= ch + 2;
    const midY = j >= ch && j < ch + 2;
    const yy = midY ? ky : bottom ? (h - 1 - j + 0.5) / d : (j + 0.5) / d;
    for (let i = 0; i < w; i++) {
      const right = i >= cw + 2;
      const midX = i >= cw && i < cw + 2;
      const xx = midX ? kx : right ? (w - 1 - i + 0.5) / d : (i + 0.5) / d;
      cornerField(Math.min(xx, kx), Math.min(yy, ky), kx, ky, r, field);
      const nx = right ? -field.nx : field.nx;
      const ny = bottom ? -field.ny : field.ny;
      const depth = field.depth;
      const coverage = clamp(0.5 + depth / aa, 0, 1);
      if (coverage <= 0) continue;
      const facing = nx * lx + ny * ly;
      const front = Math.pow(Math.max(0, facing), 2.2);
      const back = Math.pow(Math.max(0, -facing), 2.2) * rim.back;
      const dir = Math.min(1, front + back + rim.ambient) * rim.intensity;
      const stroke = coverage * clamp((rim.width - depth) / aa + 0.5, 0, 1);
      const inner = coverage * Math.exp(-Math.max(0, depth - rim.width * 0.5) / Math.max(0.01, rim.glow)) * rim.glowIntensity;
      const highlight = clamp(dir * (stroke * 0.95 + inner * (0.35 + 0.65 * dir)), 0, 1);
      const shadeBand = coverage * clamp((rim.width + 1.2 - depth) / aa + 0.5, 0, 1) * clamp((depth - rim.width * 0.4) / aa + 0.5, 0, 1);
      const shade = shadeBand * rim.shade * (1 - Math.min(1, front * 1.4));
      const alpha = highlight + shade * (1 - highlight);
      if (alpha <= 2e-3) continue;
      const light = highlight / alpha;
      const o = (j * w + i) * 4;
      const c = Math.round(255 * light);
      px[o] = c;
      px[o + 1] = c;
      px[o + 2] = c;
      px[o + 3] = Math.round(255 * alpha);
    }
  }
  const image = {
    url: pngDataUrl(w, h, px),
    width: w,
    height: h,
    sliceX: cw,
    sliceY: ch,
    borderX: cw / d,
    borderY: ch / d
  };
  if (rimCache.size > 256) rimCache.clear();
  rimCache.set(key, image);
  return image;
}
let zoomUrl;
function zoomGradient() {
  if (zoomUrl) return zoomUrl;
  const n = 64;
  const px = new Uint8ClampedArray(n * n * 4);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const o = (j * n + i) * 4;
      px[o] = Math.round(255 * (1 - (i + 0.5) / n));
      px[o + 1] = Math.round(255 * (1 - (j + 0.5) / n));
      px[o + 2] = 128;
      px[o + 3] = 255;
    }
  }
  zoomUrl = pngDataUrl(n, n, px);
  return zoomUrl;
}
function mapCacheStats() {
  return { displacement: displacementCache.size, rim: rimCache.size };
}
const shadowCache = /* @__PURE__ */ new Map();
function shadowImage(radius, layers, dpr) {
  const d = Math.min(3, Math.max(1, Math.round(dpr * 2) / 2));
  const r = Math.max(0, Math.round(radius * 2) / 2);
  const key = `${r}|${d}|${layers.map((l) => `${l.y},${l.blur},${l.spread},${l.alpha}`).join(";")}`;
  if (shadowCache.has(key)) return shadowCache.get(key);
  let result = null;
  if (typeof document !== "undefined") {
    const outset = Math.ceil(
      Math.max(...layers.map((l) => l.blur + Math.max(0, l.spread) + Math.abs(l.y))) + 1
    );
    const inset = Math.max(1, Math.ceil(r));
    const sliceCss = outset + inset;
    const size = Math.ceil((sliceCss * 2 + 2) * d);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const shape = (x, y, w, h, rr) => {
        ctx.beginPath();
        const c = ctx;
        if (typeof c.roundRect === "function") c.roundRect(x, y, w, h, Math.max(0, rr));
        else c.rect(x, y, w, h);
      };
      ctx.scale(d, d);
      const box = outset;
      const boxSize = size / d - 2 * outset;
      const far = 1e4;
      for (const l of layers) {
        ctx.save();
        ctx.shadowColor = `rgba(0,0,0,${l.alpha})`;
        ctx.shadowBlur = l.blur * d;
        ctx.shadowOffsetX = far * d;
        ctx.shadowOffsetY = l.y * d;
        ctx.fillStyle = "#000";
        shape(
          box - l.spread - far,
          box - l.spread,
          boxSize + 2 * l.spread,
          boxSize + 2 * l.spread,
          r + l.spread
        );
        ctx.fill();
        ctx.restore();
      }
      ctx.globalCompositeOperation = "destination-out";
      shape(box, box, boxSize, boxSize, r);
      ctx.fill();
      result = {
        url: canvas.toDataURL("image/png"),
        width: size,
        height: size,
        slice: Math.round(sliceCss * d),
        outset,
        inset
      };
    }
  }
  if (shadowCache.size > 128) shadowCache.clear();
  shadowCache.set(key, result);
  return result;
}
export {
  defaultRim,
  displacementSet,
  mapCacheStats,
  rimExtent,
  rimImage,
  shadowImage,
  zoomGradient
};
