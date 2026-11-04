/**
 * GlassSurface - turns any element into a Liquid Glass slab.
 *
 * It owns a small layer stack (<gl-fx>) behind the element's content and picks
 * the best rendering engine for the browser:
 *
 *   backdrop   Chromium: SVG refraction applied to the live page backdrop.
 *   scene-gl   Inside <glass-scene> with image/video/canvas backdrop: WebGL.
 *   scene-dom  Inside <glass-scene> with DOM content (WebKit/Gecko): the scene
 *              filters its content layer.
 *   css        Everywhere else: frosted approximation with the same rim light,
 *              tint, shadow and motion.
 */
import { type EngineKind } from "../core/env.js";
import { type BezelProfile, type OpticsConfig } from "../core/optics.js";
import { type GlassRadius, type ShapeMetrics } from "../core/shape.js";
import { resolveAppearance } from "./appearance.js";
import { type GlassAppearance, type GlassMaterial } from "./materials.js";
export interface GlassOptions {
    /** `regular` (frosted, adaptive) or `clear` (transparent, for media). Default `regular`. */
    material?: GlassMaterial;
    /**
     * `auto` follows `--glass-appearance` on an ancestor, then the page `color-scheme`.
     * The OS preference applies only when the page supports both schemes. Default `auto`.
     */
    appearance?: GlassAppearance | "auto";
    /** Corner radius in CSS px, `capsule` or `circle`. Default 24. */
    radius?: GlassRadius;
    /** Maximum displacement of the rim in CSS px. Default scales with the surface. */
    refraction?: number;
    /** Width of the refracting rim in CSS px. Default 18. */
    bezel?: number;
    /** Frost (Gaussian std deviation, CSS px). Defaults to the material's. */
    blur?: number;
    /**
     * Chromatic dispersion at the rim, 0 to 1. Default: 0.25 where it is free
     * (WebGL scenes), 0 on the backdrop and content filters, where splitting the
     * color channels costs several extra GPU passes per surface.
     */
    dispersion?: number;
    /** Color of tinted glass (any CSS color), e.g. for prominent buttons. */
    tint?: string | null;
    /** Rim light multiplier, 0 to 2. Default 1. */
    specular?: number;
    /** Direction the light comes from in degrees (0 = right, -90 = top). Default -135 (top-left). */
    lightAngle?: number;
    /** Drop shadow. `true` uses the material's shadow, a string is used as CSS box-shadow. */
    shadow?: boolean | string;
    /** Cross-section of the rim. Default `squircle`. */
    profile?: BezelProfile;
    /** Magnification of the center (selection lenses use ~1.15). Default 1. */
    zoom?: number;
    /** Process the backdrop (refraction/blur). `false` keeps only light, tint and shadow - for plain controls inside other glass. Default true. */
    backdrop?: boolean;
    /** Override the material's fill color (any CSS color). */
    fill?: string | null;
    /** Force a rendering engine (mainly for testing). */
    engine?: "auto" | EngineKind;
}
export interface ResolvedGlassOptions {
    material: GlassMaterial;
    appearance: GlassAppearance | "auto";
    radius: GlassRadius;
    refraction: number | undefined;
    bezel: number;
    blur: number | undefined;
    dispersion: number | undefined;
    tint: string | null;
    specular: number;
    lightAngle: number;
    shadow: boolean | string;
    profile: BezelProfile;
    zoom: number;
    backdrop: boolean;
    fill: string | null;
    engine: "auto" | EngineKind;
}
export declare const defaultGlassOptions: ResolvedGlassOptions;
/** Parameters handed to scene renderers. */
export interface SceneParams {
    metrics: ShapeMetrics;
    refraction: number;
    blur: number;
    zoom: number;
    dispersion: number;
    optics: OpticsConfig;
    lift: number;
    roll: number;
    saturation: number;
    fill: [number, number, number, number];
    tone: string;
    dpr: number;
}
/** Scene integration (implemented by <glass-scene>). */
export interface SceneHost {
    readonly sceneMode: "gl" | "dom" | null;
    /** Use the scene engines even where backdrop refraction is available. */
    readonly sceneForced: boolean;
    attachSurface(surface: GlassSurface): SceneBinding | null;
}
export interface SceneBinding {
    update(): void;
    destroy(): void;
}
/**
 * Ask every live surface to re-evaluate its engine. Scenes call this when they
 * appear, change or disappear, so glass created before its scene upgrades
 * still finds it.
 */
export declare function rescanSurfaces(): void;
/** The surface controller attached to an element, if any. */
export declare function getSurface(el: Element): GlassSurface | undefined;
export { resolveAppearance };
export interface SurfaceInit {
    /** Where to put the layer stack. Defaults to the host itself (light DOM). */
    root?: ShadowRoot | HTMLElement;
    /** Element the layer stack is inserted before (defaults to the root's first child). */
    before?: Node | null;
}
export declare class GlassSurface {
    readonly host: HTMLElement;
    readonly fx: HTMLElement;
    private readonly backdrop;
    private readonly tintLayer;
    private readonly rim;
    private readonly shadowLayer;
    private readonly glowLayer;
    private filter;
    private scene;
    private sceneHost;
    private opts;
    private width;
    private height;
    private dpr;
    private engineKind;
    private disposers;
    private frame;
    private sizeOverride;
    private radiusOverride;
    private appearanceValue;
    /** Re-resolve the appearance on the next render (style reads are skipped while morphing). */
    private appearanceStale;
    constructor(host: HTMLElement, options?: GlassOptions, init?: SurfaceInit);
    /** Current options. */
    get options(): Readonly<ResolvedGlassOptions>;
    /** Rendering engine in use. */
    get engine(): EngineKind;
    /** Current shape metrics in CSS px (untransformed). */
    get metrics(): ShapeMetrics;
    /** Update options. Unspecified keys keep their values; `undefined` resets to default. */
    set(options: GlassOptions): void;
    /**
     * Temporarily drive the glass geometry (morph animations) without waiting
     * for layout. Pass null to return to the measured size.
     */
    setGeometry(size: {
        width: number;
        height: number;
    } | null, radius?: GlassRadius | null): void;
    /** Light the glass from a point (local CSS px) with an intensity 0..1. */
    setGlow(x: number, y: number, intensity: number, size?: number): void;
    /**
     * Fade the whole glass (0..1) without breaking the backdrop: the opacity is
     * applied per layer, never on a common parent.
     */
    setOpacity(value: number): void;
    /** Schedule a re-render on the next frame (coalesced); re-reads the appearance. */
    invalidate(): void;
    private resize;
    /** Effective appearance, as of the last render. */
    appearance(): GlassAppearance;
    private spec;
    private chooseEngine;
    /** Refraction strength actually used, in CSS px. */
    refraction(m?: ShapeMetrics): number;
    /** Effective blur (frost) in CSS px. */
    blur(): number;
    /** Optics configuration for map generation. */
    optics(): OpticsConfig;
    /** Re-render now. Cheap: map tiles are cached and only changed attributes are written. */
    render(): void;
    /**
     * Material shadows are drawn from a cached 9-slice image (one image draw per
     * repaint); custom CSS shadows fall back to box-shadow.
     */
    private renderShadow;
    private switchEngine;
    /** Everything a scene renderer needs to draw this surface. */
    sceneParams(): SceneParams;
    /** Layer that scene renderers draw into. */
    get backdropLayer(): HTMLElement;
    /** Device pixel ratio used for the last render. */
    get pixelRatio(): number;
    /** Re-evaluate the engine (e.g. after moving the element into or out of a scene). */
    reattach(): void;
    destroy(): void;
}
/**
 * Turn any element into Liquid Glass. Returns the surface controller.
 *
 * ```js
 * const surface = glass(document.querySelector(".card"), { material: "clear", radius: 28 });
 * surface.set({ tint: "#0a84ff" });
 * surface.destroy();
 * ```
 */
export declare function glass(element: HTMLElement, options?: GlassOptions): GlassSurface;
