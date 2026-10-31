"use client";
import * as React from "react";
import {
  glass
} from "../engine/surface.js";
import {
  DEFER_HYDRATION,
  release,
  applyAttrs,
  assign,
  isServer,
  listen,
  partition,
  registerElements,
  specs
} from "../bindings/specs.js";
registerElements();
const useIsomorphicLayoutEffect = isServer ? React.useEffect : React.useLayoutEffect;
const subscribeNever = () => () => {
};
const notHydrating = () => false;
const isHydrating = () => true;
function create(name) {
  const spec = specs[name];
  const Component = React.forwardRef(
    function GlassComponent(input, forwarded) {
      const inner = React.useRef(null);
      const props = input;
      const { attrs, initial, deferred, handlers, rest } = partition(spec, props);
      const hydrating = React.useSyncExternalStore(subscribeNever, notHydrating, isHydrating);
      const [markup] = React.useState(
        () => isServer || hydrating ? { ...initial, ...attrs, [DEFER_HYDRATION]: "" } : null
      );
      const out = { ...markup };
      for (const [k, v] of Object.entries(rest)) out[k === "className" ? "class" : k] = v;
      const live = React.useRef(handlers);
      live.current = handlers;
      React.useEffect(() => {
        const el = inner.current;
        if (!el) return;
        return listen(el, spec, () => live.current);
      }, []);
      const written = React.useRef(void 0);
      useIsomorphicLayoutEffect(() => {
        const el = inner.current;
        if (!el) return;
        written.current = applyAttrs(
          el,
          attrs,
          written.current ?? (markup ? new Map(Object.entries(attrs)) : void 0),
          initial
        );
        release(el);
        assign(el, deferred);
      });
      const setRef = React.useCallback(
        (el) => {
          inner.current = el;
          if (typeof forwarded === "function") forwarded(el);
          else if (forwarded) forwarded.current = el;
        },
        [forwarded]
      );
      out.ref = setRef;
      return React.createElement(spec.tag, out, props.children);
    }
  );
  Component.displayName = name;
  return Component;
}
const GlassScene = create("GlassScene");
const GlassSurface = create("GlassSurface");
const GlassButton = create("GlassButton");
const GlassSwitch = create("GlassSwitch");
const GlassSlider = create("GlassSlider");
const GlassTabBar = create("GlassTabBar");
const GlassSegmented = create("GlassSegmented");
const GlassTab = create("GlassTab");
const GlassSegment = create("GlassSegment");
const GlassMenu = create("GlassMenu");
const GlassMenuItem = create("GlassMenuItem");
const GlassMenuSeparator = create("GlassMenuSeparator");
const GlassMenuLabel = create("GlassMenuLabel");
const GlassToolbar = create("GlassToolbar");
const GlassGroup = create("GlassGroup");
const GlassSpacer = create("GlassSpacer");
const GlassSearch = create("GlassSearch");
const GlassSheet = create("GlassSheet");
const GlassProgressiveBlur = create("GlassProgressiveBlur");
function useGlass(ref, options = {}) {
  const surface = React.useRef(null);
  const key = JSON.stringify(options);
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    surface.current = glass(el, options);
    return () => {
      surface.current?.destroy();
      surface.current = null;
    };
  }, [ref]);
  useIsomorphicLayoutEffect(() => {
    surface.current?.set(options);
  }, [key]);
  return surface;
}
export {
  GlassButton,
  GlassGroup,
  GlassMenu,
  GlassMenuItem,
  GlassMenuLabel,
  GlassMenuSeparator,
  GlassProgressiveBlur,
  GlassScene,
  GlassSearch,
  GlassSegment,
  GlassSegmented,
  GlassSheet,
  GlassSlider,
  GlassSpacer,
  GlassSurface,
  GlassSwitch,
  GlassTab,
  GlassTabBar,
  GlassToolbar,
  useGlass
};
