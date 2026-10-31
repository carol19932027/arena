/**
 * Base class for glass custom elements. Extend it to build your own glass
 * components: you get a shadow root with the glass layer stack, attribute ↔
 * option reflection, the tactile press response and lifecycle handling.
 *
 * ```js
 * class PriceTag extends GlassElement {
 *   static glassDefaults = { radius: "capsule", material: "clear" };
 *   static interactive = true;
 *   render() { return `<span part="label"><slot></slot></span>`; }
 * }
 * customElements.define("price-tag", PriceTag);
 * ```
 */
import type { GlassRadius } from "../core/shape.js";
import { type PressController, type PressOptions } from "../interaction/press.js";
import { GlassSurface, type GlassOptions } from "../engine/surface.js";
/** Shared host styles for every glass element. */
export declare const hostCss = "\n:host{position:relative;z-index:0;box-sizing:border-box;border-radius:var(--glass-r,0);color:var(--glass-foreground,var(--gl-fg));\n  text-shadow:var(--glass-text-shadow,var(--gl-text-shadow,none));\n  font-family:var(--glass-font,-apple-system,BlinkMacSystemFont,\"SF Pro Text\",\"SF Pro Display\",\"Inter\",\"Segoe UI\",system-ui,sans-serif);\n  -webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased;}\n:host([hidden]){display:none!important;}\n:host(:focus-visible){outline:none;}\n:host(:focus-visible)::after{content:\"\";position:absolute;inset:-4px;border-radius:inherit;pointer-events:none;\n  box-shadow:0 0 0 3px var(--glass-focus,color-mix(in srgb,var(--glass-accent,#0a84ff) 70%,transparent));}\n:host([disabled]){opacity:.45;pointer-events:none;}\n*,*::before,*::after{box-sizing:border-box;}\n";
/**
 * Accent colors for elements that set `data-appearance`. `--gl-accent` is the
 * fill color (iOS system blue per appearance unless `--glass-accent` is set);
 * `--gl-accent-text` is the same hue moved to a lightness that stays readable
 * as text on that appearance's glass - darker on light glass, lighter on dark.
 */
export declare const accentCss = "\n:host{--gl-accent:var(--glass-accent,#007aff);--gl-accent-text:var(--gl-accent);}\n:host([data-appearance=dark]){--gl-accent:var(--glass-accent,#0a84ff);}\n@supports (color:oklch(from red l c h)){\n  :host{--gl-accent-text:oklch(from var(--gl-accent) min(l,.5) c h);}\n  :host([data-appearance=dark]){--gl-accent-text:oklch(from var(--gl-accent) max(l,.8) min(c,.15) h);}\n}\n";
export declare function parseRadius(v: string | null | undefined): GlassRadius | undefined;
/**
 * `HTMLElement` in the browser, a plain class on the server. Every element in
 * the package extends this, so importing any entry in Node (SSR, tests) does
 * not throw `HTMLElement is not defined`. Elements are only registered where
 * `customElements` exists (see `define`).
 */
export declare const HTMLElementBase: typeof HTMLElement;
export declare abstract class GlassElement extends HTMLElementBase {
    /** Default glass options for this component. */
    static glassDefaults: GlassOptions;
    /** Attach the tactile press response. */
    static interactive: boolean;
    /** Extra CSS for the shadow root. */
    static styles: string;
    /** Additional observed attributes, handled in `attributeChanged`. */
    static extraAttributes: string[];
    /** Whether the element itself is a glass surface (false for containers that only host glass children). */
    static hasGlass: boolean;
    static get observedAttributes(): string[];
    /** The glass surface behind this element (available after connection). */
    surface: GlassSurface | null;
    protected press: PressController | null;
    protected rendered: boolean;
    private active;
    readonly shadow: ShadowRoot;
    constructor();
    /** Forward focus into the shadow root (for elements wrapping native inputs). */
    static delegatesFocus: boolean;
    /** Return the shadow DOM markup (the glass layer is inserted automatically). */
    protected render(): string;
    /** Called once after the shadow DOM is rendered and the surface exists. */
    protected setup(): void;
    /** Called on disconnect, after the surface is destroyed. */
    protected teardown(): void;
    /** Options from defaults + attributes. Override to add component logic. */
    glassOptions(): GlassOptions;
    protected get interactive(): boolean;
    /** Options for the press response. */
    protected pressOptions(): PressOptions;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, old: string | null, value: string | null): void;
    /** Hook for subclass attributes listed in `static extraAttributes`. */
    protected attributeChanged(_name: string, _old: string | null, _value: string | null): void;
    protected syncPress(): void;
    /** Dispatch a bubbling, composed event. */
    protected emit<T>(type: string, detail?: T, cancelable?: boolean): boolean;
}
/** Define a custom element once (safe for HMR and multiple bundles). */
/**
 * `defer-hydration` (the community protocol also used by Lit): while the
 * attribute is present the element does nothing on connect - no shadow DOM
 * work, no attributes, no inline styles - so server markup can be hydrated by a
 * framework even if the element upgraded first. Removing the attribute runs
 * the normal connect. The framework bindings render it on the server and
 * remove it right after hydration.
 */
export declare const DEFER_HYDRATION = "defer-hydration";
export declare function define(name: string, ctor: CustomElementConstructor): void;
