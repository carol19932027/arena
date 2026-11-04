/**
 * Toolbar building blocks.
 *
 *  <glass-group>   one capsule of glass shared by several controls (iOS 26 toolbars)
 *  <glass-toolbar> a row of buttons/groups with arrow-key navigation
 *  <glass-spacer>  flexible (default) or fixed space inside a toolbar
 *
 * ```html
 * <glass-toolbar>
 *   <glass-button shape="circle" aria-label="Back">…</glass-button>
 *   <glass-spacer></glass-spacer>
 *   <glass-group>
 *     <glass-button variant="plain" shape="circle" aria-label="Share">…</glass-button>
 *     <glass-button variant="plain" shape="circle" aria-label="More">…</glass-button>
 *   </glass-group>
 * </glass-toolbar>
 * ```
 */
import { GlassElement, HTMLElementBase } from "./base.js";
import type { GlassOptions } from "../engine/surface.js";
export declare class GlassGroupElement extends GlassElement {
    static glassDefaults: GlassOptions;
    static styles: string;
    connectedCallback(): void;
}
export declare class GlassToolbarElement extends GlassElement {
    static hasGlass: boolean;
    static styles: string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private controls;
    private onKey;
}
export declare class GlassSpacerElement extends HTMLElementBase {
    connectedCallback(): void;
}
