export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export type Placement = "bottom-start" | "bottom-end" | "bottom" | "top-start" | "top-end" | "top";
/** Rect of an element in viewport coordinates, without its transforms' scale. */
export declare function viewportRect(el: Element): Rect;
/**
 * Place a box of `size` next to `anchor` inside the viewport, flipping and
 * shifting to stay visible (8px margin).
 */
export declare function place(anchor: Rect, size: {
    width: number;
    height: number;
}, placement?: Placement, gap?: number): Rect & {
    side: "top" | "bottom";
};
export declare function lerpRect(a: Rect, b: Rect, t: number): Rect;
