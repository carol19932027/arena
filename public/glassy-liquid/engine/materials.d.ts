/**
 * Material presets. Apple ships two Liquid Glass variants:
 *  • regular - adaptive, frosted, legible over anything (bars, menus, sheets)
 *  • clear   - highly transparent, for media-rich backgrounds (needs a dim layer)
 * Each comes in a light and a dark appearance.
 */
import { type RimConfig, type ShadowLayer } from "../core/maps.js";
export type GlassMaterial = "regular" | "clear";
export type GlassAppearance = "light" | "dark";
export interface MaterialSpec {
    /** Gaussian blur (std deviation, CSS px) applied before refraction. */
    blur: number;
    /** Tone curve: output = lift + (1 - lift - roll) * v  (approximately, see toneTable). */
    lift: number;
    roll: number;
    /** Saturation multiplier of the transmitted light. */
    saturation: number;
    /** CSS color painted over the transmitted light. */
    fill: string;
    /** Rim light configuration. */
    rim: RimConfig;
    /** Drop shadow layers of the slab (rendered as a cached 9-slice image). */
    shadow: ShadowLayer[];
    /** Default foreground color for content on this material. */
    foreground: string;
    /** Text shadow for that content (clear glass needs a halo over bright media). */
    textShadow: string;
    /** Blur used by the CSS-only fallback (it has no refraction to hide the backdrop). */
    fallbackBlur: number;
    /** Fill used by the CSS-only fallback. */
    fallbackFill: string;
}
export declare const materials: Record<GlassMaterial, Record<GlassAppearance, MaterialSpec>>;
/** Tone transfer table for SVG feComponentTransfer (33 entries). */
export declare function toneTable(spec: Pick<MaterialSpec, "lift" | "roll">): string;
/** WCAG relative luminance of normalized sRGB. */
export declare function luminance(rgb: readonly number[]): number;
/** WCAG contrast ratio between two luminances. */
export declare function contrastRatio(a: number, b: number): number;
/**
 * A fill and label color for tinted controls (prominent buttons). White
 * labels stay white - darkening the fill just enough to reach 4.5:1 - unless
 * the color is so light that black reads clearly better (yellow, mint…).
 */
export declare function legibleTint(color: string): {
    fill: string;
    text: string;
};
export declare function parseColor(color: string): [number, number, number, number] | null;
