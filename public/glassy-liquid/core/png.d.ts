export declare function encodePng(width: number, height: number, rgba: Uint8Array | Uint8ClampedArray): Uint8Array;
/**
 * Encode RGBA pixels as a PNG data URL. Uses the browser's (compressing)
 * canvas encoder when available, the exact stored encoder otherwise. Canvas
 * premultiplies translucent pixels, which costs a little color precision at
 * very low alpha - irrelevant for highlights, so only callers that need
 * bit-exact translucent data pass `allowCanvas = false`.
 */
export declare function pngDataUrl(width: number, height: number, rgba: Uint8ClampedArray<ArrayBuffer>, allowCanvas?: boolean): string;
