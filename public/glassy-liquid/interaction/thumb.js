import { prefersReducedMotion } from "../core/env.js";
import { Spring, clamp, springs } from "../core/spring.js";
import { GlassSurface } from "../engine/surface.js";
const thumbCss = (
  /* css */
  `
.gl-thumb{position:absolute;left:0;top:0;will-change:transform;pointer-events:none;}
.gl-thumb>.solid{position:absolute;left:50%;top:50%;border-radius:999px;background:var(--glass-thumb,#fff);
  box-shadow:0 3px 8px rgba(0,0,0,.15),0 3px 1px rgba(0,0,0,.06),0 0 0 .5px rgba(0,0,0,.04);}
`
);
class ThumbLens {
  constructor(parent, options = {}) {
    /** 0 = resting solid thumb, 1 = lifted glass lens. */
    this.lift = new Spring(0, springs.press);
    this.stretch = 0;
    this.lastX = 0;
    this.rest = options.rest ?? { width: 38, height: 24 };
    this.lifted = options.lifted ?? { width: 58, height: 38 };
    this.el = document.createElement("span");
    this.el.className = "gl-thumb";
    this.el.setAttribute("part", "thumb");
    Object.assign(this.el.style, {
      width: `${this.lifted.width}px`,
      height: `${this.lifted.height}px`,
      borderRadius: `${this.lifted.height / 2}px`
    });
    this.solid = document.createElement("span");
    this.solid.className = "solid";
    Object.assign(this.solid.style, {
      width: `${this.lifted.width}px`,
      height: `${this.lifted.height}px`,
      margin: `${-this.lifted.height / 2}px 0 0 ${-this.lifted.width / 2}px`
    });
    this.el.append(this.solid);
    parent.append(this.el);
    this.surface = new GlassSurface(this.el, {
      material: "clear",
      radius: "capsule",
      refraction: 10,
      bezel: 11,
      zoom: 1.14,
      dispersion: 0.5,
      shadow: "0 8px 22px rgba(0,0,0,.16)",
      appearance: "light",
      ...options.glass
    });
  }
  press() {
    this.lift.to(1, springs.press);
  }
  release() {
    this.lift.to(0, springs.release);
  }
  get settled() {
    return this.lift.settled && this.stretch < 2e-3;
  }
  /**
   * Advance and write the transform. `cx`, `cy` are the thumb center in the
   * parent's coordinates; `velocity` the horizontal speed in px/s.
   */
  update(dt, cx, cy, velocity = (cx - this.lastX) / Math.max(dt, 1e-3)) {
    this.lastX = cx;
    this.lift.step(dt);
    const reduced = prefersReducedMotion();
    const lift = reduced ? 0 : clamp(this.lift.value, 0, 1.25);
    const target = reduced ? 0 : Math.min(0.25, Math.abs(velocity) * 5e-4) * clamp(lift, 0, 1);
    this.stretch += (target - this.stretch) * Math.min(1, dt * 18);
    const { width: rw, height: rh } = this.rest;
    const { width: lw, height: lh } = this.lifted;
    const sx = (rw / lw + (1 - rw / lw) * lift) * (1 + this.stretch);
    const sy = (rh / lh + (1 - rh / lh) * lift) / Math.sqrt(1 + this.stretch);
    this.el.style.transform = `translate(${(cx - lw / 2).toFixed(2)}px,${(cy - lh / 2).toFixed(2)}px) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    this.solid.style.opacity = clamp(1 - lift * 1.7, 0, 1).toFixed(3);
    this.surface.setOpacity(clamp(lift * 4, 0, 1));
  }
  destroy() {
    this.surface.destroy();
    this.el.remove();
  }
}
export {
  ThumbLens,
  thumbCss
};
