/**
 * Vue 3 bindings for glassy-liquid - 1:1 with `glassy-liquid/react`: the same
 * components, prop names, callback props and behavior, driven by the shared
 * binding table in `bindings/specs.ts`.
 *
 * ```vue
 * <script setup lang="ts">
 * import { ref } from "vue";
 * import { GlassButton, GlassSwitch } from "glassy-liquid/vue";
 * const on = ref(false);
 * </script>
 * <template>
 *   <GlassSwitch v-model:checked="on" />
 *   <GlassButton variant="prominent" @click="save">Done</GlassButton>
 * </template>
 * ```
 *
 * Callback props work as listeners too: `onValueChange` ⇔ `@value-change`.
 * Vue-only addition: controlled values also emit `update:<prop>` so
 * `v-model:checked` / `v-model:value` / `v-model:open` work.
 */
import { type DefineSetupFnComponent, type MaybeRefOrGetter, type Ref, type ShallowRef } from "vue";
import { type GlassOptions, type GlassSurface as SurfaceController } from "../engine/surface.js";
import type { GlassButtonProps, GlassItemProps, GlassMenuItemProps, GlassMenuProps, GlassProgressiveBlurProps, GlassSceneProps, GlassSearchProps, GlassSelectorProps, GlassSheetProps, GlassSliderProps, GlassSpacerProps, GlassSwitchProps } from "../bindings/specs.js";
export type { GlassAttributes, GlassButtonProps, GlassItemProps, GlassMenuItemProps, GlassMenuProps, GlassProgressiveBlurProps, GlassSceneProps, GlassSearchProps, GlassSelectorProps, GlassSheetProps, GlassSliderProps, GlassSurfaceProps, GlassSwitchProps, } from "../bindings/specs.js";
type Emits<P> = {
    [K in keyof P as K extends "checked" | "value" | "open" ? `update:${K & string}` : never]-?: (value: NonNullable<P[K]>) => void;
};
export type GlassVueComponent<P extends Record<string, any>> = DefineSetupFnComponent<P, Emits<P>>;
export declare const GlassScene: GlassVueComponent<GlassSceneProps>;
export declare const GlassSurface: GlassVueComponent<import("./index.js").GlassAttributes>;
export declare const GlassButton: GlassVueComponent<GlassButtonProps>;
export declare const GlassSwitch: GlassVueComponent<GlassSwitchProps>;
export declare const GlassSlider: GlassVueComponent<GlassSliderProps>;
export declare const GlassTabBar: GlassVueComponent<GlassSelectorProps>;
export declare const GlassSegmented: GlassVueComponent<GlassSelectorProps>;
export declare const GlassTab: GlassVueComponent<GlassItemProps>;
export declare const GlassSegment: GlassVueComponent<GlassItemProps>;
export declare const GlassMenu: GlassVueComponent<GlassMenuProps>;
export declare const GlassMenuItem: GlassVueComponent<GlassMenuItemProps>;
export declare const GlassMenuSeparator: GlassVueComponent<object>;
export declare const GlassMenuLabel: GlassVueComponent<object>;
export declare const GlassToolbar: GlassVueComponent<object>;
export declare const GlassGroup: GlassVueComponent<import("./index.js").GlassAttributes>;
export declare const GlassSpacer: GlassVueComponent<GlassSpacerProps>;
export declare const GlassSearch: GlassVueComponent<GlassSearchProps>;
export declare const GlassSheet: GlassVueComponent<GlassSheetProps>;
export declare const GlassProgressiveBlur: GlassVueComponent<GlassProgressiveBlurProps>;
/**
 * Turn any element into glass from Vue (counterpart of React's `useGlass`).
 *
 * ```ts
 * const card = ref<HTMLElement | null>(null);
 * useGlass(card, { radius: 28, material: "clear" });
 * ```
 */
export declare function useGlass<T extends HTMLElement>(target: Ref<T | null>, options?: MaybeRefOrGetter<GlassOptions>): ShallowRef<SurfaceController | null>;
/** Tags of every glass custom element, e.g. for `compilerOptions.isCustomElement`. */
export declare const isGlassElement: (tag: string) => boolean;
export type { GlassOptions, GlassSurface as GlassSurfaceController } from "../engine/surface.js";
