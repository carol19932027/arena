/**
 * Environment and capability detection. Evaluated lazily and cached.
 */
export type EngineKind = "backdrop" | "scene-gl" | "scene-dom" | "css";
declare const isBrowser: boolean;
/**
 * Whether `backdrop-filter: url(#svg)` actually renders. Only Chromium-based
 * engines do (Chrome, Edge, Opera, Samsung Internet, Electron, Android
 * WebView). WebKit parses but drops it, Gecko does not support it. Every
 * browser on iOS/iPadOS is WebKit, regardless of its brand.
 */
export declare function supportsBackdropSvg(): boolean;
export declare function cssSupports(property: string, value: string): boolean;
export declare function supportsBackdropFilter(): boolean;
export declare function supportsWebGL(): boolean;
export declare function devicePixelRatio(): number;
export declare const prefersReducedMotion: () => boolean;
export declare const prefersReducedTransparency: () => boolean;
export declare const prefersDark: () => boolean;
export declare const forcedColors: () => boolean;
export declare const finePointer: () => boolean;
/** Subscribe to a media query; returns an unsubscribe function. */
export declare function watchMedia(query: string, cb: () => void): () => void;
export declare const nextId: (prefix: string) => string;
export { isBrowser };
