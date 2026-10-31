/**
 * Svelte actions for glassy-liquid. They work in Svelte 4 and 5 and use the
 * exact prop and callback names of `glassy-liquid/react`.
 *
 * ```svelte
 * <glass-switch use:glassProps={{ checked, onCheckedChange: (v) => (checked = v) }}></glass-switch>
 * <div use:useGlass={{ radius: 28, material: "clear" }}>…</div>
 * ```
 *
 * Svelte 5 projects can use the ready-made components instead
 * (`import { GlassSwitch } from "glassy-liquid/svelte"`).
 */
import { type GlassOptions } from "../engine/surface.js";
import { type ComponentName } from "../bindings/specs.js";
export interface ActionReturn<P> {
    update?: (props: P) => void;
    destroy?: () => void;
}
/**
 * Apply React-style props (attributes, controlled properties, `on…` callbacks)
 * to a glass custom element. The binding is chosen from the element's tag.
 */
export declare function glassProps<P extends object = Record<string, unknown>>(node: HTMLElement, props?: P): ActionReturn<P>;
/** Turn any element into glass (counterpart of React's `useGlass`). */
export declare function useGlass(node: HTMLElement, options?: GlassOptions): ActionReturn<GlassOptions>;
/**
 * Used by the generated Svelte 5 components: splits props into the spec bucket
 * (handled by `glassProps`) and plain HTML attributes, and routes the
 * `on…Change` callbacks through the bindable value so `bind:` works.
 */
export declare function svelteProps(name: ComponentName, rest: Record<string, unknown>, bound: Record<string, unknown>, set: (prop: string, value: unknown) => void): {
    own: Record<string, unknown>;
    html: Record<string, unknown>;
    ssr: Record<string, string>;
};
export { componentNames, specs, propNames } from "../bindings/specs.js";
