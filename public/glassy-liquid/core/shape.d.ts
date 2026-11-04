export type GlassRadius = number | "capsule" | "circle";
export interface ShapeMetrics {
    width: number;
    height: number;
    /** Effective corner radius in CSS px. */
    radius: number;
    /** Effective bezel width in CSS px. */
    bezel: number;
    /** Corner tile size (CSS px) horizontally / vertically. */
    kx: number;
    ky: number;
}
export declare function resolveRadius(radius: GlassRadius | undefined, width: number, height: number): number;
export declare function shapeMetrics(width: number, height: number, radius: GlassRadius | undefined, bezel: number): ShapeMetrics;
export interface FieldSample {
    /** Signed distance to the outline in CSS px, positive inside. */
    depth: number;
    /** Outward unit normal of the nearest outline point. */
    nx: number;
    ny: number;
}
/**
 * Signed distance field of the top-left corner tile of a rounded rectangle
 * whose half-size is (kx, ky) and corner radius r. Coordinates are tile-local
 * CSS px with the origin at the shape's top-left corner. Within the tile this
 * equals the distance field of every larger rectangle sharing that corner.
 */
export declare function cornerField(x: number, y: number, kx: number, ky: number, r: number, out: FieldSample): FieldSample;
/** Full signed distance field of a rounded rectangle (used by tests and the WebGL path's JS twin). */
export declare function roundedRectField(x: number, y: number, w: number, h: number, r: number, out: FieldSample): FieldSample;
export interface Slice {
    key: "tl" | "tr" | "bl" | "br" | "t" | "b" | "l" | "r";
    x: number;
    y: number;
    width: number;
    height: number;
}
/** Placement of the 9-slice pieces for a surface. Zero-sized edges are omitted. */
export declare function sliceLayout(m: ShapeMetrics): Slice[];
/** CSS `border-radius` value for a resolved radius. */
export declare function cssRadius(radius: GlassRadius | undefined): string;
