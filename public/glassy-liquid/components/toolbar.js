import { GlassElement, HTMLElementBase, define } from "./base.js";
class GlassGroupElement extends GlassElement {
  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("role")) this.setAttribute("role", "group");
  }
}
GlassGroupElement.glassDefaults = { radius: "capsule" };
GlassGroupElement.styles = /* css */
`
:host{display:inline-flex;align-items:center;vertical-align:middle;padding:0 var(--glass-group-padding,2px);height:var(--glass-button-height,44px);}
::slotted(glass-button[variant=plain]){--glass-button-padding:12px;}
`;
class GlassToolbarElement extends GlassElement {
  constructor() {
    super(...arguments);
    this.onKey = (e) => {
      const vertical = this.getAttribute("aria-orientation") === "vertical";
      const next = vertical ? "ArrowDown" : "ArrowRight";
      const prev = vertical ? "ArrowUp" : "ArrowLeft";
      if (e.key !== next && e.key !== prev && e.key !== "Home" && e.key !== "End") return;
      const list = this.controls();
      const i = list.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      const target = e.key === "Home" ? list[0] : e.key === "End" ? list[list.length - 1] : list[(i + (e.key === next ? 1 : -1) + list.length) % list.length];
      target?.focus();
    };
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("role")) this.setAttribute("role", "toolbar");
    this.addEventListener("keydown", this.onKey);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this.onKey);
  }
  controls() {
    return Array.from(
      this.querySelectorAll("glass-button,button,a[href],glass-switch,[tabindex]")
    ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
  }
}
GlassToolbarElement.hasGlass = false;
GlassToolbarElement.styles = /* css */
`:host{display:flex;align-items:center;gap:var(--glass-toolbar-gap,10px);}`;
class GlassSpacerElement extends HTMLElementBase {
  connectedCallback() {
    const size = this.getAttribute("size");
    Object.assign(this.style, size ? { flex: `0 0 ${parseFloat(size)}px` } : { flex: "1 1 auto" });
    this.style.display = "block";
    this.setAttribute("aria-hidden", "true");
  }
}
define("glass-group", GlassGroupElement);
define("glass-toolbar", GlassToolbarElement);
define("glass-spacer", GlassSpacerElement);
export {
  GlassGroupElement,
  GlassSpacerElement,
  GlassToolbarElement
};
