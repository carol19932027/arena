import { clamp } from "./spring.js";
const defaultOptics = {
  profile: "squircle",
  ior: 1.5,
  thickness: 1,
  float: 0.55
};
function surfaceHeight(profile, t) {
  const x = clamp(t, 0, 1);
  switch (profile) {
    case "convex":
      return Math.sqrt(1 - (1 - x) * (1 - x));
    case "squircle":
      return Math.pow(1 - Math.pow(1 - x, 4), 0.25);
    case "lip": {
      const convex = Math.pow(1 - Math.pow(1 - x, 4), 0.25);
      const concave = 1 - convex;
      const s = x * x * x * (x * (x * 6 - 15) + 10);
      return convex * (1 - s) + (0.6 + 0.4 * concave) * s;
    }
    case "flat":
      return 1;
  }
}
function rayDisplacement(config, t) {
  if (config.profile === "flat") return 0;
  const h = 1e-4;
  const a = Math.max(0, t - h);
  const b = Math.min(1, t + h);
  const slope = config.thickness * (surfaceHeight(config.profile, b) - surfaceHeight(config.profile, a)) / (b - a);
  const alpha = Math.atan(Math.abs(slope));
  const sinT = Math.sin(alpha) / config.ior;
  const theta = Math.asin(clamp(sinT, -1, 1));
  const deviation = alpha - theta;
  const height = config.float + config.thickness * surfaceHeight(config.profile, t);
  return Math.sign(slope) * height * Math.tan(deviation);
}
const tableCache = /* @__PURE__ */ new Map();
function profileTable(config = defaultOptics, samples = 256) {
  const key = `${config.profile}|${config.ior}|${config.thickness}|${config.float}|${samples}`;
  const cached = tableCache.get(key);
  if (cached) return cached;
  const raw = new Float32Array(samples);
  let peak = 0;
  for (let i = 0; i < samples; i++) {
    const t = (i + 0.5) / samples;
    const v = rayDisplacement(config, t);
    raw[i] = v;
    peak = Math.max(peak, Math.abs(v));
  }
  const values = new Float32Array(samples);
  if (peak > 0) for (let i = 0; i < samples; i++) values[i] = raw[i] / peak;
  values[samples - 1] = 0;
  const table = { values, peak };
  tableCache.set(key, table);
  return table;
}
function sampleProfile(table, t) {
  const n = table.values.length;
  if (t >= 1) return 0;
  const x = clamp(t, 0, 1) * n - 0.5;
  if (x <= 0) return table.values[0];
  const i = Math.floor(x);
  const f = x - i;
  const a = table.values[i];
  const b = i + 1 < n ? table.values[i + 1] : 0;
  return a + (b - a) * f;
}
export {
  defaultOptics,
  profileTable,
  rayDisplacement,
  sampleProfile,
  surfaceHeight
};
