/**
 * React bindings for glassy-liquid. Thin, typed wrappers around the custom
 * elements: attributes for primitives, properties for complex values, and
 * idiomatic callbacks (`onCheckedChange`, `onValueChange`, …). SSR-safe: the
 * server renders plain custom-element markup that upgrades on the client.
 *
 * ```tsx
 * import { GlassButton, GlassSwitch } from "glassy-liquid/react";
 * <GlassButton variant="prominent" onClick={save}>Done</GlassButton>
 * <GlassSwitch checked={on} onCheckedChange={setOn} />
 * ```
 */
import * as React from "react";
import { type GlassOptions, type GlassSurface as SurfaceController } from "../engine/surface.js";
import type { GlassButtonProps, GlassItemProps, GlassMenuItemProps, GlassMenuProps, GlassProgressiveBlurProps, GlassSceneProps, GlassSearchProps, GlassSelectorProps, GlassSheetProps, GlassSliderProps, GlassSpacerProps, GlassSwitchProps } from "../bindings/specs.js";
export type { GlassAttributes, GlassButtonProps, GlassItemProps, GlassMenuItemProps, GlassMenuProps, GlassProgressiveBlurProps, GlassSceneProps, GlassSearchProps, GlassSelectorProps, GlassSheetProps, GlassSliderProps, GlassSurfaceProps, GlassSwitchProps, } from "../bindings/specs.js";
type Html = React.HTMLAttributes<HTMLElement>;
export declare const GlassScene: React.ForwardRefExoticComponent<GlassSceneProps & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassSurface: React.ForwardRefExoticComponent<import("./index.js").GlassAttributes & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassButton: React.ForwardRefExoticComponent<GlassButtonProps & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassSwitch: React.ForwardRefExoticComponent<GlassSwitchProps & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassSlider: React.ForwardRefExoticComponent<GlassSliderProps & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassTabBar: React.ForwardRefExoticComponent<GlassSelectorProps & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassSegmented: React.ForwardRefExoticComponent<GlassSelectorProps & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassTab: React.ForwardRefExoticComponent<GlassItemProps & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassSegment: React.ForwardRefExoticComponent<GlassItemProps & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassMenu: React.ForwardRefExoticComponent<GlassMenuProps & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassMenuItem: React.ForwardRefExoticComponent<GlassMenuItemProps & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassMenuSeparator: React.ForwardRefExoticComponent<object & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassMenuLabel: React.ForwardRefExoticComponent<object & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassToolbar: React.ForwardRefExoticComponent<object & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassGroup: React.ForwardRefExoticComponent<import("./index.js").GlassAttributes & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassSpacer: React.ForwardRefExoticComponent<GlassSpacerProps & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassSearch: React.ForwardRefExoticComponent<GlassSearchProps & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassSheet: React.ForwardRefExoticComponent<GlassSheetProps & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
export declare const GlassProgressiveBlur: React.ForwardRefExoticComponent<GlassProgressiveBlurProps & Html & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLElement>>;
/**
 * Turn any element into glass from React.
 *
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useGlass(ref, { radius: 28, material: "clear" });
 * return <div ref={ref}>…</div>;
 * ```
 */
export declare function useGlass<T extends HTMLElement>(ref: React.RefObject<T | null>, options?: GlassOptions): React.RefObject<SurfaceController | null>;
export type { GlassOptions, GlassSurface as GlassSurfaceController } from "../engine/surface.js";
