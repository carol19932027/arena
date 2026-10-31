import {
  devicePixelRatio,
  nextId,
  supportsBackdropFilter,
  supportsBackdropSvg,
  watchMedia
} from "../core/env.js";
import { rimImage, shadowImage } from "../core/maps.js";
import { defaultOptics } from "../core/optics.js";
import { shapeMetrics } from "../core/shape.js";
import { onAppearanceChange, resolveAppearance } from "./appearance.js";
import {
  materials,
  parseColor,
  toneTable
} from "./materials.js";
import { observeSize } from "./observe.js";
import { ensureDocumentStyles } from "./styles.js";
import { GlassFilter } from "./svg-filter.js";
const defaultGlassOptions = {
  material: "regular",
  appearance: "auto",
  radius: 24,
  refraction: void 0,
  bezel: 18,
  blur: void 0,
  dispersion: void 0,
  tint: null,
  specular: 1,
  lightAngle: -135,
  shadow: true,
  profile: "squircle",
  zoom: 1,
  backdrop: true,
  fill: null,
  engine: "auto"
};
const surfaces = /* @__PURE__ */ new WeakMap();
const live = /* @__PURE__ */ new Set();
let rescanQueued = false;
function rescanSurfaces() {
  if (rescanQueued) return;
  rescanQueued = true;
  queueMicrotask(() => {
    rescanQueued = false;
    for (const s of live) s.reattach();
  });
}
function getSurface(el) {
  return surfaces.get(el);
}
function findScene(el) {
  let node = el;
  while (node) {
    if (node instanceof Element && node.attachSurface && node.localName === "glass-scene")
      return node;
    node = node.parentNode ?? (node instanceof ShadowRoot ? node.host : null);
  }
  return null;
}
class GlassSurface {
  constructor(host, options = {}, init = {}) {
    this.filter = null;
    this.scene = null;
    this.sceneHost = null;
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.engineKind = "css";
    this.disposers = [];
    this.frame = 0;
    this.sizeOverride = null;
    this.radiusOverride = null;
    this.appearanceValue = "light";
    /** Re-resolve the appearance on the next render (style reads are skipped while morphing). */
    this.appearanceStale = true;
    this.host = host;
    this.opts = { ...defaultGlassOptions, ...stripUndefined(options) };
    const root = init.root ?? host;
    if (root === host) ensureDocumentStyles();
    const fx = document.createElement("gl-fx");
    fx.setAttribute("aria-hidden", "true");
    fx.setAttribute("part", "glass");
    const layer = (cls) => {
      const e = document.createElement("gl-l");
      e.className = cls;
      fx.append(e);
      return e;
    };
    this.shadowLayer = layer("s");
    this.backdrop = layer("b");
    this.tintLayer = layer("t");
    this.rim = layer("r");
    this.glowLayer = layer("g");
    this.glowLayer.append(document.createElement("i"));
    this.fx = fx;
    root.insertBefore(fx, init.before === void 0 ? root.firstChild : init.before);
    if (root === host) {
      const cs = getComputedStyle(host);
      if (cs.position === "static") host.style.position = "relative";
      if (cs.zIndex === "auto") host.style.zIndex = "0";
    }
    surfaces.set(host, this);
    live.add(this);
    this.disposers.push(
      observeSize(host, (w, h) => {
        if (this.sizeOverride) return;
        this.resize(w, h);
      }),
      onAppearanceChange(() => {
        if (this.opts.appearance === "auto" && resolveAppearance(this.host, "auto") !== this.appearanceValue)
          this.invalidate();
      }),
      watchMedia(
        "(resolution: " + (typeof window !== "undefined" ? window.devicePixelRatio : 1) + "dppx)",
        () => this.invalidate()
      )
    );
    this.width = host.offsetWidth;
    this.height = host.offsetHeight;
    this.render();
  }
  /** Current options. */
  get options() {
    return this.opts;
  }
  /** Rendering engine in use. */
  get engine() {
    return this.engineKind;
  }
  /** Current shape metrics in CSS px (untransformed). */
  get metrics() {
    const { width, height } = this.sizeOverride ?? { width: this.width, height: this.height };
    return shapeMetrics(width, height, this.radiusOverride ?? this.opts.radius, this.opts.bezel);
  }
  /** Update options. Unspecified keys keep their values; `undefined` resets to default. */
  set(options) {
    for (const key of Object.keys(options)) {
      const v = options[key];
      this.opts[key] = v === void 0 ? defaultGlassOptions[key] : v;
    }
    this.invalidate();
  }
  /**
   * Temporarily drive the glass geometry (morph animations) without waiting
   * for layout. Pass null to return to the measured size.
   */
  setGeometry(size, radius) {
    this.sizeOverride = size;
    this.radiusOverride = radius ?? null;
    if (!size) {
      this.width = this.host.offsetWidth;
      this.height = this.host.offsetHeight;
    }
    this.render();
  }
  /** Light the glass from a point (local CSS px) with an intensity 0..1. */
  setGlow(x, y, intensity, size) {
    const s = this.fx.style;
    s.setProperty("--gl-glow", intensity.toFixed(3));
    s.setProperty("--gl-glow-x", `${x.toFixed(1)}px`);
    s.setProperty("--gl-glow-y", `${y.toFixed(1)}px`);
    if (size) s.setProperty("--gl-glow-size", `${size.toFixed(0)}px`);
  }
  /**
   * Fade the whole glass (0..1) without breaking the backdrop: the opacity is
   * applied per layer, never on a common parent.
   */
  setOpacity(value) {
    const v = value >= 0.999 ? "" : Math.max(0, value).toFixed(3);
    if (v) this.fx.style.setProperty("--gl-o", v);
    else this.fx.style.removeProperty("--gl-o");
  }
  /** Schedule a re-render on the next frame (coalesced); re-reads the appearance. */
  invalidate() {
    this.appearanceStale = true;
    if (this.frame) return;
    if (typeof requestAnimationFrame !== "function") {
      this.render();
      return;
    }
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.render();
    });
  }
  resize(w, h) {
    if (Math.abs(w - this.width) < 0.01 && Math.abs(h - this.height) < 0.01) return;
    this.width = w;
    this.height = h;
    this.render();
  }
  /** Effective appearance, as of the last render. */
  appearance() {
    return this.appearanceValue;
  }
  spec() {
    return materials[this.opts.material][this.appearanceValue];
  }
  chooseEngine() {
    const forced = this.opts.engine;
    if (forced === "css" || !this.opts.backdrop) return "css";
    if (forced === "backdrop") return supportsBackdropSvg() ? "backdrop" : "css";
    const scene = findScene(this.host);
    if (forced === "auto" && supportsBackdropSvg() && !scene?.sceneForced) return "backdrop";
    if (scene?.sceneMode === "gl" && (forced === "auto" || forced === "scene-gl"))
      return "scene-gl";
    if (scene?.sceneMode === "dom" && (forced === "auto" || forced === "scene-dom"))
      return "scene-dom";
    if (forced === "scene-gl" || forced === "scene-dom")
      return supportsBackdropSvg() ? "backdrop" : "css";
    return "css";
  }
  /** Refraction strength actually used, in CSS px. */
  refraction(m = this.metrics) {
    if (this.opts.refraction !== void 0) return Math.max(0, this.opts.refraction);
    const short = Math.min(m.width, m.height);
    return Math.max(8, short <= 64 ? short * 0.36 : Math.max(16, 23 - (short - 64) * 0.12));
  }
  /** Effective blur (frost) in CSS px. */
  blur() {
    return this.opts.blur ?? this.spec().blur;
  }
  /** Optics configuration for map generation. */
  optics() {
    return { ...defaultOptics, profile: this.opts.profile };
  }
  /** Re-render now. Cheap: map tiles are cached and only changed attributes are written. */
  render() {
    const m = this.metrics;
    if (this.appearanceStale || this.opts.appearance !== "auto") {
      this.appearanceStale = false;
      this.appearanceValue = this.opts.appearance !== "auto" ? this.opts.appearance : resolveAppearance(this.host, "auto");
    }
    const spec = this.spec();
    const dpr = devicePixelRatio();
    this.dpr = dpr;
    const engine = this.chooseEngine();
    if (engine !== this.engineKind) this.switchEngine(engine);
    this.engineKind = engine;
    this.host.dataset.glassEngine = engine;
    const fs = this.fx.style;
    fs.borderRadius = `${m.radius}px`;
    fs.setProperty("--gl-fill", spec.fill);
    this.renderShadow(m.radius, spec, dpr);
    this.host.style.setProperty("--gl-fg", spec.foreground);
    this.host.style.setProperty("--gl-text-shadow", spec.textShadow);
    if (this.host.dataset.glassAppearance !== this.appearanceValue)
      this.host.dataset.glassAppearance = this.appearanceValue;
    this.host.style.setProperty("--glass-r", `${m.radius}px`);
    const tint = this.opts.tint ? parseColor(this.opts.tint) : null;
    if (tint) {
      fs.setProperty(
        "--gl-tint",
        `rgb(${tint[0] * 255 | 0} ${tint[1] * 255 | 0} ${tint[2] * 255 | 0})`
      );
      fs.setProperty("--gl-tint-opacity", String(Math.min(1, 0.88 * tint[3])));
    } else {
      fs.setProperty("--gl-tint-opacity", "0");
    }
    const rim = rimImage(m, dpr, {
      ...spec.rim,
      angle: this.opts.lightAngle,
      intensity: Math.min(1, spec.rim.intensity * this.opts.specular),
      glowIntensity: spec.rim.glowIntensity * Math.min(2, this.opts.specular)
    });
    const rs = this.rim.style;
    rs.borderWidth = `${rim.borderY}px ${rim.borderX}px`;
    rs.borderImageSource = `url("${rim.url}")`;
    rs.borderImageSlice = `${rim.sliceY} ${rim.sliceX}`;
    rs.borderImageWidth = `${rim.borderY}px ${rim.borderX}px`;
    rs.borderImageRepeat = "stretch";
    fs.setProperty("--gl-rim-o", this.opts.specular <= 0 ? "0" : "1");
    const bs = this.backdrop.style;
    if (engine === "backdrop") {
      if (!this.filter) {
        this.filter = new GlassFilter(nextId("glf"));
        this.fx.append(this.filter.svg);
      }
      const blur = this.blur();
      this.filter.update({
        metrics: m,
        dpr,
        optics: this.optics(),
        refraction: this.refraction(m),
        dispersion: this.opts.dispersion ?? 0,
        tone: toneTable(spec),
        blur: 0,
        zoom: this.opts.zoom
      });
      const value = `${blur > 0 ? `blur(${blur}px) ` : ""}url(#${this.filter.id}) saturate(${spec.saturation})`;
      if (bs.backdropFilter !== value) {
        bs.backdropFilter = value;
        bs.setProperty("-webkit-backdrop-filter", value);
      }
    } else if (engine === "css") {
      const blur = this.opts.blur ?? spec.fallbackBlur;
      const value = this.opts.backdrop && supportsBackdropFilter() ? `blur(${blur}px) saturate(${spec.saturation + 0.35})` : "";
      bs.backdropFilter = value;
      bs.setProperty("-webkit-backdrop-filter", value);
      fs.setProperty("--gl-fill", spec.fallbackFill);
    } else {
      bs.backdropFilter = "";
      bs.setProperty("-webkit-backdrop-filter", "");
      this.scene?.update();
    }
    if (this.opts.fill !== null) fs.setProperty("--gl-fill", this.opts.fill);
    else if (!this.opts.backdrop) fs.setProperty("--gl-fill", "transparent");
    if (engine === "scene-gl") fs.setProperty("--gl-fill", "transparent");
  }
  /**
   * Material shadows are drawn from a cached 9-slice image (one image draw per
   * repaint); custom CSS shadows fall back to box-shadow.
   */
  renderShadow(radius, spec, dpr) {
    const layer = this.shadowLayer;
    const ls = layer.style;
    const custom = typeof this.opts.shadow === "string" ? this.opts.shadow : null;
    const image = this.opts.shadow === true ? shadowImage(radius, spec.shadow, dpr) : null;
    if (image) {
      this.fx.style.setProperty("--gl-shadow", "none");
      ls.borderStyle = "solid";
      ls.borderColor = "transparent";
      ls.borderWidth = `${image.inset}px`;
      ls.borderImageSource = `url("${image.url}")`;
      ls.borderImageSlice = String(image.slice);
      ls.borderImageWidth = `${image.inset + image.outset}px`;
      ls.borderImageOutset = `${image.outset}px`;
      ls.borderImageRepeat = "stretch";
    } else {
      ls.borderImageSource = "";
      ls.borderWidth = "0";
      this.fx.style.setProperty("--gl-shadow", custom ?? "none");
    }
  }
  switchEngine(next) {
    if (next !== "backdrop" && this.filter) {
      this.filter.destroy();
      this.filter = null;
    }
    if (next !== "scene-gl" && next !== "scene-dom" && this.scene) {
      this.scene.destroy();
      this.scene = null;
    }
    if ((next === "scene-gl" || next === "scene-dom") && !this.scene) {
      this.sceneHost = findScene(this.host);
      this.scene = this.sceneHost?.attachSurface(this) ?? null;
    }
    if (next !== "scene-gl" && next !== "scene-dom") this.sceneHost = findScene(this.host);
  }
  /** Everything a scene renderer needs to draw this surface. */
  sceneParams() {
    const m = this.metrics;
    const spec = this.spec();
    return {
      metrics: m,
      refraction: this.refraction(m),
      // The scene lens magnifies the sample. A backdrop blur of the same
      // radius leaves a high-contrast glyph sharp under the label, so the
      // scene path frosts harder. The backdrop engine is unchanged.
      blur: this.blur() > 0.1 ? this.blur() * 2 : this.blur(),
      zoom: this.opts.zoom,
      dispersion: this.opts.dispersion ?? (this.engineKind === "scene-gl" ? 0.25 : 0),
      optics: this.optics(),
      lift: spec.lift,
      roll: spec.roll,
      saturation: spec.saturation,
      fill: parseColor(this.opts.fill ?? spec.fill) ?? [1, 1, 1, 0],
      tone: toneTable(spec),
      dpr: devicePixelRatio()
    };
  }
  /** Layer that scene renderers draw into. */
  get backdropLayer() {
    return this.backdrop;
  }
  /** Device pixel ratio used for the last render. */
  get pixelRatio() {
    return this.dpr;
  }
  /** Re-evaluate the engine (e.g. after moving the element into or out of a scene). */
  reattach() {
    this.appearanceStale = true;
    const scene = findScene(this.host);
    const next = this.chooseEngine();
    if (next === this.engineKind && scene === this.sceneHost && (this.scene || next !== "scene-gl" && next !== "scene-dom")) {
      this.invalidate();
      return;
    }
    this.switchEngine("css");
    this.engineKind = "css";
    this.render();
  }
  destroy() {
    if (this.frame) cancelAnimationFrame(this.frame);
    for (const d of this.disposers) d();
    this.disposers = [];
    this.filter?.destroy();
    this.scene?.destroy();
    this.fx.remove();
    surfaces.delete(this.host);
    live.delete(this);
    delete this.host.dataset.glassEngine;
    delete this.host.dataset.glassAppearance;
    this.host.style.removeProperty("--gl-fg");
    this.host.style.removeProperty("--gl-text-shadow");
    this.host.style.removeProperty("--glass-r");
  }
}
function stripUndefined(o) {
  const out = {};
  for (const k of Object.keys(o)) if (o[k] !== void 0) out[k] = o[k];
  return out;
}
function glass(element, options = {}) {
  const existing = surfaces.get(element);
  if (existing) {
    existing.set(options);
    return existing;
  }
  return new GlassSurface(element, options);
}
export {
  GlassSurface,
  defaultGlassOptions,
  getSurface,
  glass,
  rescanSurfaces,
  resolveAppearance
};
