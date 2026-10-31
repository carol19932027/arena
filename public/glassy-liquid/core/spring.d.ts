/**
 * Analytic damped springs, parameterised the way SwiftUI does it:
 * a perceptual `duration` (seconds) and a `bounce` (0 = critically damped,
 * towards 1 = very springy, negative = overdamped).
 *
 * The closed-form solution keeps animations stable across dropped frames and
 * lets every gesture retarget mid-flight while preserving velocity.
 */
export interface SpringConfig {
    duration: number;
    bounce: number;
}
/** Springs shared by every glass interaction so motion reads as one material. */
export declare const springs: {
    /** Glass catching a finger. */
    readonly press: {
        readonly duration: 0.22;
        readonly bounce: 0.18;
    };
    /** Letting go: gel-like overshoot back to rest. */
    readonly release: {
        readonly duration: 0.5;
        readonly bounce: 0.38;
    };
    /** Light settling in and out of the material. */
    readonly glow: {
        readonly duration: 0.4;
        readonly bounce: 0;
    };
    /** Shapes growing out of / into each other (menus, sheets). */
    readonly morph: {
        readonly duration: 0.46;
        readonly bounce: 0.2;
    };
    /** Layout changes. */
    readonly layout: {
        readonly duration: 0.38;
        readonly bounce: 0.14;
    };
    /** A selection lens following a finger. */
    readonly track: {
        readonly duration: 0.16;
        readonly bounce: 0;
    };
    /** Selection snapping to its new home after release. */
    readonly snap: {
        readonly duration: 0.42;
        readonly bounce: 0.24;
    };
    /** Switch thumbs and other small toggles. */
    readonly toggle: {
        readonly duration: 0.36;
        readonly bounce: 0.26;
    };
};
export declare class Spring {
    value: number;
    target: number;
    velocity: number;
    private omega;
    private zeta;
    constructor(value?: number, config?: SpringConfig);
    configure({ duration, bounce }: SpringConfig): this;
    /** Retarget with an optional new configuration, keeping velocity. */
    to(target: number, config?: SpringConfig): this;
    /** Jump without animation. */
    set(value: number): this;
    get settled(): boolean;
    step(dt: number): this;
}
/** iOS rubber-banding: follows a short drag 1:1, then resists asymptotically. */
export declare function rubberBand(offset: number, limit: number, coefficient?: number): number;
/** Clamp helper used across the library. */
export declare const clamp: (v: number, lo: number, hi: number) => number;
/** Linear interpolation. */
export declare const mix: (a: number, b: number, t: number) => number;
