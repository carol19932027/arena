import { defaultRim } from "../core/maps.js";
const lightRim = { ...defaultRim };
const darkRim = {
  ...defaultRim,
  intensity: 0.62,
  glowIntensity: 0.18,
  shade: 0.22,
  ambient: 0.14
};
const materials = {
  regular: {
    // Calibrated against Apple's iOS 26 imagery: light regular glass is milky and
    // nearly white over light content, the backdrop shows through softly. Lift and
    // fill keep dark text at ≥ 4.5:1 over dark photos too.
    light: {
      blur: 9,
      lift: 0.45,
      roll: 0,
      saturation: 1.5,
      fill: "rgba(255,255,255,0.4)",
      rim: { ...lightRim, shade: 0.16 },
      shadow: [
        { y: 10, blur: 30, spread: -6, alpha: 0.16 },
        { y: 2, blur: 6, spread: -1, alpha: 0.08 }
      ],
      foreground: "rgba(0,0,0,0.88)",
      textShadow: "none",
      fallbackBlur: 20,
      fallbackFill: "rgba(255,255,255,0.58)"
    },
    // Dark regular (notifications, menus at night): heavily frosted and dimmed
    // enough that white text stays ≥ 4.5:1 over bright photos.
    dark: {
      blur: 9,
      lift: 0.03,
      roll: 0.4,
      saturation: 1.4,
      fill: "rgba(28,28,30,0.5)",
      rim: darkRim,
      shadow: [
        { y: 10, blur: 30, spread: -6, alpha: 0.42 },
        { y: 2, blur: 6, spread: -1, alpha: 0.26 }
      ],
      foreground: "rgba(255,255,255,0.94)",
      textShadow: "none",
      fallbackBlur: 20,
      fallbackFill: "rgba(28,28,30,0.64)"
    }
  },
  clear: {
    light: {
      blur: 0,
      lift: 0.1,
      roll: 0,
      saturation: 1.18,
      // Clear glass carries white text. A light dim plus a soft halo behind the
      // text (Apple's "dimming layer") keep it legible over bright media.
      fill: "rgba(0,0,0,0.12)",
      rim: { ...lightRim, intensity: 1, glowIntensity: 0.38, shade: 0.06 },
      shadow: [{ y: 8, blur: 24, spread: -8, alpha: 0.18 }],
      foreground: "rgba(255,255,255,0.98)",
      textShadow: "0 0 1px rgba(0,0,0,.28), 0 1px 3px rgba(0,0,0,.34), 0 0 14px rgba(0,0,0,.26)",
      fallbackBlur: 3,
      fallbackFill: "rgba(255,255,255,0.08)"
    },
    dark: {
      blur: 0,
      lift: 0.04,
      roll: 0.12,
      saturation: 1.12,
      fill: "rgba(0,0,0,0.18)",
      rim: { ...darkRim, intensity: 0.78, glowIntensity: 0.3 },
      shadow: [{ y: 8, blur: 24, spread: -8, alpha: 0.4 }],
      foreground: "rgba(255,255,255,0.98)",
      textShadow: "0 0 1px rgba(0,0,0,.3), 0 1px 3px rgba(0,0,0,.36), 0 0 14px rgba(0,0,0,.28)",
      fallbackBlur: 3,
      fallbackFill: "rgba(0,0,0,0.16)"
    }
  }
};
function toneTable(spec) {
  const out = [];
  for (let i = 0; i <= 32; i++) {
    const v = i / 32;
    const lifted = v + spec.lift * Math.pow(1 - v, 2) - spec.roll * Math.pow(v, 2);
    out.push(Math.max(0, Math.min(1, lifted)).toFixed(4));
  }
  return out.join(" ");
}
function luminance(rgb) {
  const lin = (v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  return 0.2126 * lin(rgb[0] ?? 0) + 0.7152 * lin(rgb[1] ?? 0) + 0.0722 * lin(rgb[2] ?? 0);
}
function contrastRatio(a, b) {
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
function legibleTint(color) {
  const c = parseColor(color);
  if (!c) return { fill: color, text: "#fff" };
  let rgb = [c[0], c[1], c[2]];
  if (contrastRatio(luminance(rgb), 0) > 1.6 * contrastRatio(luminance(rgb), 1))
    return { fill: color, text: "#000" };
  for (let k = 1; contrastRatio(luminance(rgb), 1) < 5 && k > 0.6; ) {
    k -= 0.01;
    rgb = [c[0] * k, c[1] * k, c[2] * k];
  }
  const hex = rgb.map(
    (v) => Math.round(v * 255).toString(16).padStart(2, "0")
  ).join("");
  return { fill: `#${hex}`, text: "#fff" };
}
const colorCache = /* @__PURE__ */ new Map();
function parseColor(color) {
  if (colorCache.has(color)) return colorCache.get(color);
  let result = null;
  const hex = /^#([\da-f]{3,8})$/i.exec(color.trim());
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4)
      h = h.split("").map((c) => c + c).join("");
    const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255;
    result = [n(0), n(2), n(4), h.length === 8 ? n(6) : 1];
  } else if (typeof document !== "undefined") {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (ctx) {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      const a = d[3] / 255;
      if (a > 0) result = [d[0] / 255, d[1] / 255, d[2] / 255, a];
      else if (/transparent|rgba?\([^)]*,\s*0\s*\)/i.test(color)) result = [0, 0, 0, 0];
    }
  }
  colorCache.set(color, result);
  return result;
}
export {
  contrastRatio,
  legibleTint,
  luminance,
  materials,
  parseColor,
  toneTable
};
