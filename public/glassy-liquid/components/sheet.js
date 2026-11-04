import { prefersReducedMotion } from "../core/env.js";
import { Spring, clamp, springs } from "../core/spring.js";
import { addTask, wake } from "../core/ticker.js";
import { onAppearanceChange, resolveAppearance } from "../engine/appearance.js";
import { GlassSurface } from "../engine/surface.js";
import { adoptStyles } from "../engine/styles.js";
import { HTMLElementBase, hostCss, define } from "./base.js";
const css = (
  /* css */
  `
:host{position:fixed;inset:0;margin:0;padding:0;border:0;background:transparent;width:auto;height:auto;max-width:none;max-height:none;
  overflow:visible;z-index:2147482000;pointer-events:none;color:var(--gl-fg);display:none;}
:host([data-visible]){display:block;}
.scrim{position:absolute;inset:0;background:var(--glass-scrim,rgba(0,0,0,.28));opacity:0;pointer-events:none;}
:host([modal][data-visible]) .scrim{pointer-events:auto;}
.sheet{position:absolute;left:var(--glass-sheet-inset,8px);right:var(--glass-sheet-inset,8px);bottom:var(--glass-sheet-inset,8px);margin:0 auto;
  max-width:var(--glass-sheet-max-width,640px);pointer-events:auto;outline:none;touch-action:none;will-change:transform;color:var(--gl-fg);}
.clip{position:absolute;inset:0;border-radius:inherit;overflow:hidden;display:flex;flex-direction:column;}
.grab{flex:none;height:22px;display:flex;justify-content:center;align-items:center;cursor:grab;}
.grab i{width:36px;height:5px;border-radius:3px;background:currentColor;opacity:.25;}
.body{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding:var(--glass-sheet-padding,4px 20px 20px);touch-action:pan-y;}
`
);
const RADIUS = 34;
class GlassSheetElement extends HTMLElementBase {
  constructor() {
    super();
    this.glassSurface = null;
    this.h = new Spring(0, springs.morph);
    this.isOpen = false;
    this.detentIndex = 0;
    this.removeTask = null;
    this.drag = null;
    this.returnFocus = null;
    this.initialized = false;
    this.unwatch = null;
    this.task = {
      write: (_now, dt) => {
        this.h.step(dt);
        this.layout();
        if (!this.isOpen && this.h.settled && this.h.value <= 0.5) this.finishClose();
        return !!this.drag || !this.h.settled;
      }
    };
    this.onScrim = () => {
      if (!this.hasAttribute("no-dismiss")) this.hide();
    };
    this.onKey = (e) => {
      if (e.key === "Escape" && !this.hasAttribute("no-dismiss")) {
        e.stopPropagation();
        this.hide();
      }
      if (e.key === "Tab" && this.isOpen && this.hasAttribute("modal")) this.trapTab(e);
    };
    /** Focus that moves outside a modal sheet (a click, a script, a screen reader) comes back. */
    this.onFocusIn = (e) => {
      if (!this.isOpen || !this.hasAttribute("modal")) return;
      const target = e.target;
      if (target && (target === this || this.contains(target))) return;
      (this.focusables()[0] ?? this.sheet).focus({ preventScroll: true });
    };
    this.onDown = (e) => {
      if (e.button !== 0) return;
      const path = e.composedPath();
      const onGrabber = path.some((n) => n instanceof HTMLElement && n.classList.contains("grab"));
      if (!onGrabber && (this.body.scrollTop > 0 || !path.includes(this.body))) {
        if (!onGrabber && !path.includes(this.body)) return;
        if (this.body.scrollTop > 0) return;
      }
      this.drag = {
        id: e.pointerId,
        startY: e.clientY,
        startH: this.h.value,
        lastY: e.clientY,
        lastT: performance.now(),
        v: 0
      };
      window.addEventListener("pointermove", this.onMove);
      window.addEventListener("pointerup", this.onUp);
      window.addEventListener("pointercancel", this.onUp);
    };
    this.onMove = (e) => {
      if (!this.drag || e.pointerId !== this.drag.id) return;
      const now = performance.now();
      const dy = e.clientY - this.drag.startY;
      if (Math.abs(dy) < 4 && this.h.value === this.drag.startH) return;
      const dt = Math.max(1, now - this.drag.lastT);
      this.drag.v = 0.7 * this.drag.v + 0.3 * ((this.drag.lastY - e.clientY) / dt) * 1e3;
      this.drag.lastY = e.clientY;
      this.drag.lastT = now;
      this.h.set(Math.max(0, this.drag.startH - dy));
      this.layout();
      wake(this.task);
    };
    this.onUp = (e) => {
      if (!this.drag || e.pointerId !== this.drag.id) return;
      const v = this.drag.v;
      this.drag = null;
      window.removeEventListener("pointermove", this.onMove);
      window.removeEventListener("pointerup", this.onUp);
      window.removeEventListener("pointercancel", this.onUp);
      const d = this.detents;
      const projected = this.h.value + v * 0.18;
      if (!this.hasAttribute("no-dismiss") && projected < (d[0] ?? 0) * 0.6) {
        this.h.velocity = v;
        this.hide();
        return;
      }
      let best = 0;
      d.forEach((x, i) => {
        if (Math.abs(x - projected) < Math.abs((d[best] ?? 0) - projected)) best = i;
      });
      this.h.velocity = v;
      this.snapTo(best);
    };
    this.shadow = this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["open", "detents", "tint", "blur", "material"];
  }
  get open() {
    return this.isOpen;
  }
  set open(v) {
    if (v) this.show();
    else this.hide();
  }
  /** Detent heights in px for the current viewport. */
  get detents() {
    const vh = window.innerHeight;
    const max = vh - 16 - 8;
    const list = (this.getAttribute("detents") ?? "medium large").split(/[\s,]+/).filter(Boolean);
    const px = list.map((d) => {
      if (d === "medium") return vh * 0.5;
      if (d === "large") return max;
      if (d === "small") return vh * 0.25;
      if (d.endsWith("%")) return vh * parseFloat(d) / 100;
      return parseFloat(d);
    });
    return px.filter((v) => Number.isFinite(v) && v > 0).map((v) => Math.min(v, max)).sort((a, b) => a - b);
  }
  connectedCallback() {
    if (!this.initialized) {
      adoptStyles(this.shadow, hostCss, css);
      this.shadow.innerHTML = `<div class="scrim" part="scrim"></div><div class="sheet" part="sheet" role="dialog" tabindex="-1"><div class="clip"><div class="grab" part="grabber"><i></i></div><div class="body" part="body"><slot></slot></div></div></div>`;
      this.sheet = this.shadow.querySelector(".sheet");
      this.body = this.shadow.querySelector(".body");
      this.scrim = this.shadow.querySelector(".scrim");
      if ("showPopover" in HTMLElement.prototype) this.setAttribute("popover", "manual");
      this.initialized = true;
    }
    const label = this.getAttribute("aria-label");
    if (label) this.sheet.setAttribute("aria-label", label);
    this.removeTask ?? (this.removeTask = addTask(this.task));
    this.unwatch ?? (this.unwatch = onAppearanceChange(() => {
      if (this.isOpen) this.glassSurface?.set({ appearance: resolveAppearance(this) });
    }));
    this.sheet.addEventListener("pointerdown", this.onDown);
    this.scrim.addEventListener("click", this.onScrim);
    this.addEventListener("keydown", this.onKey);
    if (this.hasAttribute("open")) this.show();
  }
  disconnectedCallback() {
    this.sheet.removeEventListener("pointerdown", this.onDown);
    this.scrim.removeEventListener("click", this.onScrim);
    this.removeEventListener("keydown", this.onKey);
    this.releaseFocus();
    queueMicrotask(() => {
      if (this.isConnected) return;
      this.removeTask?.();
      this.removeTask = null;
      this.unwatch?.();
      this.unwatch = null;
      this.glassSurface?.destroy();
      this.glassSurface = null;
    });
  }
  attributeChangedCallback(name) {
    if (!this.initialized) return;
    if (name === "open") {
      if (this.hasAttribute("open") && !this.isOpen) this.show();
      else if (!this.hasAttribute("open") && this.isOpen) this.hide();
    } else if (name === "detents" && this.isOpen)
      this.snapTo(Math.min(this.detentIndex, this.detents.length - 1));
    else if (name === "tint" || name === "blur" || name === "material")
      this.glassSurface?.set(this.materialOptions());
  }
  /** tint, blur, and material update the slab. Missing attributes reset to the material default. */
  materialOptions() {
    const material = this.getAttribute("material");
    const blur = this.getAttribute("blur");
    const blurN = blur === null ? void 0 : parseFloat(blur);
    return {
      material: material === "clear" ? "clear" : "regular",
      radius: RADIUS,
      appearance: resolveAppearance(this),
      blur: blurN !== void 0 && Number.isFinite(blurN) ? blurN : void 0,
      tint: this.getAttribute("tint") ?? void 0
    };
  }
  /** Present the sheet at a detent (default: the smallest). */
  show(detent = 0) {
    if (this.isOpen) {
      this.snapTo(detent);
      return;
    }
    this.isOpen = true;
    if (!this.hasAttribute("open")) this.setAttribute("open", "");
    this.returnFocus = document.activeElement;
    this.setAttribute("data-visible", "");
    if (this.hasAttribute("popover")) {
      try {
        this.showPopover();
      } catch {
      }
    }
    this.glassSurface ?? (this.glassSurface = new GlassSurface(this.sheet, this.materialOptions()));
    this.glassSurface.set(this.materialOptions());
    this.detentIndex = clamp(detent, 0, this.detents.length - 1);
    const target = this.detents[this.detentIndex] ?? 0;
    if (prefersReducedMotion()) this.h.set(target);
    else this.h.to(target, springs.morph);
    this.layout();
    wake(this.task);
    if (this.hasAttribute("modal")) {
      this.sheet.setAttribute("aria-modal", "true");
      document.addEventListener("focusin", this.onFocusIn);
    } else this.sheet.removeAttribute("aria-modal");
    this.sheet.focus({ preventScroll: true });
    this.dispatchEvent(
      new CustomEvent("toggle", { detail: { open: true }, bubbles: true, composed: true })
    );
  }
  hide() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.removeAttribute("open");
    if (prefersReducedMotion()) this.h.set(0);
    else this.h.to(0, { duration: 0.38, bounce: 0 });
    wake(this.task);
    this.releaseFocus();
    this.returnFocus?.focus?.();
    this.dispatchEvent(
      new CustomEvent("toggle", { detail: { open: false }, bubbles: true, composed: true })
    );
  }
  /** Animate to a detent index. */
  snapTo(index) {
    const d = this.detents;
    this.detentIndex = clamp(index, 0, d.length - 1);
    this.h.to(d[this.detentIndex] ?? 0, springs.snap);
    wake(this.task);
    this.dispatchEvent(
      new CustomEvent("detent", {
        detail: { index: this.detentIndex, height: d[this.detentIndex] },
        bubbles: true
      })
    );
  }
  finishClose() {
    this.removeAttribute("data-visible");
    if (this.hasAttribute("popover") && this.matches(":popover-open")) this.hidePopover();
  }
  layout() {
    const d = this.detents;
    const min = d[0] ?? 0;
    const max = d[d.length - 1] ?? 0;
    const h = this.h.value;
    const height = h > max ? max + (h - max) * 0.15 : Math.max(min, h);
    const slide = Math.max(0, min - h);
    this.sheet.style.height = `${height.toFixed(2)}px`;
    this.sheet.style.transform = `translateY(${slide.toFixed(2)}px)`;
    this.sheet.style.borderRadius = `${RADIUS}px`;
    const largest = d.length > 1 ? clamp((h - d[d.length - 2]) / (max - d[d.length - 2] || 1), 0, 1) : clamp(h / (max || 1), 0, 1);
    this.scrim.style.opacity = (this.hasAttribute("modal") ? clamp(h / (min || 1), 0, 1) * (0.5 + 0.5 * largest) : 0).toFixed(3);
  }
  /** Focusable content of the sheet, in tab order. Slotted elements live in the light DOM. */
  focusables() {
    return Array.from(
      this.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]'
      )
    ).filter(
      (el) => el.tabIndex >= 0 && !el.hasAttribute("disabled") && !el.closest("[inert]") && el.getClientRects().length > 0
    );
  }
  /** A modal sheet keeps Tab and Shift+Tab inside itself. */
  trapTab(e) {
    const items = this.focusables();
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (!first || !last) {
      e.preventDefault();
      this.sheet.focus({ preventScroll: true });
    } else if (e.shiftKey && (active === first || active === this)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }
  releaseFocus() {
    this.sheet.removeAttribute("aria-modal");
    document.removeEventListener("focusin", this.onFocusIn);
  }
}
define("glass-sheet", GlassSheetElement);
export {
  GlassSheetElement
};
