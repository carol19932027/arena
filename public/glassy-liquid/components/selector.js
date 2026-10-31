import { Spring, clamp, springs } from "../core/spring.js";
import { addTask, wake } from "../core/ticker.js";
import { onAppearanceChange, resolveAppearance } from "../engine/appearance.js";
import { GlassSurface } from "../engine/surface.js";
import { tapSlop } from "../interaction/press.js";
import { GlassElement, HTMLElementBase, accentCss, define } from "./base.js";
const itemCss = (
  /* css */
  `
:host{display:flex;flex:1 1 0;min-width:0;align-items:center;justify-content:center;position:relative;z-index:1;cursor:pointer;
  -webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;outline:none;border-radius:999px;transition:color .2s;}
:host([data-current]){color:var(--gl-item-current,currentColor);}
:host([disabled]){opacity:.4;pointer-events:none;}
:host(:focus-visible){box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--glass-accent,#0a84ff) 70%,transparent);}
.c{display:flex;flex-direction:var(--glass-item-direction,row);align-items:center;justify-content:center;gap:var(--glass-item-gap,4px);}
::slotted(svg),::slotted(img){width:var(--gl-item-icon,1.25em);height:var(--gl-item-icon,1.25em);flex:none;}
`
);
function itemValue(it) {
  return it.getAttribute("value") ?? String(Array.from(it.parentElement?.children ?? []).indexOf(it));
}
const itemDisabled = (it) => !!it?.hasAttribute("disabled");
class GlassSelectorItem extends HTMLElementBase {
  constructor() {
    super(...arguments);
    this.initialized = false;
  }
  static get observedAttributes() {
    return ["disabled"];
  }
  connectedCallback() {
    if (!this.initialized) {
      const shadow = this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.textContent = itemCss;
      const c = document.createElement("span");
      c.className = "c";
      c.setAttribute("part", "content");
      c.append(document.createElement("slot"));
      shadow.append(style, c);
      this.initialized = true;
    }
  }
  attributeChangedCallback() {
    this.setAttribute("aria-disabled", String(this.hasAttribute("disabled")));
  }
  get value() {
    return itemValue(this);
  }
  get disabled() {
    return itemDisabled(this);
  }
  /** Content wrapper, scaled up while the selection lens passes over the item. */
  get content() {
    return this.shadowRoot?.querySelector(".c") ?? null;
  }
}
const baseCss = (
  /* css */
  `
:host{display:flex;align-items:stretch;position:relative;padding:var(--glass-selector-padding,4px);user-select:none;-webkit-user-select:none;touch-action:pan-y;}
.lens,.pill{position:absolute;left:0;top:0;pointer-events:none;will-change:transform;}
.pill,.lens{z-index:0;}
slot{display:contents;}
`
);
class GlassSelectorElement extends GlassElement {
  constructor() {
    super(...arguments);
    /** Lens overshoot around the selected item when lifted (px). */
    this.liftOut = { x: 10, y: 8 };
    /** Inset of the resting pill inside the item (px). */
    this.restIn = { x: 0, y: 0 };
    this.lensGlass = {};
    /** Extra scale of an item while the lens is over it. */
    this.magnification = 0.18;
    this.lensSurface = null;
    this.x = new Spring(0, springs.snap);
    this.w = new Spring(0, springs.snap);
    this.lift = new Spring(0, springs.press);
    this.stretch = 0;
    this.items = [];
    this.geometry = [];
    this.height = 0;
    this.selected = -1;
    this.drag = null;
    this.removeTask = null;
    this.mo = null;
    this.ro = null;
    this.lensSize = { width: 0, height: 0 };
    this.magnified = /* @__PURE__ */ new Set();
    this.current = -1;
    this.unwatch = null;
    this.task = {
      write: (_now, dt) => {
        this.x.step(dt);
        this.w.step(dt);
        this.lift.step(dt);
        const lift = clamp(this.lift.value, 0, 1.2);
        const pad = (this.height - (this.lensSize.height - 2 * this.liftOut.y)) / 2;
        const itemH = this.lensSize.height - 2 * this.liftOut.y;
        const { width: lw, height: lh } = this.lensSize;
        if (!lw) return false;
        const restW = Math.max(1, this.w.value - 2 * this.restIn.x);
        const restH = Math.max(1, itemH - 2 * this.restIn.y);
        const liftW = this.w.value + 2 * this.liftOut.x;
        const targetStretch = Math.min(0.3, Math.abs(this.x.velocity) * 45e-5) * clamp(lift, 0, 1);
        this.stretch += (targetStretch - this.stretch) * Math.min(1, dt * 16);
        const width = restW + (liftW - restW) * lift;
        const height = restH + (lh - restH) * lift;
        const sx = width / lw * (1 + this.stretch);
        const sy = height / lh / Math.sqrt(1 + this.stretch);
        const cy = pad + itemH / 2;
        const transform = `translate(${(this.x.value - lw / 2).toFixed(2)}px,${(cy - lh / 2).toFixed(2)}px) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
        this.lensEl.style.transform = transform;
        this.restEl.style.transform = transform;
        this.restEl.style.opacity = clamp(1 - lift * 1.8, 0, 1).toFixed(3);
        this.lensSurface?.setOpacity(clamp(lift * 1.5, 0, 1));
        this.magnify(lift);
        this.highlight(lift > 0.05 ? this.indexAt(this.x.value) : this.selected);
        return !!this.drag || !this.x.settled || !this.w.settled || !this.lift.settled || this.stretch > 2e-3;
      }
    };
    this.suppressClick = false;
    this.onDown = (e) => {
      if (e.button !== 0 || this.hasAttribute("disabled") || !this.geometry.length) return;
      this.suppressClick = false;
      const x = this.localX(e.clientX);
      const g = this.geometry[this.selected];
      const onSel = g && Math.abs(x - (g.x + g.width / 2)) < g.width / 2;
      this.drag = {
        id: e.pointerId,
        startX: e.clientX,
        moved: false,
        offset: onSel ? this.x.value - x : 0,
        slop: tapSlop(e)
      };
      this.lift.to(1, springs.press);
      if (!onSel) {
        const i = this.indexAt(x);
        const gi = this.geometry[i];
        if (gi) {
          this.x.to(gi.x + gi.width / 2, springs.snap);
          this.w.to(gi.width, springs.snap);
        }
      }
      window.addEventListener("pointermove", this.onMove);
      window.addEventListener("pointerup", this.onUp);
      window.addEventListener("pointercancel", this.onUp);
      wake(this.task);
    };
    this.onMove = (e) => {
      if (!this.drag || e.pointerId !== this.drag.id) return;
      if (Math.abs(e.clientX - this.drag.startX) > this.drag.slop) this.drag.moved = true;
      if (!this.drag.moved) return;
      const first = this.geometry[0];
      const last = this.geometry[this.geometry.length - 1];
      if (!first || !last) return;
      const min = first.x + first.width / 2;
      const max = last.x + last.width / 2;
      const raw = this.localX(e.clientX) + this.drag.offset;
      const x = raw < min ? min - (min - raw) * 0.2 : raw > max ? max + (raw - max) * 0.2 : raw;
      this.x.to(x, springs.track);
      const gi = this.geometry[this.indexAt(x)];
      if (gi) this.w.to(gi.width, springs.track);
      wake(this.task);
    };
    this.onUp = (e) => {
      if (!this.drag || e.pointerId !== this.drag.id) return;
      const moved = this.drag.moved;
      this.drag = null;
      window.removeEventListener("pointermove", this.onMove);
      window.removeEventListener("pointerup", this.onUp);
      window.removeEventListener("pointercancel", this.onUp);
      if (e.type === "pointercancel") {
        this.lift.to(0, springs.release);
        this.select(this.selected, false);
        return;
      }
      const i = moved ? this.indexAt(this.x.value) : this.indexAt(this.localX(e.clientX));
      if (moved) {
        this.suppressClick = true;
        setTimeout(() => this.suppressClick = false, 400);
      }
      this.select(i, true);
      setTimeout(
        () => {
          if (!this.drag) this.lift.to(0, springs.release);
          wake(this.task);
        },
        moved ? 0 : 140
      );
      wake(this.task);
    };
    this.onClick = (e) => {
      if (this.suppressClick) {
        this.suppressClick = false;
        e.stopPropagation();
      }
    };
    this.onKey = (e) => {
      const rtl = getComputedStyle(this).direction === "rtl";
      const dir = e.key === "ArrowRight" ? rtl ? -1 : 1 : e.key === "ArrowLeft" ? rtl ? 1 : -1 : 0;
      let i = this.selected;
      if (dir) {
        do
          i = (i + dir + this.items.length) % this.items.length;
        while (itemDisabled(this.items[i]) && i !== this.selected);
      } else if (e.key === "Home") i = this.items.findIndex((it) => !itemDisabled(it));
      else if (e.key === "End")
        i = this.items.length - 1 - [...this.items].reverse().findIndex((it) => !itemDisabled(it));
      else return;
      e.preventDefault();
      this.select(i, true);
      this.items[i]?.focus();
    };
  }
  render() {
    return `<span class="pill" part="indicator"></span><slot></slot><span class="lens" part="lens"></span>`;
  }
  get value() {
    const item = this.items[this.selected];
    return item ? itemValue(item) : this.getAttribute("value");
  }
  set value(v) {
    if (v === null) return;
    this.setAttribute("value", v);
  }
  setup() {
    this.lensEl = this.shadow.querySelector(".lens");
    this.restEl = this.shadow.querySelector(".pill");
    this.setAttribute("role", this.getAttribute("role") ?? "tablist");
    this.removeTask = addTask(this.task);
    this.mo = new MutationObserver(() => this.collect());
    this.mo.observe(this, {
      childList: true,
      attributes: true,
      attributeFilter: ["value", "disabled"],
      subtree: true
    });
    this.ro = new ResizeObserver(() => this.measure(false));
    this.ro.observe(this);
    this.addEventListener("pointerdown", this.onDown);
    this.addEventListener("keydown", this.onKey);
    this.addEventListener("click", this.onClick);
    this.collect();
    this.applyAppearance();
    this.unwatch = onAppearanceChange(() => this.applyAppearance());
  }
  applyAppearance() {
    const appearance = resolveAppearance(this);
    if (this.getAttribute("data-appearance") !== appearance)
      this.setAttribute("data-appearance", appearance);
  }
  teardown() {
    this.unwatch?.();
    this.unwatch = null;
    this.removeTask?.();
    this.mo?.disconnect();
    this.ro?.disconnect();
    this.lensSurface?.destroy();
    this.lensSurface = null;
    this.removeEventListener("pointerdown", this.onDown);
    this.removeEventListener("keydown", this.onKey);
    this.removeEventListener("click", this.onClick);
  }
  attributeChanged(name, _old, value) {
    if (name === "value" && value !== null) {
      const i = this.items.findIndex((it) => itemValue(it) === value);
      if (i >= 0 && i !== this.selected) this.select(i, false, true);
    }
  }
  collect() {
    this.items = Array.from(this.querySelectorAll(this.itemTag)).filter(
      (el) => el.parentElement === this
    );
    const value = this.getAttribute("value");
    let index = this.items.findIndex((it) => itemValue(it) === value);
    if (index < 0)
      index = this.selected >= 0 && this.selected < this.items.length ? this.selected : this.items.findIndex((it) => !itemDisabled(it));
    this.items.forEach((it, i) => {
      it.setAttribute("role", "tab");
      it.setAttribute("aria-selected", String(i === index));
      it.tabIndex = i === index ? 0 : -1;
    });
    this.selected = index;
    this.current = -1;
    this.highlight(index);
    this.measure(true);
  }
  measure(jump) {
    this.geometry = this.items.map((it) => ({ x: it.offsetLeft, width: it.offsetWidth }));
    this.height = this.offsetHeight;
    const pad = parseFloat(getComputedStyle(this).paddingTop) || 0;
    const itemH = this.height - 2 * pad;
    const maxW = Math.max(0, ...this.geometry.map((g2) => g2.width));
    const lw = maxW + 2 * this.liftOut.x;
    const lh = itemH + 2 * this.liftOut.y;
    if (lw !== this.lensSize.width || lh !== this.lensSize.height) {
      this.lensSize = { width: lw, height: lh };
      for (const el of [this.lensEl, this.restEl])
        Object.assign(el.style, {
          width: `${lw}px`,
          height: `${lh}px`,
          borderRadius: `${lh / 2}px`
        });
    }
    this.lensSurface ?? (this.lensSurface = new GlassSurface(this.lensEl, {
      material: "clear",
      radius: "capsule",
      refraction: 14,
      bezel: 14,
      zoom: 1.2,
      dispersion: 0.55,
      specular: 1.1,
      shadow: "0 10px 26px rgba(0,0,0,.16)",
      appearance: "light",
      ...this.lensGlass
    }));
    const g = this.geometry[this.selected];
    if (g) {
      const cx = g.x + g.width / 2;
      if (jump) {
        this.x.set(cx);
        this.w.set(g.width);
      } else {
        this.x.to(cx, springs.snap);
        this.w.to(g.width, springs.snap);
      }
    }
    this.lensEl.style.visibility = this.restEl.style.visibility = g ? "" : "hidden";
    wake(this.task);
  }
  /** Swell the items under the lens (they are drawn above it, so the glass cannot magnify them). */
  magnify(lift) {
    const half = (this.w.value + 2 * this.liftOut.x) / 2;
    this.items.forEach((it, i) => {
      const g = this.geometry[i];
      const c = it.content;
      if (!g || !c) return;
      const d = Math.abs(g.x + g.width / 2 - this.x.value);
      const k = clamp(1 - d / half, 0, 1) * clamp(lift, 0, 1);
      if (k > 1e-3) {
        c.style.scale = (1 + this.magnification * k).toFixed(4);
        this.magnified.add(it);
      } else if (this.magnified.has(it)) {
        c.style.scale = "";
        this.magnified.delete(it);
      }
    });
  }
  /** The item that shows the selection color: under the lens while it is lifted, else the selected one. */
  highlight(index) {
    if (index === this.current) return;
    this.current = index;
    this.items.forEach((it, i) => it.toggleAttribute("data-current", i === index));
  }
  indexAt(x) {
    let best = -1;
    let dist = Infinity;
    this.geometry.forEach((g, i) => {
      if (itemDisabled(this.items[i])) return;
      const d = Math.abs(g.x + g.width / 2 - x);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    return best;
  }
  localX(clientX) {
    const r = this.getBoundingClientRect();
    return (clientX - r.left) * this.offsetWidth / (r.width || 1);
  }
  /** Select an item. */
  select(index, user, animate = true) {
    const item = this.items[index];
    if (!item || itemDisabled(item)) return;
    const changed = index !== this.selected;
    this.selected = index;
    this.items.forEach((it, i) => {
      it.setAttribute("aria-selected", String(i === index));
      it.tabIndex = i === index ? 0 : -1;
    });
    const g = this.geometry[index];
    if (g) {
      if (animate) {
        this.x.to(g.x + g.width / 2, springs.snap);
        this.w.to(g.width, springs.snap);
      } else {
        this.x.set(g.x + g.width / 2);
        this.w.set(g.width);
      }
    }
    const value = itemValue(item);
    if (this.getAttribute("value") !== value) this.setAttribute("value", value);
    wake(this.task);
    if (changed && user) this.emit("change", { value, index });
  }
}
GlassSelectorElement.extraAttributes = ["value"];
GlassSelectorElement.delegatesFocus = false;
const tabBarCss = (
  /* css */
  `
:host{height:var(--glass-tab-bar-height,62px);--glass-selector-padding:4px;font-size:10px;font-weight:600;letter-spacing:.01em;}
:host{--glass-item-direction:column;--glass-item-gap:1px;--gl-item-icon:24px;--gl-item-current:var(--glass-tab-selected,var(--gl-accent-text));}
.pill{background:var(--glass-tab-selection,rgba(255,255,255,.5));box-shadow:inset 0 0 0 .5px rgba(0,0,0,.04);}
:host([data-appearance=dark]) .pill{background:var(--glass-tab-selection,rgba(0,0,0,.26));box-shadow:inset 0 0 0 .5px rgba(255,255,255,.06);}
`
);
class GlassTabBarElement extends GlassSelectorElement {
  constructor() {
    super(...arguments);
    this.itemTag = "glass-tab";
    this.liftOut = { x: 8, y: 9 };
  }
}
GlassTabBarElement.glassDefaults = { radius: "capsule" };
GlassTabBarElement.styles = baseCss + accentCss + tabBarCss;
const segmentedCss = (
  /* css */
  `
:host{display:inline-flex;height:var(--glass-segmented-height,36px);--glass-selector-padding:2px;font-size:14px;font-weight:590;letter-spacing:-.01em;
  border-radius:999px;color:var(--glass-foreground,rgba(0,0,0,.88));--gl-item-current:var(--glass-segmented-selected,currentColor);}
:host([data-appearance=dark]){color:var(--glass-foreground,rgba(255,255,255,.94));}
.track{position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;background:var(--glass-segmented-track,rgba(224,224,228,.62));
  -webkit-backdrop-filter:var(--glass-segmented-backdrop,blur(12px) saturate(1.6));backdrop-filter:var(--glass-segmented-backdrop,blur(12px) saturate(1.6));}
:host([data-appearance=dark]) .track{background:var(--glass-segmented-track,rgba(57,57,61,.74));}
::slotted(glass-segment){padding:0 14px;}
.pill{background:var(--glass-segmented-thumb,#fff);box-shadow:0 3px 8px rgba(0,0,0,.12),0 3px 1px rgba(0,0,0,.04);}
:host([data-appearance=dark]) .pill{background:var(--glass-segmented-thumb,#636366);}
`
);
class GlassSegmentedElement extends GlassSelectorElement {
  constructor() {
    super(...arguments);
    this.itemTag = "glass-segment";
    this.liftOut = { x: 6, y: 6 };
    this.magnification = 0.12;
    this.lensGlass = { refraction: 10, bezel: 10, zoom: 1.15 };
  }
  render() {
    return `<span class="track" part="track"></span>${super.render()}`;
  }
}
/** The segmented track is not glass itself; only its lens is. */
GlassSegmentedElement.hasGlass = false;
GlassSegmentedElement.styles = baseCss + segmentedCss;
define("glass-tab", class extends GlassSelectorItem {
});
define("glass-segment", class extends GlassSelectorItem {
});
define("glass-tab-bar", GlassTabBarElement);
define("glass-segmented", GlassSegmentedElement);
export {
  GlassSegmentedElement,
  GlassSelectorElement,
  GlassSelectorItem,
  GlassTabBarElement
};
