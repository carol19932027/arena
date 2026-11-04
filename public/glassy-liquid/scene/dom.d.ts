import type { SceneParams } from "../engine/surface.js";
export interface DomSurfaceState {
    params: SceneParams;
    /** Visual top-left relative to the backdrop's border box. */
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
}
export declare class DomFilterRenderer {
    private backdrop;
    readonly id: string;
    private svg;
    private filter;
    private states;
    private structure;
    private applied;
    constructor(backdrop: HTMLElement);
    set(key: object, state: DomSurfaceState | null): void;
    get size(): number;
    private graph;
    /** Apply the current states to the filter (in place when possible). */
    commit(): void;
    private ownTransform;
    private create;
    private patch;
    private restoreWillChange;
    destroy(): void;
}
