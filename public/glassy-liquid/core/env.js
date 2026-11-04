const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
let backdropUrl;
function supportsBackdropSvg() {
  if (backdropUrl !== void 0) return backdropUrl;
  if (!isBrowser) return backdropUrl = false;
  const nav = navigator;
  const brands = nav.userAgentData?.brands;
  let chromium;
  if (brands && brands.length)
    chromium = brands.some((b) => /Chromium|Google Chrome|Microsoft Edge/i.test(b.brand));
  else {
    const ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/.test(ua) || /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
    chromium = !ios && /Chrome\/|Chromium\/|Edg\//.test(ua) && !/Firefox\//.test(ua);
  }
  backdropUrl = chromium && cssSupports("backdrop-filter", "url(#a)");
  return backdropUrl;
}
function cssSupports(property, value) {
  return isBrowser && typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports(property, value);
}
function supportsBackdropFilter() {
  return cssSupports("backdrop-filter", "blur(1px)") || cssSupports("-webkit-backdrop-filter", "blur(1px)");
}
let webgl;
function supportsWebGL() {
  if (webgl !== void 0) return webgl;
  if (!isBrowser) return webgl = false;
  try {
    const c = document.createElement("canvas");
    webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webgl = false;
  }
  return webgl;
}
function devicePixelRatio() {
  return isBrowser ? Math.max(1, Math.min(3, window.devicePixelRatio || 1)) : 1;
}
function media(query) {
  return isBrowser && typeof matchMedia === "function" && matchMedia(query).matches;
}
const prefersReducedMotion = () => media("(prefers-reduced-motion: reduce)");
const prefersReducedTransparency = () => media("(prefers-reduced-transparency: reduce)");
const prefersDark = () => media("(prefers-color-scheme: dark)");
const forcedColors = () => media("(forced-colors: active)");
const finePointer = () => media("(hover: hover) and (pointer: fine)");
function watchMedia(query, cb) {
  if (!isBrowser || typeof matchMedia !== "function") return () => {
  };
  const mq = matchMedia(query);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
let uid = 0;
const nextId = (prefix) => `${prefix}${(++uid).toString(36)}`;
export {
  cssSupports,
  devicePixelRatio,
  finePointer,
  forcedColors,
  isBrowser,
  nextId,
  prefersDark,
  prefersReducedMotion,
  prefersReducedTransparency,
  supportsBackdropFilter,
  supportsBackdropSvg,
  supportsWebGL,
  watchMedia
};
