import { glass } from "../engine/surface.js";
import {
  DEFER_HYDRATION,
  release,
  applyAttrs,
  assign,
  isServer,
  listen,
  modelEvents,
  partition,
  propNames,
  registerElements,
  specForTag,
  specs
} from "../bindings/specs.js";
registerElements();
function glassProps(node, props = {}) {
  const found = specForTag(node.tagName);
  if (!found) throw new Error(`glassProps: <${node.tagName.toLowerCase()}> is not a glass element`);
  const [, spec] = found;
  let current = props;
  let written;
  const apply = () => {
    const { attrs, initial, deferred } = partition(spec, current);
    written = applyAttrs(node, attrs, written, initial);
    release(node);
    assign(node, deferred);
  };
  apply();
  const off = listen(node, spec, () => partition(spec, current).handlers);
  return {
    update(next) {
      current = next;
      apply();
    },
    destroy: off
  };
}
function useGlass(node, options = {}) {
  const surface = glass(node, options);
  let key = JSON.stringify(options);
  return {
    update(next = {}) {
      const k = JSON.stringify(next);
      if (k !== key) {
        key = k;
        surface.set(next);
      }
    },
    destroy: () => surface.destroy()
  };
}
function svelteProps(name, rest, bound, set) {
  const known = new Set(propNames(name));
  const own = {};
  const html = {};
  for (const [k, v] of Object.entries(rest)) (known.has(k) ? own : html)[k] = v;
  Object.assign(own, bound);
  for (const prop of Object.keys(modelEvents(name))) {
    const key = `on${prop[0].toUpperCase()}${prop.slice(1)}Change`;
    const user = rest[key];
    own[key] = (v) => {
      set(prop, v);
      if (typeof user === "function") user(v);
    };
  }
  let ssr = {};
  if (isServer) {
    const { attrs, initial } = partition(specs[name], own);
    ssr = { ...initial, ...attrs, [DEFER_HYDRATION]: "" };
  }
  return { own, html, ssr };
}
import { componentNames, specs as specs2, propNames as propNames2 } from "../bindings/specs.js";
export {
  componentNames,
  glassProps,
  propNames2 as propNames,
  specs2 as specs,
  svelteProps,
  useGlass
};
