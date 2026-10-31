import { isBrowser, prefersDark } from "../core/env.js";
function resolveAppearance(el, explicit) {
  const attr = explicit ?? el.getAttribute("appearance");
  if (attr === "light" || attr === "dark") return attr;
  const cs = getComputedStyle(el);
  const inherited = cs.getPropertyValue("--glass-appearance").trim();
  if (inherited === "dark" || inherited === "light") return inherited;
  return schemeAppearance(cs.colorScheme);
}
function schemeAppearance(value) {
  let scheme = (value ?? "").trim();
  if (!scheme || scheme === "normal")
    scheme = document.querySelector('meta[name="color-scheme"]')?.content ?? "";
  const dark = /\bdark\b/.test(scheme);
  if (!dark) return "light";
  return /\blight\b/.test(scheme) ? prefersDark() ? "dark" : "light" : "dark";
}
const listeners = /* @__PURE__ */ new Set();
let watching = false;
let queued = 0;
function flush() {
  queued = 0;
  for (const cb of Array.from(listeners)) cb();
}
function notify() {
  if (queued) return;
  if (typeof requestAnimationFrame !== "function") return flush();
  queued = requestAnimationFrame(flush);
}
function watch() {
  if (watching || !isBrowser) return;
  watching = true;
  if (typeof matchMedia === "function")
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", notify);
  if (typeof MutationObserver === "undefined") return;
  const mo = new MutationObserver(notify);
  mo.observe(document.documentElement, { attributes: true });
  const observeBody = () => document.body && mo.observe(document.body, { attributes: true });
  if (document.body) observeBody();
  else document.addEventListener("DOMContentLoaded", observeBody, { once: true });
  if (document.head)
    mo.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["content", "name"]
    });
}
function onAppearanceChange(callback) {
  listeners.add(callback);
  watch();
  return () => listeners.delete(callback);
}
function updateAppearance() {
  if (isBrowser) notify();
}
export {
  onAppearanceChange,
  resolveAppearance,
  updateAppearance
};
