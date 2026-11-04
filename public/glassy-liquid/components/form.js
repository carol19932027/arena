function attachInternals(el) {
  try {
    return el.attachInternals();
  } catch {
    return null;
  }
}
function cssVar(el, name, fallback) {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v || fallback;
}
const systemColors = {
  green: ["#34c759", "#30d158"],
  blue: ["#007aff", "#0a84ff"],
  fill: ["rgba(120,120,128,0.2)", "rgba(120,120,128,0.36)"],
  track: ["rgba(120,120,128,0.2)", "rgba(120,120,128,0.32)"]
};
export {
  attachInternals,
  cssVar,
  systemColors
};
