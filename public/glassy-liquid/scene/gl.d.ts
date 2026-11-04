/**
 * WebGL scene renderer (engine `scene-gl`).
 *
 * For scenes whose backdrop is an <img>, <video> or <canvas>, every glass
 * surface is rendered on the GPU from the backdrop texture: the rounded-rect
 * distance field, rim normals, refraction profile, magnification, chromatic
 * dispersion, frost and tone are evaluated per pixel - no displacement maps at
 * all. One context per scene renders all its surfaces; each result is copied
 * into a small canvas inside the surface's own layer stack, so stacking and
 * clipping stay exactly like regular DOM.
 */
import { type OpticsConfig } from "../core/optics.js";
export interface GlDrawParams {
    /** Surface size in CSS px (untransformed). */
    width: number;
    height: number;
    radius: number;
    bezel: number;
    refraction: number;
    zoom: number;
    dispersion: number;
    blur: number;
    dpr: number;
    /** Surface top-left relative to the backdrop element, CSS px (visual). */
    originX: number;
    originY: number;
    /** Visual scale of the surface (transforms). */
    scaleX: number;
    scaleY: number;
    lift: number;
    roll: number;
    saturation: number;
    fill: [number, number, number, number];
    optics: OpticsConfig;
}
type Source = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement;
/** Mapping of backdrop-element CSS px to texture UV, honoring object-fit/position. */
export declare function objectFitMap(el: Source, boxW: number, boxH: number): [number, number, number, number] | null;
/**
 * A backdrop texture (sharp + frosted copy). Images with the same URL share
 * one texture across all scenes of the page.
 */
export declare class GlTexture {
    readonly key: string;
    readonly sharp: WebGLTexture;
    readonly blurred: WebGLTexture;
    readonly tmp: WebGLTexture;
    width: number;
    height: number;
    blurKey: string;
    ready: boolean;
    refs: number;
    /** Bumped on every upload so scenes can tell when shared content changed. */
    version: number;
    constructor(key: string, sharp: WebGLTexture, blurred: WebGLTexture, tmp: WebGLTexture);
}
/**
 * One WebGL context for the whole page (browsers cap live contexts, iOS in
 * particular). Every scene and surface renders through it.
 */
export declare class GlRenderer {
    readonly canvas: HTMLCanvasElement;
    private gl;
    private prog;
    private blurProg;
    private buf;
    private fbo;
    private profile;
    private profileKey;
    private uniforms;
    private blurUniforms;
    private textures;
    private lost;
    private static instance;
    /** The shared renderer, or null when WebGL is unavailable. */
    static shared(): GlRenderer | null;
    private constructor();
    get alive(): boolean;
    private program;
    private makeTexture;
    /** Acquire a texture slot. Use the image URL as key to share it between scenes. */
    acquire(key: string): GlTexture;
    release(t: GlTexture): void;
    private uniform;
    /**
     * Upload a backdrop into a texture. Returns false when the source cannot be
     * used (not fully loaded, or cross-origin without CORS); the texture then
     * stays as it was, so a later upload is not skipped.
     */
    upload(t: GlTexture, source: Source): boolean;
    /** Build the frosted copy for a blur radius given in texture pixels. */
    prepareBlur(t: GlTexture, sigmaTex: number): void;
    private ensureProfile;
    /** Render one surface from texture `t` and copy it into `target` (a 2D canvas). */
    draw(t: GlTexture, p: GlDrawParams, map: [number, number, number, number], target: HTMLCanvasElement): void;
}
export {};
