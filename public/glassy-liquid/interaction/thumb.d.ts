import { Spring } from "../core/spring.js";
import { GlassSurface, type GlassOptions } from "../engine/surface.js";
export interface ThumbLensOptions {
    rest?: {
        width: number;
        height: number;
    };
    lifted?: {
        width: number;
        height: number;
    };
    glass?: GlassOptions;
}
export declare const thumbCss = "\n.gl-thumb{position:absolute;left:0;top:0;will-change:transform;pointer-events:none;}\n.gl-thumb>.solid{position:absolute;left:50%;top:50%;border-radius:999px;background:var(--glass-thumb,#fff);\n  box-shadow:0 3px 8px rgba(0,0,0,.15),0 3px 1px rgba(0,0,0,.06),0 0 0 .5px rgba(0,0,0,.04);}\n";
export declare class ThumbLens {
    readonly el: HTMLElement;
    readonly solid: HTMLElement;
    readonly surface: GlassSurface;
    readonly rest: {
        width: number;
        height: number;
    };
    readonly lifted: {
        width: number;
        height: number;
    };
    /** 0 = resting solid thumb, 1 = lifted glass lens. */
    readonly lift: Spring;
    private stretch;
    private lastX;
    constructor(parent: Element | ShadowRoot, options?: ThumbLensOptions);
    press(): void;
    release(): void;
    get settled(): boolean;
    /**
     * Advance and write the transform. `cx`, `cy` are the thumb center in the
     * parent's coordinates; `velocity` the horizontal speed in px/s.
     */
    update(dt: number, cx: number, cy: number, velocity?: number): void;
    destroy(): void;
}
