import { Spring, clamp, springs } from "../core/spring.js";
import { addTask, wake } from "../core/ticker.js";
import { onAppearanceChange, resolveAppearance } from "../engine/appearance.js";
import { adoptStyles } from "../engine/styles.js";
import { ThumbLens, thumbCss } from "../interaction/thumb.js";
import { HTMLElementBase, hostCss, define } from "./base.js";
import { attachInternals } from "./form.js";
const TW = 38;
const TH = 24;
const HEIGHT = 28;
const css = (
  /* css */
  `
:host{display:block;position:relative;height:${HEIGHT}px;min-width:120px;cursor:pointer;touch-action:pan-y;user-select:none;-webkit-user-select:none;outline:none;border-radius:${HEIGHT / 2}px;}
:host(:focus-visible){box-shadow:0 0 0 3px color-mix(in srgb,var(--glass-accent,#0a84ff) 60%,transparent);}
:host(:focus-visible)::after{display:none;}
.track{position:absolute;left:0;right:0;top:50%;height:var(--glass-slider-track,6px);margin-top:calc(var(--glass-slider-track,6px) / -2);border-radius:999px;
  background:var(--glass-slider-off,rgba(120,120,128,.2));overflow:hidden;}
:host([data-appearance=dark]) .track{background:var(--glass-slider-off,rgba(120,120,128,.36));}
.fill{position:absolute;left:0;top:0;bottom:0;width:100%;border-radius:999px;background:var(--glass-accent,#0a84ff);transform-origin:0 50%;transform:scaleX(0);}
.ticks{position:absolute;left:${TW / 2}px;right:${TW / 2}px;top:50%;height:0;}
.ticks i{position:absolute;top:-2px;width:4px;height:4px;margin-left:-2px;border-radius:50%;background:rgba(120,120,128,.55);}
`
);
class GlassSliderElement extends HTMLElementBase {
  constructor() {
    super();
    this.thumb = null;
    this.pos = new Spring(0, springs.snap);
    this.drag = null;
    this.value_ = 0;
    this.width = 0;
    this.initialized = false;
    this.removeTask = null;
    this.unwatch = null;
    this.ro = null;
    this.task = {
      write: (_now, dt) => {
        if (!this.thumb) return false;
        this.pos.step(dt);
        const travel = Math.max(0, this.width - TW);
        const cx = TW / 2 + clamp(this.pos.value, -0.04, 1.04) * travel;
        this.thumb.update(dt, cx, HEIGHT / 2, this.pos.velocity * travel);
        this.fill.style.transform = `scaleX(${(Math.max(0, cx) / Math.max(1, this.width)).toFixed(5)})`;
        return !!this.drag || !this.pos.settled || !this.thumb.settled;
      }
    };
    this.startValue = 0;
    this.onDown = (e) => {
      if (e.button !== 0 || this.hasAttribute("disabled")) return;
      e.preventDefault();
      this.focus({ preventScroll: true });
      const f = this.fractionAt(e.clientX);
      const travel = Math.max(1, this.offsetWidth - TW);
      const onThumb = Math.abs(f - this.pos.value) * travel < TW / 2 + 4;
      this.drag = { id: e.pointerId, offset: onThumb ? this.pos.value - f : 0 };
      this.startValue = this.value_;
      this.thumb?.press();
      this.track(e.clientX);
      window.addEventListener("pointermove", this.onMove);
      window.addEventListener("pointerup", this.onUp);
      window.addEventListener("pointercancel", this.onUp);
    };
    this.onMove = (e) => {
      if (!this.drag || e.pointerId !== this.drag.id) return;
      this.track(e.clientX);
    };
    this.onUp = (e) => {
      if (!this.drag || e.pointerId !== this.drag.id) return;
      this.drag = null;
      window.removeEventListener("pointermove", this.onMove);
      window.removeEventListener("pointerup", this.onUp);
      window.removeEventListener("pointercancel", this.onUp);
      this.thumb?.release();
      this.pos.to(this.fraction(this.value_), springs.snap);
      if (this.value_ !== this.startValue) this.dispatchEvent(new Event("change", { bubbles: true }));
      wake(this.task);
    };
    this.onKey = (e) => {
      const span = this.max - this.min;
      const step = this.step || span / 100;
      let v = this.value_;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          v += step;
          break;
        case "ArrowLeft":
        case "ArrowDown":
          v -= step;
          break;
        case "PageUp":
          v += Math.max(step, span / 10);
          break;
        case "PageDown":
          v -= Math.max(step, span / 10);
          break;
        case "Home":
          v = this.min;
          break;
        case "End":
          v = this.max;
          break;
        default:
          return;
      }
      e.preventDefault();
      if (getComputedStyle(this).direction === "rtl" && (e.key === "ArrowRight" || e.key === "ArrowLeft"))
        v = 2 * this.value_ - v;
      this.setValue(v, true, true);
    };
    this.shadow = this.attachShadow({ mode: "open" });
    this.internals = attachInternals(this);
  }
  static get observedAttributes() {
    return ["min", "max", "step", "value", "ticks", "disabled"];
  }
  get min() {
    const v = parseFloat(this.getAttribute("min") ?? "");
    return Number.isFinite(v) ? v : 0;
  }
  set min(v) {
    this.setAttribute("min", String(v));
  }
  get max() {
    const v = parseFloat(this.getAttribute("max") ?? "");
    return Number.isFinite(v) ? v : 100;
  }
  set max(v) {
    this.setAttribute("max", String(v));
  }
  get step() {
    const v = parseFloat(this.getAttribute("step") ?? "");
    return Number.isFinite(v) && v > 0 ? v : 0;
  }
  set step(v) {
    this.setAttribute("step", String(v));
  }
  get value() {
    return this.value_;
  }
  set value(v) {
    this.setValue(v, false, true);
  }
  get valueAsNumber() {
    return this.value_;
  }
  get form() {
    return this.internals?.form ?? null;
  }
  connectedCallback() {
    if (!this.initialized) {
      adoptStyles(this.shadow, hostCss, thumbCss, css);
      this.shadow.innerHTML = `<span class="track" part="track"><span class="fill" part="fill"></span></span><span class="ticks" part="ticks"></span>`;
      this.fill = this.shadow.querySelector(".fill");
      this.ticksEl = this.shadow.querySelector(".ticks");
      this.value_ = this.clampValue(parseFloat(this.getAttribute("value") ?? "") || this.min);
      this.pos.set(this.fraction(this.value_));
      this.initialized = true;
    }
    if (!this.hasAttribute("role")) this.setAttribute("role", "slider");
    if (!this.hasAttribute("tabindex")) this.tabIndex = this.hasAttribute("disabled") ? -1 : 0;
    this.thumb ?? (this.thumb = new ThumbLens(this.shadow, { rest: { width: TW, height: TH } }));
    this.removeTask ?? (this.removeTask = addTask(this.task));
    this.unwatch ?? (this.unwatch = onAppearanceChange(() => this.applyAppearance()));
    this.applyAppearance();
    this.ro ?? (this.ro = new ResizeObserver(() => {
      this.width = this.offsetWidth;
      this.renderTicks();
      wake(this.task);
    }));
    this.ro.observe(this);
    this.width = this.offsetWidth;
    this.syncAria();
    this.renderTicks();
    wake(this.task);
    this.addEventListener("pointerdown", this.onDown);
    this.addEventListener("keydown", this.onKey);
  }
  disconnectedCallback() {
    this.removeEventListener("pointerdown", this.onDown);
    this.removeEventListener("keydown", this.onKey);
    this.ro?.disconnect();
    queueMicrotask(() => {
      if (this.isConnected) return;
      this.thumb?.destroy();
      this.thumb = null;
      this.removeTask?.();
      this.removeTask = null;
      this.unwatch?.();
      this.unwatch = null;
    });
  }
  attributeChangedCallback(name) {
    if (!this.initialized) return;
    if (name === "value") {
      const v = parseFloat(this.getAttribute("value") ?? "");
      if (Number.isFinite(v) && v !== this.value_ && !this.drag) this.setValue(v, false, true);
    } else if (name === "min" || name === "max" || name === "step") {
      this.setValue(this.value_, false, true);
      this.renderTicks();
    } else if (name === "ticks") this.renderTicks();
    else if (name === "disabled") {
      this.tabIndex = this.hasAttribute("disabled") ? -1 : 0;
      this.setAttribute("aria-disabled", String(this.hasAttribute("disabled")));
    }
  }
  applyAppearance() {
    const appearance = resolveAppearance(this);
    if (this.getAttribute("data-appearance") !== appearance)
      this.setAttribute("data-appearance", appearance);
  }
  formResetCallback() {
    this.setValue(parseFloat(this.getAttribute("value") ?? "") || this.min, false, true);
  }
  fraction(v) {
    const span = this.max - this.min;
    return span > 0 ? (v - this.min) / span : 0;
  }
  clampValue(v) {
    const { min, max, step } = this;
    let x = clamp(v, Math.min(min, max), Math.max(min, max));
    if (step > 0) x = clamp(min + Math.round((x - min) / step) * step, min, max);
    return Math.round(x * 1e6) / 1e6;
  }
  renderTicks() {
    if (!this.ticksEl) return;
    const step = this.step;
    const count = step > 0 ? Math.round((this.max - this.min) / step) : 0;
    if (!this.hasAttribute("ticks") || count < 1 || count > 100) {
      this.ticksEl.replaceChildren();
      return;
    }
    const html = [];
    for (let i = 0; i <= count; i++)
      html.push(`<i style="left:${(i / count * 100).toFixed(4)}%"></i>`);
    this.ticksEl.innerHTML = html.join("");
  }
  syncAria() {
    this.setAttribute("aria-valuemin", String(this.min));
    this.setAttribute("aria-valuemax", String(this.max));
    this.setAttribute("aria-valuenow", String(this.value_));
    this.internals?.setFormValue(String(this.value_));
  }
  setValue(v, user, animate, commit = true) {
    const next = this.clampValue(v);
    const changed = next !== this.value_;
    this.value_ = next;
    this.syncAria();
    if (animate) this.pos.to(this.fraction(next), springs.snap);
    wake(this.task);
    if (user && changed) this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    if (user && commit && changed) this.dispatchEvent(new Event("change", { bubbles: true }));
  }
  fractionAt(clientX) {
    const r = this.getBoundingClientRect();
    const scale = r.width / (this.offsetWidth || 1);
    const x = (clientX - r.left) / scale;
    return (x - TW / 2) / Math.max(1, this.offsetWidth - TW);
  }
  track(clientX) {
    if (!this.drag) return;
    const raw = this.fractionAt(clientX) + this.drag.offset;
    const p = raw < 0 ? raw * 0.15 : raw > 1 ? 1 + (raw - 1) * 0.15 : raw;
    this.pos.to(this.step > 0 ? p : p, springs.track);
    const span = this.max - this.min;
    this.setValue(this.min + clamp(p, 0, 1) * span, true, false, false);
    if (this.step > 0) this.pos.to(clamp(p, -0.04, 1.04), springs.track);
  }
}
GlassSliderElement.formAssociated = true;
define("glass-slider", GlassSliderElement);
export {
  GlassSliderElement
};
