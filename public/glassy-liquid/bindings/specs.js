const glassAttrs = [
  "material",
  "appearance",
  "radius",
  "refraction",
  "bezel",
  "blur",
  "dispersion",
  "tint",
  "specular",
  "lightAngle",
  "shadow",
  "profile",
  "engine",
  "interactive"
];
const SKIP = /* @__PURE__ */ Symbol("glassy-liquid.skip");
const detail = (key) => (e) => {
  const d = e.detail;
  return d && typeof d === "object" && key in d ? d[key] : SKIP;
};
const target = (key) => (e) => e.target[key];
const same = (e) => e;
function spec(tag, s = {}) {
  return {
    tag,
    attrs: s.attrs ?? [],
    props: s.props ?? [],
    events: s.events ?? {},
    defaults: s.defaults ?? {},
    glass: s.glass
  };
}
function appliedGlass(s) {
  return s.glass ?? glassAttrs;
}
const selector = (tag) => spec(tag, {
  attrs: ["value"],
  events: { onValueChange: ["change", detail("value")] }
});
const item = (tag) => spec(tag, { attrs: ["value", "disabled"] });
const specs = {
  GlassScene: spec("glass-scene", { attrs: ["src", "backdrop", "force", "mode"] }),
  GlassSurface: spec("glass-surface"),
  GlassButton: spec("glass-button", {
    attrs: ["variant", "size", "shape", "disabled", "type", "href", "target"]
  }),
  GlassSwitch: spec("glass-switch", {
    attrs: ["disabled", "name", "value"],
    props: ["checked"],
    defaults: { defaultChecked: "checked" },
    events: { onCheckedChange: ["change", target("checked")], onChange: ["change", same] }
  }),
  GlassSlider: spec("glass-slider", {
    attrs: ["min", "max", "step", "ticks", "disabled", "name"],
    props: ["value"],
    defaults: { defaultValue: "value" },
    events: {
      onValueChange: ["input", target("value")],
      onValueCommit: ["change", target("value")]
    }
  }),
  GlassTabBar: selector("glass-tab-bar"),
  GlassSegmented: selector("glass-segmented"),
  GlassTab: item("glass-tab"),
  GlassSegment: item("glass-segment"),
  GlassMenu: spec("glass-menu", {
    attrs: ["open", "placement"],
    events: {
      onSelect: ["select", detail("value")],
      onOpenChange: ["toggle", detail("open")]
    }
  }),
  GlassMenuItem: spec("glass-menu-item", {
    attrs: ["value", "disabled", "destructive", "checked", "checkable", "group"]
  }),
  GlassMenuSeparator: spec("glass-menu-separator"),
  GlassMenuLabel: spec("glass-menu-label"),
  GlassToolbar: spec("glass-toolbar"),
  GlassGroup: spec("glass-group"),
  GlassSpacer: spec("glass-spacer", { attrs: ["size"] }),
  GlassSearch: spec("glass-search", {
    attrs: ["placeholder", "name", "disabled"],
    props: ["value"],
    events: {
      onValueChange: ["input", target("value")],
      onSearch: ["search", detail("value")]
    }
  }),
  GlassSheet: spec("glass-sheet", {
    attrs: ["open", "detents", "modal", "noDismiss"],
    glass: ["material", "blur", "tint"],
    events: {
      onOpenChange: ["toggle", detail("open")],
      onDetentChange: ["detent", detail("index")]
    }
  }),
  GlassProgressiveBlur: spec("glass-progressive-blur", {
    attrs: ["edge", "size", "blur", "layers", "tint"]
  })
};
const componentNames = Object.keys(specs);
function propNames(name) {
  const s = specs[name];
  return [
    .../* @__PURE__ */ new Set([
      ...appliedGlass(s),
      ...s.attrs,
      ...s.props,
      ...Object.keys(s.defaults),
      ...Object.keys(s.events)
    ])
  ].sort();
}
const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
function partition(s, input) {
  const attrSet = /* @__PURE__ */ new Set([...appliedGlass(s), ...s.attrs]);
  const propSet = new Set(s.props);
  const events = s.events;
  const defaults = s.defaults;
  const attrs = {};
  const initial = {};
  const deferred = {};
  const handlers = {};
  const rest = {};
  for (const key of Object.keys(input)) {
    const v = input[key];
    if (key === "children") continue;
    if (key in events) handlers[key] = v;
    else if (key in defaults) {
      if (v !== void 0 && v !== null && v !== false)
        initial[defaults[key]] = v === true ? "" : String(v);
    } else if (propSet.has(key)) deferred[key] = v;
    else if (attrSet.has(key)) {
      if (v === void 0 || v === null || v === false) continue;
      attrs[kebab(key)] = v === true ? "" : String(v);
    } else rest[key] = v;
  }
  return { attrs, initial, deferred, handlers, rest };
}
function listen(el, s, get) {
  const off = [];
  for (const [prop, pair] of Object.entries(s.events)) {
    const [type, map] = pair;
    const fn = (e) => {
      const cb = get()[prop];
      if (typeof cb !== "function") return;
      const value = map(e);
      if (value !== SKIP) cb(value);
    };
    el.addEventListener(type, fn);
    off.push(() => el.removeEventListener(type, fn));
  }
  return () => off.forEach((f) => f());
}
const pending = /* @__PURE__ */ new WeakMap();
function assign(el, deferred) {
  const tag = el.localName;
  const registry = typeof customElements !== "undefined" ? customElements : void 0;
  const ctor = registry?.get(tag);
  if (registry && (!ctor || !(el instanceof ctor))) {
    const queued = pending.get(el);
    pending.set(el, { ...queued, ...deferred });
    if (!queued) {
      void registry.whenDefined(tag).then(() => {
        const latest = pending.get(el);
        pending.delete(el);
        registry.upgrade(el);
        if (latest) assign(el, latest);
      });
    }
    return;
  }
  const rec = el;
  for (const [k, v] of Object.entries(deferred)) if (v !== void 0 && rec[k] !== v) rec[k] = v;
}
function applyAttrs(el, attrs, previous, initial = {}) {
  if (!previous) {
    for (const [k, v] of Object.entries({ ...initial, ...attrs }))
      if (el.getAttribute(k) !== v) el.setAttribute(k, v);
    return new Map(Object.entries(attrs));
  }
  for (const [name] of previous) if (!(name in attrs)) el.removeAttribute(name);
  for (const [k, v] of Object.entries(attrs)) if (previous.get(k) !== v) el.setAttribute(k, v);
  return new Map(Object.entries(attrs));
}
const isServer = typeof window === "undefined";
const DEFER_HYDRATION = "defer-hydration";
function release(el) {
  if (el.hasAttribute(DEFER_HYDRATION)) el.removeAttribute(DEFER_HYDRATION);
}
function modelEvents(name) {
  const ev = specs[name].events;
  const m = {};
  if (ev.onCheckedChange) m.checked = ev.onCheckedChange;
  if (ev.onValueChange) m.value = ev.onValueChange;
  if (ev.onOpenChange) m.open = ev.onOpenChange;
  return m;
}
function specForTag(tag) {
  const t = tag.toLowerCase();
  for (const name of componentNames)
    if (specs[name].tag === t) return [name, specs[name]];
  return void 0;
}
function registerElements() {
  if (typeof window !== "undefined" && typeof customElements !== "undefined")
    void import("../elements.js").catch(() => {
    });
}
export {
  DEFER_HYDRATION,
  SKIP,
  appliedGlass,
  applyAttrs,
  assign,
  componentNames,
  glassAttrs,
  isServer,
  kebab,
  listen,
  modelEvents,
  partition,
  propNames,
  registerElements,
  release,
  specForTag,
  specs
};
