import { clamp } from "../core/spring.js";
function viewportRect(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, width: r.width, height: r.height };
}
function place(anchor, size, placement = "bottom-start", gap = 8) {
  const vw = document.documentElement.clientWidth || window.innerWidth;
  const vh = window.innerHeight;
  const m = 8;
  const width = Math.min(size.width, vw - 2 * m);
  let side = placement.startsWith("top") ? "top" : "bottom";
  const below = vh - (anchor.y + anchor.height) - gap - m;
  const above = anchor.y - gap - m;
  if (side === "bottom" && size.height > below && above > below) side = "top";
  else if (side === "top" && size.height > above && below > above) side = "bottom";
  const height = Math.min(size.height, side === "bottom" ? below : above);
  const align = placement.endsWith("end") ? "end" : placement.endsWith("start") ? "start" : "center";
  let x = align === "start" ? anchor.x : align === "end" ? anchor.x + anchor.width - width : anchor.x + anchor.width / 2 - width / 2;
  if (getComputedStyle(document.documentElement).direction === "rtl" && align !== "center") {
    x = align === "start" ? anchor.x + anchor.width - width : anchor.x;
  }
  x = clamp(x, m, vw - m - width);
  const y = side === "bottom" ? anchor.y + anchor.height + gap : anchor.y - gap - height;
  return { x, y, width, height: Math.max(0, height), side };
}
function lerpRect(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    width: a.width + (b.width - a.width) * t,
    height: a.height + (b.height - a.height) * t
  };
}
export {
  lerpRect,
  place,
  viewportRect
};
