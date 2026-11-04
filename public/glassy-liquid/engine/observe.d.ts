/**
 * Shared observers. One ResizeObserver and one IntersectionObserver serve all
 * surfaces, instead of one per element.
 */
type ResizeCb = (width: number, height: number) => void;
type VisibleCb = (visible: boolean) => void;
export declare function observeSize(el: Element, cb: ResizeCb): () => void;
export declare function observeVisibility(el: Element, cb: VisibleCb): () => void;
export {};
