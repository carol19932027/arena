import type { GlassSurface } from "../engine/surface.js";
export interface PressOptions {
    /** Grow factor at full press. Default: scales with size (small controls grow more). */
    grow?: number;
    /** Follow the finger while held. Default true. */
    stretch?: boolean;
    /** Light up under the finger. Default true. */
    glow?: boolean;
    /** Target for scale/translate (defaults to the host). */
    target?: HTMLElement;
    /** Called when press state changes. */
    onPressChange?: (pressed: boolean) => void;
}
export interface PressController {
    readonly pressed: boolean;
    dispose(): void;
}
/** Movement (CSS px) after which a press counts as a drag rather than a tap; fingers jitter more than mice. */
export declare function tapSlop(e: PointerEvent): number;
export declare function attachPress(host: HTMLElement, surface: GlassSurface | null, options?: PressOptions): PressController;
