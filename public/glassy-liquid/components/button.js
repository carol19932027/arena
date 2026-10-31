import { GlassElement, define } from "./base.js";
import { legibleTint } from "../engine/materials.js";
const css = (
  /* css */
  `
:host{display:inline-flex;vertical-align:middle;cursor:pointer;user-select:none;-webkit-user-select:none;touch-action:manipulation;
  height:var(--glass-button-height,44px);min-width:var(--glass-button-height,44px);padding:0 var(--glass-button-padding,20px);
  font-size:var(--glass-button-font-size,17px);font-weight:590;letter-spacing:-.022em;line-height:1;}
:host([size=small]){--glass-button-height:32px;--glass-button-padding:14px;--glass-button-font-size:15px;}
:host([size=large]){--glass-button-height:52px;--glass-button-padding:26px;--glass-button-font-size:17px;}
:host([shape=circle]){padding:0;width:var(--glass-button-height,44px);}
:host([variant=prominent]){color:var(--glass-on-accent,var(--gl-on-tint,#fff));}
:host([variant=plain]){color:var(--glass-accent-text,var(--glass-foreground,var(--gl-fg)));}
[part=label]{display:inline-flex;align-items:center;justify-content:center;gap:.4em;width:100%;height:100%;white-space:nowrap;}
::slotted(svg){width:1.15em;height:1.15em;flex:none;}
`
);
class GlassButtonElement extends GlassElement {
  constructor() {
    super();
    this.internals = null;
    this.onKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.click();
      } else if (e.key === " ") e.preventDefault();
    };
    this.onKeyUp = (e) => {
      if (e.key === " ") this.click();
    };
    this.onClick = (e) => {
      if (this.hasAttribute("disabled")) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return;
      }
      const href = this.getAttribute("href");
      if (href) {
        if (e.defaultPrevented) return;
        const target = this.getAttribute("target");
        if (target && target !== "_self") window.open(href, target, "noopener");
        else location.assign(href);
        return;
      }
      const form = this.internals?.form;
      if (!form || e.defaultPrevented) return;
      const type = this.getAttribute("type") ?? "button";
      if (type === "submit") form.requestSubmit();
      else if (type === "reset") form.reset();
    };
    try {
      this.internals = this.attachInternals();
    } catch {
      this.internals = null;
    }
  }
  render() {
    return `<span part="label"><slot name="icon"></slot><slot></slot><slot name="trailing"></slot></span>`;
  }
  glassOptions() {
    const opts = super.glassOptions();
    const variant = this.getAttribute("variant");
    const shape = this.getAttribute("shape");
    if (shape === "circle") opts.radius = "circle";
    else if (shape === "rounded" && !this.hasAttribute("radius")) opts.radius = 12;
    if (variant === "prominent" && !this.hasAttribute("tint")) {
      const { fill, text } = legibleTint(
        getComputedStyle(this).getPropertyValue("--glass-accent").trim() || "#007aff"
      );
      opts.tint = fill;
      this.style.setProperty("--gl-on-tint", text);
    }
    if (variant === "plain") {
      opts.backdrop = false;
      opts.shadow = false;
      opts.specular = 0;
    }
    return opts;
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("tabindex")) this.tabIndex = this.hasAttribute("disabled") ? -1 : 0;
    this.syncRole();
    this.addEventListener("keydown", this.onKeyDown);
    this.addEventListener("keyup", this.onKeyUp);
    this.addEventListener("click", this.onClick);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this.onKeyDown);
    this.removeEventListener("keyup", this.onKeyUp);
    this.removeEventListener("click", this.onClick);
  }
  attributeChanged(name) {
    if (name === "disabled") {
      this.tabIndex = this.hasAttribute("disabled") ? -1 : 0;
      this.setAttribute("aria-disabled", String(this.hasAttribute("disabled")));
    }
    if (name === "variant" || name === "shape") this.surface?.set(this.glassOptions());
    this.syncRole();
  }
  syncRole() {
    const role = this.hasAttribute("href") ? "link" : "button";
    if (this.getAttribute("role") !== role) this.setAttribute("role", role);
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  set disabled(v) {
    this.toggleAttribute("disabled", v);
  }
}
GlassButtonElement.glassDefaults = { radius: "capsule" };
GlassButtonElement.interactive = true;
GlassButtonElement.styles = css;
GlassButtonElement.formAssociated = true;
GlassButtonElement.extraAttributes = ["variant", "shape", "disabled", "href"];
define("glass-button", GlassButtonElement);
export {
  GlassButtonElement
};
