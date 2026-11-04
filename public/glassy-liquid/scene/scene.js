import { nextId, supportsBackdropSvg, supportsWebGL } from "../core/env.js";
import { addTask, wake } from "../core/ticker.js";
import {
  rescanSurfaces
} from "../engine/surface.js";
import { HTMLElementBase, define } from "../components/base.js";
import { DomFilterRenderer } from "./dom.js";
import { GlRenderer, objectFitMap } from "./gl.js";
const isMedia = (el) => el instanceof HTMLImageElement || el instanceof HTMLVideoElement || el instanceof HTMLCanvasElement;
let styled = false;
function injectStyles() {
  if (styled || typeof document === "undefined") return;
  styled = true;
  const s = document.createElement("style");
  s.id = "glassy-liquid-scene";
  s.textContent = `glass-scene{display:block;position:relative;z-index:0;background:linear-gradient(160deg,#9bb7c9,#e7eef2);}`;
  document.head.append(s);
}
class GlassSceneElement extends HTMLElementBase {
  constructor() {
    super(...arguments);
    this.bindings = /* @__PURE__ */ new Set();
    this.tex = null;
    this.texVersion = -1;
    this.visible = true;
    this.io = null;
    this.uid = nextId("scene");
    this.dom = null;
    this.backdropEl = null;
    this.mode = null;
    this.watchUntil = 0;
    this.removeTask = null;
    this.ro = null;
    this.mediaDirty = true;
    /** Decoding of the backdrop image, which must finish before its first upload. */
    this.decoding = null;
    this.videoHandle = 0;
    this.listening = false;
    /**
     * The `src` image lives in the scene's shadow root (part "backdrop"), not in
     * its light DOM: frameworks hydrating server markup must find exactly the
     * children they rendered, even if the elements upgraded first.
     */
    this.autoImg = null;
    /** A src that already failed to load. Do not assign it again (that loops the broken icon). */
    this.failedSrc = null;
    this.task = {
      write: (now) => this.frame(now)
    };
    /** Keep tracking surface positions for a while (scrolling, animations). */
    this.poke = () => {
      if (!this.visible) return;
      this.watchUntil = performance.now() + 600;
      wake(this.task);
    };
  }
  static get observedAttributes() {
    return ["src", "backdrop", "mode", "force"];
  }
  ensureShadow() {
    if (this.shadowRoot) return this.shadowRoot;
    const root = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `:host{display:block;position:relative;z-index:0;}
[part=backdrop]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-1;pointer-events:none;user-select:none;}
[part=backdrop]:not([src]){display:none;}`;
    root.append(style, document.createElement("slot"));
    return root;
  }
  get sceneMode() {
    return this.mode;
  }
  /** `force` attribute: use the scene engines in Chromium too. */
  get sceneForced() {
    return this.hasAttribute("force");
  }
  /** The element whose content the glass refracts. */
  get backdrop() {
    return this.backdropEl;
  }
  connectedCallback() {
    injectStyles();
    this.resolve();
    this.removeTask ?? (this.removeTask = addTask(this.task));
    if (!this.listening) {
      this.listening = true;
      window.addEventListener("scroll", this.poke, { capture: true, passive: true });
      window.addEventListener("resize", this.poke, { passive: true });
      for (const t of [
        "pointerdown",
        "pointermove",
        "pointerup",
        "transitionrun",
        "animationstart",
        "toggle"
      ])
        this.addEventListener(t, this.poke, { capture: true, passive: true });
    }
    if (!this.io && typeof IntersectionObserver !== "undefined") {
      this.io = new IntersectionObserver(
        (entries) => {
          const v = entries.some((e) => e.isIntersecting);
          if (v && !this.visible) this.invalidate();
          this.visible = v;
        },
        { rootMargin: "300px" }
      );
      this.io.observe(this);
    }
    this.poke();
    rescanSurfaces();
  }
  disconnectedCallback() {
    queueMicrotask(() => {
      if (this.isConnected) return;
      window.removeEventListener("scroll", this.poke, { capture: true });
      window.removeEventListener("resize", this.poke);
      for (const t of [
        "pointerdown",
        "pointermove",
        "pointerup",
        "transitionrun",
        "animationstart",
        "toggle"
      ])
        this.removeEventListener(t, this.poke, { capture: true });
      this.listening = false;
      this.io?.disconnect();
      this.io = null;
      this.removeTask?.();
      this.removeTask = null;
      this.teardownRenderers();
      rescanSurfaces();
    });
  }
  attributeChangedCallback(_name, old, value) {
    if (old === value) return;
    if (this.isConnected) {
      this.resolve();
      this.reattachSurfaces();
      rescanSurfaces();
    }
  }
  /** Re-render after the backdrop changed (e.g. you drew into a backdrop canvas). */
  invalidate() {
    this.mediaDirty = true;
    for (const b of this.bindings) b.dirty = true;
    this.poke();
  }
  findBackdrop() {
    const sel = this.getAttribute("backdrop");
    if (sel) return this.querySelector(sel) ?? document.querySelector(sel);
    return this.querySelector(":scope > [glass-backdrop], :scope > [data-glass-backdrop]");
  }
  hideFailedImage(img) {
    img.removeAttribute("src");
    img.style.display = "none";
    if (this.backdropEl === img) {
      this.backdropEl = null;
      this.mode = null;
      this.teardownRenderers();
    }
  }
  watchAutoImage(img, src) {
    if (img.dataset.watchSrc === src) return;
    img.dataset.watchSrc = src;
    img.addEventListener("error", () => {
      if (this.getAttribute("src") !== src) return;
      this.failedSrc = src;
      this.hideFailedImage(img);
    });
  }
  resolve() {
    let el = this.findBackdrop();
    const src = this.getAttribute("src");
    if (this.failedSrc && src !== this.failedSrc) this.failedSrc = null;
    const auto = this.autoImg?.isConnected && this.autoImg.hasAttribute("src") ? this.autoImg : null;
    if (src && this.failedSrc === src) {
      if (this.autoImg) this.hideFailedImage(this.autoImg);
      if (el === this.autoImg) el = null;
    } else if (src && (!el || el === auto)) {
      const root = this.ensureShadow();
      const img = this.autoImg ?? (this.autoImg = document.createElement("img"));
      img.setAttribute("part", "backdrop");
      img.setAttribute("data-glass-auto-backdrop", "");
      img.alt = "";
      img.decoding = "async";
      img.crossOrigin = "anonymous";
      img.style.display = "";
      this.watchAutoImage(img, src);
      if (img.getAttribute("src") !== src) {
        img.src = src;
        img.addEventListener("load", () => this.invalidate(), { once: true });
        this.mediaDirty = true;
      }
      if (img.parentNode !== root) root.prepend(img);
      el = img;
    } else if (auto && el !== auto) auto.removeAttribute("src");
    if (el !== this.backdropEl) {
      this.teardownRenderers();
      this.backdropEl = el;
      if (el instanceof HTMLImageElement && !el.complete)
        el.addEventListener("load", () => this.invalidate(), { once: true });
      if (el instanceof HTMLVideoElement) this.watchVideo(el);
    }
    const forced = this.getAttribute("mode");
    const wantGl = forced !== "dom" && isMedia(el) && supportsWebGL();
    this.mode = !el ? null : wantGl ? "gl" : "dom";
    this.ro?.disconnect();
    this.ro = new ResizeObserver(() => this.invalidate());
    this.ro.observe(this);
    if (el) this.ro.observe(el);
  }
  watchVideo(v) {
    const tick = () => {
      this.mediaDirty = true;
      for (const b of this.bindings) b.dirty = true;
      wake(this.task);
      if (v.isConnected)
        this.videoHandle = "requestVideoFrameCallback" in v ? v.requestVideoFrameCallback(tick) : requestAnimationFrame(tick);
    };
    tick();
  }
  teardownRenderers() {
    if (this.tex) GlRenderer.shared()?.release(this.tex);
    this.tex = null;
    this.texVersion = -1;
    this.decoding = null;
    this.dom?.destroy();
    this.dom = null;
    if (this.videoHandle) cancelAnimationFrame(this.videoHandle);
  }
  reattachSurfaces() {
    for (const b of Array.from(this.bindings)) b.surface.reattach();
  }
  attachSurface(surface) {
    if (!this.mode) return null;
    if (supportsBackdropSvg() && !this.sceneForced && surface.options.engine === "auto")
      return null;
    const binding = {
      surface,
      last: "",
      dirty: true,
      update: () => {
        binding.dirty = true;
        wake(this.task);
      },
      destroy: () => {
        this.bindings.delete(binding);
        binding.canvas?.remove();
        this.dom?.set(binding, null);
        this.dom?.commit();
      }
    };
    if (this.mode === "gl") {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      surface.backdropLayer.append(canvas);
      binding.canvas = canvas;
    }
    this.bindings.add(binding);
    this.poke();
    return binding;
  }
  frame(now) {
    const el = this.backdropEl;
    if (!el || !this.mode || !this.bindings.size) return false;
    const br = el.getBoundingClientRect();
    if (this.mode === "gl") this.frameGl(el, br);
    else this.frameDom(el, br);
    return now < this.watchUntil || el instanceof HTMLVideoElement && !el.paused;
  }
  measure(b, br) {
    const host = b.surface.host;
    const r = host.getBoundingClientRect();
    const w = host.offsetWidth;
    const h = host.offsetHeight;
    if (!w || !h) return null;
    const x = r.left - br.left;
    const y = r.top - br.top;
    const sx = r.width / w;
    const sy = r.height / h;
    return {
      x,
      y,
      sx,
      sy,
      key: `${x.toFixed(2)},${y.toFixed(2)},${sx.toFixed(4)},${sy.toFixed(4)},${br.width.toFixed(1)},${br.height.toFixed(1)}`
    };
  }
  frameGl(el, br) {
    const gl = GlRenderer.shared();
    if (!gl) {
      this.fallbackToDom();
      return;
    }
    const shared = el instanceof HTMLImageElement && (el.currentSrc || el.src);
    const key = shared ? `img:${el.currentSrc || el.src}` : `el:${this.uid}`;
    if (this.tex && this.tex.key !== key) {
      gl.release(this.tex);
      this.tex = null;
    }
    if (!this.tex) {
      this.tex = gl.acquire(key);
      this.mediaDirty = true;
    }
    const tex = this.tex;
    if (this.mediaDirty) {
      const reuse = shared && tex.ready;
      if (!reuse) {
        if (el instanceof HTMLImageElement && !this.decoded(el)) return;
        if (!gl.upload(tex, el)) {
          if (el instanceof HTMLImageElement && el.complete && el.naturalWidth)
            this.fallbackToDom();
          return;
        }
      }
      this.mediaDirty = false;
    }
    if (tex.version !== this.texVersion) {
      this.texVersion = tex.version;
      for (const b of this.bindings) b.dirty = true;
    }
    const map = objectFitMap(el, el.clientWidth || br.width, el.clientHeight || br.height);
    if (!map) return;
    for (const b of this.bindings) {
      const m = this.measure(b, br);
      if (!m || !b.canvas) continue;
      if (!b.dirty && m.key === b.last) continue;
      b.last = m.key;
      b.dirty = false;
      const p = b.surface.sceneParams();
      if (p.blur > 0.1) gl.prepareBlur(tex, p.blur * tex.width * map[0]);
      gl.draw(
        tex,
        {
          width: p.metrics.width,
          height: p.metrics.height,
          radius: p.metrics.radius,
          bezel: p.metrics.bezel,
          refraction: p.refraction,
          zoom: p.zoom,
          dispersion: p.dispersion,
          blur: p.blur,
          dpr: p.dpr,
          originX: m.x,
          originY: m.y,
          scaleX: m.sx,
          scaleY: m.sy,
          lift: p.lift,
          roll: p.roll,
          saturation: p.saturation,
          fill: p.fill,
          optics: p.optics
        },
        map,
        b.canvas
      );
    }
  }
  /**
   * Whether a backdrop image can be uploaded. Firefox reports an image's size
   * while it is still streaming in or not decoded yet (preloaded or cached
   * photos with async decoding), and a texture uploaded then stays empty:
   * black glass. So an image uploads only once it is loaded and decoded.
   */
  decoded(img) {
    const src = img.currentSrc || img.src;
    if (this.decoding?.src !== src) {
      const state = { src, done: typeof img.decode !== "function" };
      this.decoding = state;
      const settle = () => {
        if (this.decoding !== state) return;
        state.done = true;
        this.invalidate();
      };
      if (!state.done) img.decode().then(settle, settle);
    }
    return this.decoding.done && img.complete && img.naturalWidth > 0;
  }
  frameDom(el, br) {
    this.dom ?? (this.dom = new DomFilterRenderer(el));
    let changed = false;
    for (const b of this.bindings) {
      const m = this.measure(b, br);
      if (!m) {
        this.dom.set(b, null);
        continue;
      }
      if (!b.dirty && m.key === b.last) continue;
      b.last = m.key;
      b.dirty = false;
      changed = true;
      this.dom.set(b, {
        params: b.surface.sceneParams(),
        x: m.x,
        y: m.y,
        scaleX: m.sx,
        scaleY: m.sy
      });
    }
    if (changed) this.dom.commit();
  }
  fallbackToDom() {
    if (this.tex) GlRenderer.shared()?.release(this.tex);
    this.tex = null;
    for (const b of this.bindings) b.canvas?.remove();
    this.setAttribute("mode", "dom");
  }
}
define("glass-scene", GlassSceneElement);
export {
  GlassSceneElement
};
