import { SvelteComponent } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import type { GlassSceneProps, GlassSurfaceProps, GlassButtonProps, GlassSwitchProps, GlassSliderProps, GlassSelectorProps, GlassItemProps, GlassMenuProps, GlassMenuItemProps, GlassEmptyProps, GlassGroupProps, GlassSpacerProps, GlassSearchProps, GlassSheetProps, GlassProgressiveBlurProps } from "../bindings/specs.js";

type Base<P> = Omit<HTMLAttributes<HTMLElement>, keyof P | "children"> & { element?: HTMLElement | null };
// Component classes work for Svelte 4 and 5 type checking, including `slot="…"`
// children (menu trigger, icons) and forwarded `on:click`-style events.
type Events = { click: MouseEvent; dblclick: MouseEvent; focus: FocusEvent; blur: FocusEvent; focusin: FocusEvent; focusout: FocusEvent; keydown: KeyboardEvent; keyup: KeyboardEvent; pointerdown: PointerEvent; pointerup: PointerEvent; pointerenter: PointerEvent; pointerleave: PointerEvent; mouseenter: MouseEvent; mouseleave: MouseEvent; input: Event; change: Event };
export declare class GlassScene extends SvelteComponent<GlassSceneProps & Base<GlassSceneProps>, Events, { default: {} }> {}
export declare class GlassSurface extends SvelteComponent<GlassSurfaceProps & Base<GlassSurfaceProps>, Events, { default: {} }> {}
export declare class GlassButton extends SvelteComponent<GlassButtonProps & Base<GlassButtonProps>, Events, { default: {}; icon: {}; trailing: {} }> {}
export declare class GlassSwitch extends SvelteComponent<GlassSwitchProps & Base<GlassSwitchProps>, Events, { default: {} }> {}
export declare class GlassSlider extends SvelteComponent<GlassSliderProps & Base<GlassSliderProps>, Events, { default: {} }> {}
export declare class GlassTabBar extends SvelteComponent<GlassSelectorProps & Base<GlassSelectorProps>, Events, { default: {} }> {}
export declare class GlassSegmented extends SvelteComponent<GlassSelectorProps & Base<GlassSelectorProps>, Events, { default: {} }> {}
export declare class GlassTab extends SvelteComponent<GlassItemProps & Base<GlassItemProps>, Events, { default: {} }> {}
export declare class GlassSegment extends SvelteComponent<GlassItemProps & Base<GlassItemProps>, Events, { default: {} }> {}
export declare class GlassMenu extends SvelteComponent<GlassMenuProps & Base<GlassMenuProps>, Events, { default: {}; trigger: {} }> {}
export declare class GlassMenuItem extends SvelteComponent<GlassMenuItemProps & Base<GlassMenuItemProps>, Events, { default: {}; icon: {}; shortcut: {} }> {}
export declare class GlassMenuSeparator extends SvelteComponent<GlassEmptyProps & Base<GlassEmptyProps>, Events, { default: {} }> {}
export declare class GlassMenuLabel extends SvelteComponent<GlassEmptyProps & Base<GlassEmptyProps>, Events, { default: {} }> {}
export declare class GlassToolbar extends SvelteComponent<GlassEmptyProps & Base<GlassEmptyProps>, Events, { default: {} }> {}
export declare class GlassGroup extends SvelteComponent<GlassGroupProps & Base<GlassGroupProps>, Events, { default: {} }> {}
export declare class GlassSpacer extends SvelteComponent<GlassSpacerProps & Base<GlassSpacerProps>, Events, { default: {} }> {}
export declare class GlassSearch extends SvelteComponent<GlassSearchProps & Base<GlassSearchProps>, Events, { default: {} }> {}
export declare class GlassSheet extends SvelteComponent<GlassSheetProps & Base<GlassSheetProps>, Events, { default: {} }> {}
export declare class GlassProgressiveBlur extends SvelteComponent<GlassProgressiveBlurProps & Base<GlassProgressiveBlurProps>, Events, { default: {} }> {}

export * from "./actions.js";
export type { GlassAttributes, GlassButtonProps, GlassItemProps, GlassMenuItemProps, GlassMenuProps, GlassProgressiveBlurProps, GlassSceneProps, GlassSearchProps, GlassSelectorProps, GlassSheetProps, GlassSliderProps, GlassSurfaceProps, GlassSwitchProps } from "../bindings/specs.js";

/** Lets `<glass-*>` tags with `use:glassProps` type-check (Svelte 4 and 5). */
declare module "svelte/elements" {
  interface SvelteHTMLElements {
    "glass-scene": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-surface": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-button": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-switch": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-slider": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-tab-bar": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-segmented": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-tab": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-segment": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-menu": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-menu-item": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-menu-separator": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-menu-label": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-toolbar": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-group": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-spacer": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-search": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-sheet": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
    "glass-progressive-blur": HTMLAttributes<HTMLElement> & { [attr: string]: unknown };
  }
}
