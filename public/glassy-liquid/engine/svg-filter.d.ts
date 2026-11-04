import type { ShapeMetrics } from "../core/shape.js";
import type { OpticsConfig } from "../core/optics.js";
export interface FilterParams {
    metrics: ShapeMetrics;
    dpr: number;
    optics: OpticsConfig;
    /** Maximum displacement at the rim, CSS px. */
    refraction: number;
    /** Chromatic dispersion 0..1 (relative spread of R/B displacement). */
    dispersion: number;
    /** Tone transfer table (feFuncX tableValues) or null for identity. */
    tone: string | null;
    /** Gaussian blur inside the SVG graph (0 = none). Prefer CSS blur() before the url when possible. */
    blur: number;
    /** Magnification of the flat center (1 = none). Used by selection lenses. */
    zoom?: number;
    /** Offset of the shape inside the filter's user space (content-layer filters). */
    offsetX?: number;
    offsetY?: number;
}
export declare class GlassFilter {
    readonly id: string;
    readonly svg: SVGSVGElement;
    readonly filter: SVGFilterElement;
    private structure;
    private images;
    private flood?;
    private displacements;
    private zoomImage?;
    private zoomMap?;
    constructor(id: string);
    /** Apply parameters, rebuilding the graph only when its structure changes. */
    update(p: FilterParams): void;
    private build;
    private layout;
    destroy(): void;
}
