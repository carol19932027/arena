/**
 * <glass-surface> - a generic Liquid Glass container (cards, panels, bars,
 * widgets). Put any content inside.
 *
 * ```html
 * <glass-surface radius="28" material="regular" style="padding:20px">
 *   <h3>Weather</h3>
 * </glass-surface>
 * ```
 */
import { GlassElement } from "./base.js";
export declare class GlassSurfaceElement extends GlassElement {
    static glassDefaults: {
        radius: number;
    };
    static styles: string;
}
