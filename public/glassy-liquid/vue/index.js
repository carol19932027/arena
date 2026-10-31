import {
  Comment,
  Fragment,
  Text,
  cloneVNode,
  defineComponent,
  h,
  isVNode,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  shallowRef,
  toValue,
  watch
} from "vue";
import {
  glass
} from "../engine/surface.js";
import {
  DEFER_HYDRATION,
  release,
  SKIP,
  applyAttrs,
  isServer,
  modelEvents,
  assign,
  listen,
  partition,
  propNames,
  registerElements,
  specs
} from "../bindings/specs.js";
registerElements();
function stampSlot(node, name) {
  if (node.type === Comment) return [];
  if (node.type === Fragment) return stampChild(node.children, name);
  if (node.type === Text || typeof node.type === "symbol") {
    const text = typeof node.children === "string" ? node.children : "";
    if (!text.trim()) return [];
    return [h("span", { slot: name }, text)];
  }
  return [cloneVNode(node, { slot: name })];
}
function stampChild(children, name) {
  if (children == null || children === true || children === false) return [];
  if (typeof children === "string" || typeof children === "number") {
    const text = String(children);
    return text.trim() ? [h("span", { slot: name }, text)] : [];
  }
  if (Array.isArray(children)) return children.flatMap((child) => stampChild(child, name));
  if (isVNode(children)) return stampSlot(children, name);
  return [];
}
function renderSlots(slots) {
  const out = [];
  for (const name of Object.keys(slots)) {
    const fn = slots[name];
    if (typeof fn !== "function") continue;
    const rendered = fn();
    if (name === "default") {
      if (Array.isArray(rendered)) out.push(...rendered);
      else if (isVNode(rendered)) out.push(rendered);
      continue;
    }
    out.push(...stampChild(rendered, name));
  }
  return out;
}
function create(name) {
  const spec = specs[name];
  const model = modelEvents(name);
  return defineComponent({
    name,
    props: propNames(name),
    emits: Object.keys(model).map((k) => `update:${k}`),
    setup(props, { slots, emit, expose }) {
      const el = ref(null);
      expose({ el });
      let off;
      let written;
      const sync = () => {
        if (!el.value) return;
        const { attrs, initial, deferred } = partition(spec, props);
        written = applyAttrs(el.value, attrs, written, initial);
        release(el.value);
        assign(el.value, deferred);
      };
      onMounted(() => {
        const node = el.value;
        const unlisten = listen(node, spec, () => props);
        const extra = [];
        for (const [prop, [type, map]] of Object.entries(model)) {
          const fn = (e) => {
            const v = map(e);
            if (v !== SKIP) emit(`update:${prop}`, v);
          };
          node.addEventListener(type, fn);
          extra.push(() => node.removeEventListener(type, fn));
        }
        off = () => (unlisten(), extra.forEach((f) => f()));
        sync();
      });
      onUpdated(sync);
      onBeforeUnmount(() => off?.());
      return () => {
        const { attrs, initial } = partition(spec, props);
        return h(
          spec.tag,
          { ...isServer ? { ...initial, ...attrs, [DEFER_HYDRATION]: "" } : {}, ref: el },
          renderSlots(slots)
        );
      };
    }
  });
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
function useGlass(target, options = {}) {
  const surface = shallowRef(null);
  onMounted(() => {
    if (target.value) surface.value = glass(target.value, toValue(options));
  });
  watch(
    () => JSON.stringify(toValue(options)),
    () => surface.value?.set(toValue(options))
  );
  onBeforeUnmount(() => {
    surface.value?.destroy();
    surface.value = null;
  });
  return surface;
}
const isGlassElement = (tag) => tag.startsWith("glass-");
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
  isGlassElement,
  useGlass
};
