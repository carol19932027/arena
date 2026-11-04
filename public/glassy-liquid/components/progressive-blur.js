import { HTMLElementBase, define } from "./base.js";
const directions = { top: "to top", bottom: "to bottom", left: "to left", right: "to right" };
const edges = Object.keys(directions);
function color(value) {
  if (!value || /[<>{};"\\]/.test(value)) return null;
  const css = typeof CSS === "undefined" ? void 0 : CSS;
  return typeof css?.supports === "function" && css.supports("color", value) ? value : null;
}
class GlassProgressiveBlurElement extends HTMLElementBase {
  static get observedAttributes() {
    return ["edge", "size", "blur", "layers", "tint"];
  }
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.setAttribute("aria-hidden", "true");
    this.build();
  }
  attributeChangedCallback() {
    if (this.isConnected) this.build();
  }
  // Built with DOM calls, not innerHTML: attribute values never reach the HTML parser,
  // and only validated values (a known edge, finite numbers, a checked color) reach CSS.
  build() {
    const raw = this.getAttribute("edge") ?? "top";
    const edge = edges.includes(raw) ? raw : "top";
    const number = (value, fallback) => Number.isFinite(value) ? value : fallback;
    const size = number(parseFloat(this.getAttribute("size") ?? "96") || 96, 96);
    const max = number(parseFloat(this.getAttribute("blur") ?? "16") || 16, 16);
    const n = Math.max(2, Math.min(8, parseInt(this.getAttribute("layers") ?? "6", 10) || 6));
    const tint = color(this.getAttribute("tint"));
    const dir = directions[edge];
    const vertical = edge === "top" || edge === "bottom";
    const style = document.createElement("style");
    style.textContent = `
:host{display:block;pointer-events:none;${vertical ? `height:${size}px` : `width:${size}px`};position:absolute;${edge}:0;${vertical ? "left:0;right:0" : "top:0;bottom:0"};}
i,b{position:absolute;inset:0;}
@media (prefers-reduced-transparency: reduce){i{-webkit-backdrop-filter:none;backdrop-filter:none;}}
`;
    const nodes = [style];
    for (let i = 0; i < n; i++) {
      const blur = max / Math.pow(2, n - 1 - i);
      const a = i / n * 100;
      const b = (i + 1) / n * 100;
      const c = (i + 2) / n * 100;
      const mask = `linear-gradient(${dir}, rgba(0,0,0,0) ${a.toFixed(2)}%, #000 ${b.toFixed(2)}%, #000 ${Math.min(100, c).toFixed(2)}%, rgba(0,0,0,${i === n - 1 ? 1 : 0}) ${Math.min(100, c + 100 / n).toFixed(2)}%)`;
      const layer = document.createElement("i");
      layer.setAttribute(
        "style",
        `-webkit-backdrop-filter:blur(${blur.toFixed(2)}px);backdrop-filter:blur(${blur.toFixed(2)}px);-webkit-mask-image:${mask};mask-image:${mask}`
      );
      nodes.push(layer);
    }
    if (tint) {
      const wash = document.createElement("b");
      wash.setAttribute("style", `background:linear-gradient(${dir}, transparent, ${tint})`);
      nodes.push(wash);
    }
    this.shadow.replaceChildren(...nodes);
  }
}
define("glass-progressive-blur", GlassProgressiveBlurElement);
export {
  GlassProgressiveBlurElement
};
