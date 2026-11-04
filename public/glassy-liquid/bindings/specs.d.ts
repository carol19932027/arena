/**
 * Framework-neutral binding table shared by the React, Vue and Svelte
 * bindings. One entry per wrapped custom element: which props become
 * attributes, which are assigned as element properties, which are uncontrolled
 * defaults, and which callback props map to which DOM event. Keeping this in
 * one place is what keeps the three framework ports 1:1.
 */
import type { GlassRadius } from "../core/shape.js";
import type { GlassAppearance, GlassMaterial } from "../engine/materials.js";
import type { BezelProfile } from "../core/optics.js";
import type { EngineKind } from "../core/env.js";
/** Glass options available on every glass element. */
export interface GlassAttributes {
    /**
     * Frosted and adaptive, or transparent for media.
     * @defaultValue `regular`
     */
    material?: GlassMaterial;
    /**
     * `auto` reads `--glass-appearance`, then the page `color-scheme`.
     * @defaultValue `auto`
     */
    appearance?: GlassAppearance | "auto";
    /**
     * Corner radius in CSS pixels.
     * @defaultValue per component
     */
    radius?: GlassRadius;
    /**
     * Maximum rim displacement in CSS pixels.
     * @defaultValue scales with size
     */
    refraction?: number;
    /**
     * Width of the refracting rim in CSS pixels.
     * @defaultValue `18`
     */
    bezel?: number;
    /**
     * Frost before refraction, in CSS pixels.
     * @defaultValue material
     */
    blur?: number;
    /**
     * Chromatic split at the rim.
     * @defaultValue `0.25` in WebGL, else `0`
     */
    dispersion?: number;
    /** Color of tinted glass. */
    tint?: string;
    /**
     * Rim light strength.
     * @defaultValue `1`
     */
    specular?: number;
    /**
     * Light direction. `-90` is the top.
     * @defaultValue `-135`
     */
    lightAngle?: number;
    /**
     * `true` uses the material shadow. A string is used as the shadow.
     * @defaultValue `true`
     */
    shadow?: boolean | string;
    /**
     * Cross-section of the rim.
     * @defaultValue `squircle`
     */
    profile?: BezelProfile;
    /**
     * Force a renderer. Mainly for tests.
     * @defaultValue `auto`
     */
    engine?: "auto" | EngineKind;
    /**
     * Press response: swell, light, and gel stretch.
     * @defaultValue per component
     */
    interactive?: boolean;
}
export declare const glassAttrs: Array<keyof GlassAttributes & string>;
export interface GlassSceneProps {
    /** Image URL. The scene creates a cover image in its shadow root. */
    src?: string;
    /**
     * When omitted, the direct child `[glass-backdrop]` or `[data-glass-backdrop]`. A set value is a CSS selector, queried on the scene and then on `document`.
     * @defaultValue direct child
     */
    backdrop?: string;
    /**
     * Use scene rendering even in Chromium.
     * @defaultValue `false`
     */
    force?: boolean;
    /**
     * Force WebGL (`gl`) or the DOM content filter (`dom`).
     * @defaultValue auto
     */
    mode?: "gl" | "dom";
}
export type GlassSurfaceProps = GlassAttributes;
export interface GlassButtonProps extends GlassAttributes {
    /**
     * Visual style.
     * @defaultValue `glass`
     */
    variant?: "glass" | "prominent" | "plain";
    /**
     * 32, 44, or 52 CSS pixels tall.
     * @defaultValue `medium`
     */
    size?: "small" | "medium" | "large";
    /**
     * `rounded` uses a 12px radius unless `radius` is set.
     * @defaultValue `capsule`
     */
    shape?: "capsule" | "circle" | "rounded";
    /**
     * Disables interaction and sets `aria-disabled`.
     * @defaultValue `false`
     */
    disabled?: boolean;
    /**
     * Form action when the button has no `href`.
     * @defaultValue `button`
     */
    type?: "button" | "submit" | "reset";
    /** Renders as a link (`role="link"`) and navigates on click. */
    href?: string;
    /** Link target. Anything other than `_self` opens with `noopener`. */
    target?: string;
}
export interface GlassSwitchProps {
    /**
     * Controlled on state. Set the property, or the `checked` attribute for the initial value.
     * @defaultValue `false`
     */
    checked?: boolean;
    /**
     * Uncontrolled initial `checked` attribute. Later updates are ignored.
     * @defaultValue `false`
     */
    defaultChecked?: boolean;
    /**
     * Disables the control.
     * @defaultValue `false`
     */
    disabled?: boolean;
    /** Form field name. */
    name?: string;
    /**
     * Value submitted when the switch is on.
     * @defaultValue `on`
     */
    value?: string;
    /** Fires when the user toggles the switch. */
    onCheckedChange?: (checked: boolean) => void;
    /** The same DOM `change` event, passed through unchanged. */
    onChange?: (event: Event) => void;
}
export interface GlassSliderProps {
    /**
     * Controlled value. When omitted, the value is `min`.
     * @defaultValue `min`
     */
    value?: number;
    /**
     * Uncontrolled initial value. When the attribute is omitted, the value is `min`.
     * @defaultValue `min`
     */
    defaultValue?: number;
    /**
     * Range start.
     * @defaultValue `0`
     */
    min?: number;
    /**
     * Range end.
     * @defaultValue `100`
     */
    max?: number;
    /**
     * Snap increment. `0` keeps the value continuous.
     * @defaultValue `0` (continuous)
     */
    step?: number;
    /**
     * Draw tick marks at each step.
     * @defaultValue `false`
     */
    ticks?: boolean;
    /**
     * Disables the control.
     * @defaultValue `false`
     */
    disabled?: boolean;
    /** Form field name. */
    name?: string;
    /** Fires while the value is changing. */
    onValueChange?: (value: number) => void;
    /** Fires when the user commits (pointer up or keyboard). */
    onValueCommit?: (value: number) => void;
}
export interface GlassSelectorProps extends GlassAttributes {
    /**
     * Selected item value. When omitted, the first enabled item is selected.
     * @defaultValue first enabled item
     */
    value?: string;
    /** Fires when the selection changes. Detail is `{ value, index }`. */
    onValueChange?: (value: string) => void;
}
export interface GlassItemProps {
    /**
     * Item value. Defaults to the child index when omitted.
     * @defaultValue index
     */
    value?: string;
    /**
     * Skips the item for pointer and keyboard selection.
     * @defaultValue `false`
     */
    disabled?: boolean;
}
export interface GlassMenuProps {
    /**
     * Open state. The attribute presence opens the menu.
     * @defaultValue `false`
     */
    open?: boolean;
    /**
     * Where the panel sits relative to the trigger.
     * @defaultValue `bottom-start`
     */
    placement?: "bottom-start" | "bottom-end" | "bottom" | "top-start" | "top-end" | "top";
    /** Fires when an item is chosen. Detail is `{ value, item }`. Cancelable. */
    onSelect?: (value: string) => void;
    /** Fires when the menu opens or closes. Detail is `{ open }`. */
    onOpenChange?: (open: boolean) => void;
}
export interface GlassMenuItemProps {
    /**
     * Value reported by `select`. Falls back to the trimmed text.
     * @defaultValue text content
     */
    value?: string;
    /**
     * Dims the row and skips it.
     * @defaultValue `false`
     */
    disabled?: boolean;
    /**
     * Uses the destructive color.
     * @defaultValue `false`
     */
    destructive?: boolean;
    /**
     * Shows a check mark.
     * @defaultValue `false`
     */
    checked?: boolean;
    /**
     * Reserves space for a check even when unchecked.
     * @defaultValue `false`
     */
    checkable?: boolean;
    /** Items that share a group behave as a single-select set. */
    group?: string;
}
export type GlassEmptyProps = object;
export type GlassGroupProps = GlassAttributes;
export interface GlassSpacerProps {
    /**
     * Fixed width in CSS pixels. Omit it and the spacer grows.
     * @defaultValue flex
     */
    size?: number;
}
export interface GlassSearchProps extends GlassAttributes {
    /**
     * Controlled field value.
     * @defaultValue `""`
     */
    value?: string;
    /**
     * Placeholder and the default accessible name.
     * @defaultValue `Search`
     */
    placeholder?: string;
    /** Form field name. */
    name?: string;
    /**
     * Disables the input.
     * @defaultValue `false`
     */
    disabled?: boolean;
    /** Fires on each edit, including clear. */
    onValueChange?: (value: string) => void;
    /** Fires when the user presses Enter. Detail is `{ value }`. */
    onSearch?: (value: string) => void;
}
/**
 * What `<glass-sheet>` actually applies to its slab. The other glass
 * attributes (radius, refraction, …) are accepted by real glass elements and
 * do nothing on a sheet, so they are not part of this type.
 */
export interface GlassSheetProps {
    /**
     * Frosted and adaptive, or transparent for media.
     * @defaultValue `regular`
     */
    material?: GlassMaterial;
    /**
     * Frost before refraction, in CSS pixels.
     * @defaultValue material
     */
    blur?: number;
    /** Color of tinted glass. */
    tint?: string;
    /**
     * Open state.
     * @defaultValue `false`
     */
    open?: boolean;
    /**
     * Space or comma separated `small`, `medium`, `large`, percentages, or pixel lengths.
     * @defaultValue `medium large`
     */
    detents?: string;
    /**
     * Dim the page, block pointer input outside the sheet, and keep keyboard focus inside it. The dialog gets `aria-modal`.
     * @defaultValue `false`
     */
    modal?: boolean;
    /**
     * Keep the sheet open on scrim click, Escape, and a swipe past the last detent.
     * @defaultValue `false`
     */
    noDismiss?: boolean;
    /** Fires when the sheet opens or closes. Detail is `{ open }`. */
    onOpenChange?: (open: boolean) => void;
    /** Fires when the resting detent changes. Detail is `{ index, height }`. */
    onDetentChange?: (index: number) => void;
}
export interface GlassProgressiveBlurProps {
    /**
     * Edge the blur grows toward.
     * @defaultValue `top`
     */
    edge?: "top" | "bottom" | "left" | "right";
    /**
     * Thickness of the effect in CSS pixels.
     * @defaultValue `96`
     */
    size?: number;
    /**
     * Maximum blur in CSS pixels.
     * @defaultValue `16`
     */
    blur?: number;
    /**
     * How many stacked blur bands to paint.
     * @defaultValue `6`
     */
    layers?: number;
    /** Optional gradient tint over the blur. */
    tint?: string;
}
export type EventMap = (e: Event) => unknown;
export interface Spec<P = Record<string, unknown>> {
    tag: string;
    /** Props written as attributes (camelCase → kebab-case). Glass attributes come from `glass`. */
    attrs: Array<keyof P & string>;
    /** Props assigned as element properties after mount (controlled values). */
    props: Array<keyof P & string>;
    /** Callback props → [DOM event, mapper turning the event into the callback argument]. */
    events: Partial<Record<keyof P & string, [string, EventMap]>>;
    /** Uncontrolled initial values: prop name → attribute name. */
    defaults: Partial<Record<keyof P & string, string>>;
    /**
     * Glass attributes this component applies. Omitted means every glass
     * attribute. A sheet only applies material, blur, and tint.
     */
    glass?: readonly string[];
}
/** Returned by a mapper to drop an event (e.g. the native popover `toggle`, which shares the name). */
export declare const SKIP: unique symbol;
/** Glass attributes `partition` and `propNames` forward for this component. */
export declare function appliedGlass(s: Spec): readonly string[];
/** The binding table. Keys are the exported component names in every framework. */
export declare const specs: {
    readonly GlassScene: Spec<GlassSceneProps>;
    readonly GlassSurface: Spec<GlassAttributes>;
    readonly GlassButton: Spec<GlassButtonProps>;
    readonly GlassSwitch: Spec<GlassSwitchProps>;
    readonly GlassSlider: Spec<GlassSliderProps>;
    readonly GlassTabBar: Spec<GlassSelectorProps>;
    readonly GlassSegmented: Spec<GlassSelectorProps>;
    readonly GlassTab: Spec<GlassItemProps>;
    readonly GlassSegment: Spec<GlassItemProps>;
    readonly GlassMenu: Spec<GlassMenuProps>;
    readonly GlassMenuItem: Spec<GlassMenuItemProps>;
    readonly GlassMenuSeparator: Spec<object>;
    readonly GlassMenuLabel: Spec<object>;
    readonly GlassToolbar: Spec<object>;
    readonly GlassGroup: Spec<GlassAttributes>;
    readonly GlassSpacer: Spec<GlassSpacerProps>;
    readonly GlassSearch: Spec<GlassSearchProps>;
    readonly GlassSheet: Spec<GlassSheetProps>;
    readonly GlassProgressiveBlur: Spec<GlassProgressiveBlurProps>;
};
export type ComponentName = keyof typeof specs;
export declare const componentNames: ComponentName[];
/** Every prop name a component accepts (attributes, properties, defaults, callbacks, glass attributes). */
export declare function propNames(name: ComponentName): string[];
export declare const kebab: (s: string) => string;
/**
 * Split framework props into attribute / property / handler buckets - the
 * exact rules the React bindings have always used.
 */
export declare function partition(s: Spec, input: Record<string, unknown>): {
    attrs: Record<string, string>;
    initial: Record<string, string>;
    deferred: Record<string, unknown>;
    handlers: Record<string, unknown>;
    rest: Record<string, unknown>;
};
/** Attach one listener per mapped event; callbacks are read live through `get`. */
export declare function listen(el: HTMLElement, s: Spec, get: () => Record<string, unknown>): () => void;
/**
 * Assign controlled values as element properties. Before the element is
 * defined/upgraded, assigning would create an own property that shadows the
 * class accessor forever, so the value is queued until the upgrade instead.
 */
export declare function assign(el: HTMLElement, deferred: Record<string, unknown>): void;
/**
 * Write the attribute bucket with setAttribute/removeAttribute. Frameworks
 * (React 19, Vue, Svelte) assign to a custom element's *property* when one with
 * that name exists, which turns `open=""` into `el.open = ""` (closed). Going
 * through attributes keeps the exact HTML semantics on every framework.
 * Returns the set of attribute names now owned by the binding.
 */
export type Written = Map<string, string>;
export declare function applyAttrs(el: HTMLElement, attrs: Record<string, string>, previous: Written | undefined, initial?: Record<string, string>): Written;
export declare const isServer: boolean;
/** See `defer-hydration` in components/base.ts: rendered on the server, removed after hydration. */
export declare const DEFER_HYDRATION = "defer-hydration";
/** Let a server-rendered element start (no-op for client-rendered ones). */
export declare function release(el: HTMLElement): void;
/**
 * Two-way binding support (Vue `v-model:x`, Svelte `bind:x`): controlled prop →
 * the [DOM event, mapper] that reports its new value. Derived from the
 * callback props, so it never diverges from React's `on…Change` callbacks.
 */
export declare function modelEvents(name: ComponentName): Record<string, [string, EventMap]>;
/** Look up a binding spec by custom-element tag name. */
export declare function specForTag(tag: string): [ComponentName, Spec] | undefined;
/** Register the custom elements on the client only (no-op on the server). */
export declare function registerElements(): void;
