import { attachPress } from "../interaction/press.js";
import { GlassSurface } from "../engine/surface.js";
import { adoptStyles } from "../engine/styles.js";
const hostCss = (
  /* css */
  `
:host{position:relative;z-index:0;box-sizing:border-box;border-radius:var(--glass-r,0);color:var(--glass-foreground,var(--gl-fg));
  text-shadow:var(--glass-text-shadow,var(--gl-text-shadow,none));
  font-family:var(--glass-font,-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display","Inter","Segoe UI",system-ui,sans-serif);
  -webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased;}
:host([hidden]){display:none!important;}
:host(:focus-visible){outline:none;}
:host(:focus-visible)::after{content:"";position:absolute;inset:-4px;border-radius:inherit;pointer-events:none;
  box-shadow:0 0 0 3px var(--glass-focus,color-mix(in srgb,var(--glass-accent,#0a84ff) 70%,transparent));}
:host([disabled]){opacity:.45;pointer-events:none;}
*,*::before,*::after{box-sizing:border-box;}
`
);
const accentCss = (
  /* css */
  `
:host{--gl-accent:var(--glass-accent,#007aff);--gl-accent-text:var(--gl-accent);}
:host([data-appearance=dark]){--gl-accent:var(--glass-accent,#0a84ff);}
@supports (color:oklch(from red l c h)){
  :host{--gl-accent-text:oklch(from var(--gl-accent) min(l,.5) c h);}
  :host([data-appearance=dark]){--gl-accent-text:oklch(from var(--gl-accent) max(l,.8) min(c,.15) h);}
}
`
);
const glassAttributes = {
  material: ["material", (v) => v],
  appearance: ["appearance", (v) => v],
  radius: ["radius", (v) => parseRadius(v)],
  refraction: ["refraction", (v) => parseFloat(v)],
  bezel: ["bezel", (v) => parseFloat(v)],
  blur: ["blur", (v) => parseFloat(v)],
  dispersion: ["dispersion", (v) => parseFloat(v)],
  tint: ["tint", (v) => v],
  specular: ["specular", (v) => parseFloat(v)],
  "light-angle": ["lightAngle", (v) => parseFloat(v)],
  shadow: [
    "shadow",
    (v) => v === "false" || v === "none" ? false : v === "" || v === "true" ? true : v
  ],
  profile: ["profile", (v) => v],
  engine: ["engine", (v) => v]
};
function parseRadius(v) {
  if (v == null || v === "") return void 0;
  if (v === "capsule" || v === "circle") return v;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : void 0;
}
const HTMLElementBase = typeof HTMLElement === "undefined" ? class {
} : HTMLElement;
class GlassElement extends HTMLElementBase {
  constructor() {
    super();
    /** The glass surface behind this element (available after connection). */
    this.surface = null;
    this.press = null;
    this.rendered = false;
    this.active = false;
    this.shadow = this.attachShadow({
      mode: "open",
      delegatesFocus: this.constructor.delegatesFocus
    });
  }
  static get observedAttributes() {
    return [...Object.keys(glassAttributes), "interactive", ...this.extraAttributes];
  }
  /** Return the shadow DOM markup (the glass layer is inserted automatically). */
  render() {
    return `<slot></slot>`;
  }
  /** Called once after the shadow DOM is rendered and the surface exists. */
  setup() {
  }
  /** Called on disconnect, after the surface is destroyed. */
  teardown() {
  }
  /** Options from defaults + attributes. Override to add component logic. */
  glassOptions() {
    const ctor = this.constructor;
    const opts = { ...ctor.glassDefaults };
    for (const [attr, [key, parse]] of Object.entries(glassAttributes)) {
      const v = this.getAttribute(attr);
      if (v !== null) opts[key] = parse(v);
    }
    return opts;
  }
  get interactive() {
    const attr = this.getAttribute("interactive");
    if (attr !== null) return attr !== "false";
    return this.constructor.interactive;
  }
  /** Options for the press response. */
  pressOptions() {
    return {};
  }
  connectedCallback() {
    if (!this.rendered) {
      const ctor = this.constructor;
      adoptStyles(this.shadow, hostCss, ctor.styles);
      this.shadow.innerHTML = this.render();
      this.rendered = true;
    }
    if (!this.active) {
      if (this.constructor.hasGlass) {
        this.surface = new GlassSurface(this, this.glassOptions(), {
          root: this.shadow,
          before: this.shadow.firstChild
        });
      }
      this.active = true;
      this.setup();
    }
    this.syncPress();
  }
  disconnectedCallback() {
    queueMicrotask(() => {
      if (this.isConnected) {
        this.surface?.reattach();
        return;
      }
      this.press?.dispose();
      this.press = null;
      this.surface?.destroy();
      this.surface = null;
      this.active = false;
      this.teardown();
    });
  }
  attributeChangedCallback(name, old, value) {
    if (old === value) return;
    if (name in glassAttributes) {
      this.surface?.set(this.glassOptions());
      return;
    }
    if (name === "interactive") {
      this.syncPress();
      return;
    }
    this.attributeChanged(name, old, value);
  }
  /** Hook for subclass attributes listed in `static extraAttributes`. */
  attributeChanged(_name, _old, _value) {
  }
  syncPress() {
    if (!this.isConnected) return;
    if (this.interactive && !this.press)
      this.press = attachPress(this, this.surface, this.pressOptions());
    else if (!this.interactive && this.press) {
      this.press.dispose();
      this.press = null;
    }
  }
  /** Dispatch a bubbling, composed event. */
  emit(type, detail, cancelable = false) {
    return this.dispatchEvent(
      new CustomEvent(type, { detail, bubbles: true, composed: true, cancelable })
    );
  }
}
/** Default glass options for this component. */
GlassElement.glassDefaults = {};
/** Attach the tactile press response. */
GlassElement.interactive = false;
/** Extra CSS for the shadow root. */
GlassElement.styles = "";
/** Additional observed attributes, handled in `attributeChanged`. */
GlassElement.extraAttributes = [];
/** Whether the element itself is a glass surface (false for containers that only host glass children). */
GlassElement.hasGlass = true;
/** Forward focus into the shadow root (for elements wrapping native inputs). */
GlassElement.delegatesFocus = false;
const DEFER_HYDRATION = "defer-hydration";
function deferrable(ctor) {
  const proto = ctor.prototype;
  if (Object.prototype.hasOwnProperty.call(proto, "__glassDeferrable")) return;
  const {
    connectedCallback: connected,
    disconnectedCallback: disconnected,
    attributeChangedCallback: changed
  } = proto;
  const observed = (ctor.observedAttributes ?? []).slice();
  Object.defineProperty(ctor, "observedAttributes", {
    configurable: true,
    get: () => [...observed, DEFER_HYDRATION]
  });
  Object.defineProperty(proto, "__glassDeferrable", { value: true });
  proto.connectedCallback = function() {
    if (!this.hasAttribute(DEFER_HYDRATION)) connected?.call(this);
  };
  proto.disconnectedCallback = function() {
    if (!this.hasAttribute(DEFER_HYDRATION)) disconnected?.call(this);
  };
  proto.attributeChangedCallback = function(name, old, value) {
    if (name === DEFER_HYDRATION) {
      if (value === null && old !== null) {
        for (const attr of observed) {
          const current = this.getAttribute(attr);
          if (current !== null) changed?.call(this, attr, null, current);
        }
        if (this.isConnected) connected?.call(this);
      }
      return;
    }
    if (!this.hasAttribute(DEFER_HYDRATION)) changed?.call(this, name, old, value);
  };
}
function define(name, ctor) {
  if (typeof customElements === "undefined" || customElements.get(name)) return;
  deferrable(ctor);
  customElements.define(name, ctor);
}
export {
  DEFER_HYDRATION,
  GlassElement,
  HTMLElementBase,
  accentCss,
  define,
  hostCss,
  parseRadius
};
