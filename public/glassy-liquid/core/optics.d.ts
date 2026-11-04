export type BezelProfile = "convex" | "squircle" | "lip" | "flat";
export interface OpticsConfig {
    /** Shape of the rim cross-section. */
    profile: BezelProfile;
    /** Index of refraction (glass ≈ 1.5). */
    ior: number;
    /** Rim height relative to bezel width. */
    thickness: number;
    /** Distance between glass and the content plane, relative to bezel width. */
    float: number;
}
export declare const defaultOptics: OpticsConfig;
/** Rim height as a function of depth into the bezel: 0 at the edge, 1 where the flat top begins. */
export declare function surfaceHeight(profile: BezelProfile, t: number): number;
/**
 * Lateral displacement (in bezel units, positive = towards the inside) of a
 * vertical ray crossing the rim at depth `t`.
 */
export declare function rayDisplacement(config: OpticsConfig, t: number): number;
export interface ProfileTable {
    /** Normalized displacement magnitude, index 0 = outer edge, last = flat top. Range [-1, 1]. */
    values: Float32Array;
    /** Peak of the raw displacement before normalization (in bezel units). */
    peak: number;
}
/** Sampled, normalized displacement profile. Cached per configuration. */
export declare function profileTable(config?: OpticsConfig, samples?: number): ProfileTable;
/** Linear lookup into a profile table for a depth in [0, 1]. */
export declare function sampleProfile(table: ProfileTable, t: number): number;
