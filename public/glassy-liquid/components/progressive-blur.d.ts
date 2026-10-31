/**
 * <glass-progressive-blur> - the iOS 26 scroll-edge effect: content fades
 * into an increasing blur towards an edge, so floating glass bars stay
 * legible without a hard divider. Works in every browser with backdrop-filter.
 *
 * ```html
 * <glass-progressive-blur edge="top" size="96" style="position:fixed;top:0;left:0;right:0"></glass-progressive-blur>
 * ```
 * Attributes: edge (top|bottom|left|right), size (px), blur (max px), layers, tint (CSS color).
 */
import { HTMLElementBase } from "./base.js";
export declare class GlassProgressiveBlurElement extends HTMLElementBase {
    static get observedAttributes(): string[];
    private shadow;
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(): void;
    private build;
}
