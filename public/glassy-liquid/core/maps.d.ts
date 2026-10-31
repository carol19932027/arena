/**
 * Map generation. Two kinds of images are produced, both as 9-slice pieces so
 * they never need regenerating when a surface is resized:
 *
 *  • Displacement tiles - red/green encode the 2D displacement vector for
 *    `feDisplacementMap` (128 = neutral). Corners are square tiles, edges are
 *    2px strips that the filter stretches along the edge.
 *  • Rim images - the specular rim light and edge shade as one small
 *    straight-alpha image used through CSS `border-image`.
 *
 * Results are cached by every parameter that affects pixels, so a page with a
 * hundred capsule buttons of equal height shares one set of images.
 */
import { type ShapeMetrics } from "./shape.js";
import { type OpticsConfig } from "./optics.js";
export type SliceKey = "tl" | "tr" | "bl" | "br" | "t" | "b" | "l" | "r";
export interface MapImage {
    url: string;
    /** Pixel size of the image. */
    width: number;
    height: number;
}
export type DisplacementSet = Partial<Record<SliceKey, MapImage>>;
/**
 * Displacement tiles for a shape. `dpr` is the device pixel ratio the tiles
 * are rasterised for. The vector at each pixel is `-normal × profile(depth)`,
 * i.e. rays are pulled towards the inside of the glass.
 */
export declare function displacementSet(m: ShapeMetrics, dpr: number, optics?: OpticsConfig): DisplacementSet;
export interface RimConfig {
    /** Direction the light comes from, degrees (0 = right, -90 = top). */
    angle: number;
    /** Overall highlight strength 0..1. */
    intensity: number;
    /** Width of the crisp specular line in CSS px. */
    width: number;
    /** Width of the soft inner light in CSS px. */
    glow: number;
    /** Strength of the soft inner light. */
    glowIntensity: number;
    /** Strength of the darker edge outline (helps definition on light backdrops). */
    shade: number;
    /** Brightness of light on the side facing away from the light source. */
    back: number;
    /** Rim light that is present regardless of direction. */
    ambient: number;
}
export declare const defaultRim: RimConfig;
export interface RimImage extends MapImage {
    /** Slice sizes in image pixels and the matching border widths in CSS px. */
    sliceX: number;
    sliceY: number;
    borderX: number;
    borderY: number;
}
/** Extent of the rim image from each edge (CSS px). */
export declare function rimExtent(m: ShapeMetrics, rim: RimConfig): {
    kx: number;
    ky: number;
};
/** The specular rim as a 9-slice image for CSS `border-image`. */
export declare function rimImage(m: ShapeMetrics, dpr: number, rim?: RimConfig): RimImage;
/**
 * Unit gradient for magnification: red falls from 1 to 0 left→right, green
 * top→bottom. Displacing by it with scale `s` over a square of size `D`
 * magnifies the center by `1 / (1 - s / D)`.
 */
export declare function zoomGradient(): string;
/** Cache sizes, for diagnostics and tests. */
export declare function mapCacheStats(): {
    displacement: number;
    rim: number;
};
export interface ShadowLayer {
    /** Vertical offset, CSS px. */
    y: number;
    /** Blur radius as in CSS box-shadow, CSS px. */
    blur: number;
    /** Spread, CSS px (negative shrinks). */
    spread: number;
    /** Shadow opacity (black). */
    alpha: number;
}
export interface ShadowImage extends MapImage {
    /** Image px of the corner slices (outset + inner). */
    slice: number;
    /** CSS px drawn outside the element. */
    outset: number;
    /** CSS px drawn inside the element's border box (the corner radius). */
    inset: number;
}
/**
 * A drop shadow pre-rendered as a 9-slice image for `border-image`. Painting
 * it costs one image draw, unlike `box-shadow`, whose blur is re-rasterised
 * every time a moving element repaints.
 */
export declare function shadowImage(radius: number, layers: ShadowLayer[], dpr: number): ShadowImage | null;
