const springs = {
  /** Glass catching a finger. */
  press: { duration: 0.22, bounce: 0.18 },
  /** Letting go: gel-like overshoot back to rest. */
  release: { duration: 0.5, bounce: 0.38 },
  /** Light settling in and out of the material. */
  glow: { duration: 0.4, bounce: 0 },
  /** Shapes growing out of / into each other (menus, sheets). */
  morph: { duration: 0.46, bounce: 0.2 },
  /** Layout changes. */
  layout: { duration: 0.38, bounce: 0.14 },
  /** A selection lens following a finger. */
  track: { duration: 0.16, bounce: 0 },
  /** Selection snapping to its new home after release. */
  snap: { duration: 0.42, bounce: 0.24 },
  /** Switch thumbs and other small toggles. */
  toggle: { duration: 0.36, bounce: 0.26 }
};
class Spring {
  constructor(value = 0, config = springs.layout) {
    this.velocity = 0;
    this.omega = 0;
    this.zeta = 1;
    this.value = value;
    this.target = value;
    this.configure(config);
  }
  configure({ duration, bounce }) {
    const d = Math.max(1e-3, duration);
    const b = Math.max(-0.99, Math.min(0.99, bounce));
    this.omega = 2 * Math.PI / d;
    this.zeta = b >= 0 ? 1 - b : 1 / (1 + b);
    return this;
  }
  /** Retarget with an optional new configuration, keeping velocity. */
  to(target, config) {
    if (config) this.configure(config);
    this.target = target;
    return this;
  }
  /** Jump without animation. */
  set(value) {
    this.value = this.target = value;
    this.velocity = 0;
    return this;
  }
  get settled() {
    return this.value === this.target && this.velocity === 0;
  }
  step(dt) {
    if (this.settled || !(dt > 0)) return this;
    const w = this.omega;
    const z = this.zeta;
    const x0 = this.value - this.target;
    const v0 = this.velocity;
    let x;
    let v;
    if (z < 1) {
      const wd = w * Math.sqrt(1 - z * z);
      const e = Math.exp(-z * w * dt);
      const b = (v0 + z * w * x0) / wd;
      const c = Math.cos(wd * dt);
      const s = Math.sin(wd * dt);
      x = e * (x0 * c + b * s);
      v = e * ((b * wd - z * w * x0) * c - (x0 * wd + z * w * b) * s);
    } else if (z === 1) {
      const e = Math.exp(-w * dt);
      const b = v0 + w * x0;
      x = e * (x0 + b * dt);
      v = e * (b - w * (x0 + b * dt));
    } else {
      const r = w * Math.sqrt(z * z - 1);
      const r1 = -z * w + r;
      const r2 = -z * w - r;
      const c2 = (v0 - r1 * x0) / (r2 - r1);
      const c1 = x0 - c2;
      const e1 = Math.exp(r1 * dt);
      const e2 = Math.exp(r2 * dt);
      x = c1 * e1 + c2 * e2;
      v = c1 * r1 * e1 + c2 * r2 * e2;
    }
    const scale = Math.max(1, Math.abs(this.target));
    if (Math.abs(x) < 5e-4 * scale && Math.abs(v) < 5e-3 * scale) {
      this.value = this.target;
      this.velocity = 0;
    } else {
      this.value = this.target + x;
      this.velocity = v;
    }
    return this;
  }
}
function rubberBand(offset, limit, coefficient = 0.55) {
  if (limit <= 0) return 0;
  const m = Math.abs(offset);
  return Math.sign(offset) * limit * (1 - 1 / (m * coefficient / limit + 1));
}
const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
const mix = (a, b, t) => a + (b - a) * t;
export {
  Spring,
  clamp,
  mix,
  rubberBand,
  springs
};
