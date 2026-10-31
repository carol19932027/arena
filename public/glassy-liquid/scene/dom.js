import { displacementSet } from "../core/maps.js";
import { sliceLayout } from "../core/shape.js";
import { nextId } from "../core/env.js";
const NS = "http://www.w3.org/2000/svg";
const fmt = (v) => (Math.round(v * 100) / 100).toString();
function maskUrl(w, h, r) {
  const svg = `<svg xmlns="${NS}" width="${fmt(w)}" height="${fmt(h)}" viewBox="0 0 ${fmt(w)} ${fmt(h)}"><rect width="${fmt(w)}" height="${fmt(h)}" rx="${fmt(r)}" fill="#fff"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
function box(x, y, w, h) {
  return { x: fmt(x), y: fmt(y), width: fmt(Math.max(0, w)), height: fmt(Math.max(0, h)) };
}
function structureOf(prims) {
  return prims.map((p) => `${p.tag}:${p.attrs.result ?? ""}(${p.children ? structureOf(p.children) : ""})`).join(",");
}
class DomFilterRenderer {
  constructor(backdrop) {
    this.backdrop = backdrop;
    this.id = nextId("gls");
    this.states = /* @__PURE__ */ new Map();
    this.structure = "";
    this.applied = false;
    this.ownTransform = false;
    this.svg = document.createElementNS(NS, "svg");
    this.svg.setAttribute("aria-hidden", "true");
    this.svg.setAttribute("width", "0");
    this.svg.setAttribute("height", "0");
    this.svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
    this.filter = document.createElementNS(NS, "filter");
    this.filter.id = this.id;
    this.filter.setAttribute("filterUnits", "userSpaceOnUse");
    this.filter.setAttribute("primitiveUnits", "userSpaceOnUse");
    this.filter.setAttribute("color-interpolation-filters", "sRGB");
    this.svg.append(this.filter);
    const root = backdrop.getRootNode();
    (root instanceof ShadowRoot ? root : document.body).append(this.svg);
  }
  set(key, state) {
    if (state) this.states.set(key, state);
    else this.states.delete(key);
  }
  get size() {
    return this.states.size;
  }
  graph(W, H) {
    const prims = [];
    const merges = [{ tag: "feMergeNode", attrs: { in: "SourceGraphic" } }];
    let i = 0;
    for (const s of this.states.values()) {
      const p = s.params;
      const m = p.metrics;
      const sx = s.scaleX;
      const sy = s.scaleY;
      const w = m.width * sx;
      const h = m.height * sy;
      const region = box(s.x, s.y, w, h);
      const k = `g${i}_`;
      prims.push({
        tag: "feFlood",
        attrs: { "flood-color": "#808080", ...region, result: `${k}flood` }
      });
      const tiles = displacementSet(m, p.dpr, p.optics);
      const nodes = [{ tag: "feMergeNode", attrs: { in: `${k}flood` } }];
      for (const sl of sliceLayout(m)) {
        const t = tiles[sl.key];
        if (!t) continue;
        prims.push({
          tag: "feImage",
          attrs: {
            href: t.url,
            preserveAspectRatio: "none",
            ...box(s.x + sl.x * sx, s.y + sl.y * sy, sl.width * sx, sl.height * sy),
            result: `${k}tile_${sl.key}`
          }
        });
        nodes.push({ tag: "feMergeNode", attrs: { in: `${k}tile_${sl.key}` } });
      }
      prims.push({ tag: "feMerge", attrs: { ...region, result: `${k}map` }, children: nodes });
      let src = "SourceGraphic";
      if (p.blur > 0.1) {
        const pad = p.blur * 3;
        prims.push({
          tag: "feGaussianBlur",
          attrs: {
            in: "SourceGraphic",
            stdDeviation: fmt(p.blur),
            edgeMode: "duplicate",
            ...box(s.x - pad, s.y - pad, w + 2 * pad, h + 2 * pad),
            result: `${k}blur`
          }
        });
        src = `${k}blur`;
      }
      prims.push({
        tag: "feDisplacementMap",
        attrs: {
          in: src,
          in2: `${k}map`,
          scale: fmt(2 * p.refraction * Math.max(sx, sy)),
          xChannelSelector: "R",
          yChannelSelector: "G",
          ...region,
          result: `${k}disp`
        }
      });
      prims.push({
        tag: "feComponentTransfer",
        attrs: { in: `${k}disp`, ...region, result: `${k}tone` },
        children: ["R", "G", "B"].map((c) => ({
          tag: `feFunc${c}`,
          attrs: { type: "table", tableValues: p.tone }
        }))
      });
      prims.push({
        tag: "feColorMatrix",
        attrs: {
          in: `${k}tone`,
          type: "saturate",
          values: fmt(p.saturation),
          ...region,
          result: `${k}color`
        }
      });
      prims.push({
        tag: "feImage",
        attrs: {
          href: maskUrl(w, h, m.radius * Math.min(sx, sy)),
          preserveAspectRatio: "none",
          ...region,
          result: `${k}mask`
        }
      });
      prims.push({
        tag: "feComposite",
        attrs: { in: `${k}color`, in2: `${k}mask`, operator: "in", ...region, result: `${k}out` }
      });
      merges.push({ tag: "feMergeNode", attrs: { in: `${k}out` } });
      i++;
    }
    let gap = 0;
    for (const p of prims) {
      const x = parseFloat(p.attrs.x ?? "");
      if (!Number.isFinite(x)) continue;
      const y = parseFloat(p.attrs.y);
      const w = parseFloat(p.attrs.width);
      const h = parseFloat(p.attrs.height);
      gap = Math.max(gap, x, W - x - w, y, H - y - h);
    }
    const reach = String(
      Math.min(Math.floor(Math.min(W, H) / 2) - 1, Math.ceil((gap / 2 + 2) / 16) * 16)
    );
    prims.push({ tag: "feFlood", attrs: { "flood-opacity": "0", result: "reach" } });
    prims.push({
      tag: "feOffset",
      attrs: { in: "reach", dx: reach, dy: reach, result: "reach_a" }
    });
    prims.push({
      tag: "feOffset",
      attrs: { in: "reach", dx: `-${reach}`, dy: `-${reach}`, result: "reach_b" }
    });
    merges.push(
      { tag: "feMergeNode", attrs: { in: "reach_a" } },
      { tag: "feMergeNode", attrs: { in: "reach_b" } }
    );
    prims.push({ tag: "feMerge", attrs: { ...box(0, 0, W, H), result: "out" }, children: merges });
    return prims;
  }
  /** Apply the current states to the filter (in place when possible). */
  commit() {
    const el = this.backdrop;
    const W = el.offsetWidth;
    const H = el.offsetHeight;
    if (!this.states.size || !W || !H) {
      if (this.applied) {
        this.applied = false;
        this.structure = "";
        this.filter.replaceChildren();
        el.style.filter = "";
        this.restoreWillChange();
      }
      return;
    }
    const prims = this.graph(W, H);
    const structure = structureOf(prims);
    for (const [k, v] of Object.entries(box(0, 0, W, H)))
      if (this.filter.getAttribute(k) !== v) this.filter.setAttribute(k, v);
    if (structure !== this.structure) {
      this.structure = structure;
      this.filter.replaceChildren(...prims.map((p) => this.create(p)));
    } else {
      this.patch(this.filter, prims);
    }
    const value = `url(#${this.id})`;
    if (el.style.filter !== value) {
      if (!this.applied && getComputedStyle(el).transform === "none") {
        this.ownTransform = true;
        el.style.transform = "translate(0px, 0px)";
      }
      el.style.filter = value;
    }
    this.applied = true;
  }
  create(p) {
    const e = document.createElementNS(NS, p.tag);
    for (const [k, v] of Object.entries(p.attrs)) e.setAttribute(k, v);
    if (p.children) e.append(...p.children.map((c) => this.create(c)));
    return e;
  }
  patch(parent, prims) {
    const kids = parent.children;
    prims.forEach((p, i) => {
      const e = kids[i];
      if (!e) return;
      for (const [k, v] of Object.entries(p.attrs))
        if (e.getAttribute(k) !== v) e.setAttribute(k, v);
      if (p.children) this.patch(e, p.children);
    });
  }
  restoreWillChange() {
    if (this.ownTransform) this.backdrop.style.removeProperty("transform");
    this.ownTransform = false;
  }
  destroy() {
    if (this.applied) {
      this.backdrop.style.filter = "";
      this.restoreWillChange();
    }
    this.svg.remove();
  }
}
export {
  DomFilterRenderer
};
