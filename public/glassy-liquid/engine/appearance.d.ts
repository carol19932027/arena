import type { GlassAppearance } from "./materials.js";
/** Effective appearance of an element. `explicit` overrides its `appearance` attribute. */
export declare function resolveAppearance(el: Element, explicit?: string | null): GlassAppearance;
/**
 * Run `callback` whenever the appearance may have changed (OS scheme, page
 * theme switch, `updateAppearance()`). Returns an unsubscribe function.
 */
export declare function onAppearanceChange(callback: () => void): () => void;
/**
 * Re-resolve every glass element's appearance on the next frame. Changes on
 * `<html>`, `<body>` and the color-scheme meta tag are picked up on their
 * own; call this after setting `--glass-appearance` or `color-scheme` on any
 * other element.
 */
export declare function updateAppearance(): void;
