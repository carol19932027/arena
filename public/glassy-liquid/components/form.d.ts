/**
 * Shared helpers for form-associated glass controls.
 */
export declare function attachInternals(el: HTMLElement): ElementInternals | null;
/** Read a CSS custom property from an element (trimmed), with fallback. */
export declare function cssVar(el: Element, name: string, fallback: string): string;
/** iOS system colors, light/dark. */
export declare const systemColors: {
    readonly green: readonly ["#34c759", "#30d158"];
    readonly blue: readonly ["#007aff", "#0a84ff"];
    readonly fill: readonly ["rgba(120,120,128,0.2)", "rgba(120,120,128,0.36)"];
    readonly track: readonly ["rgba(120,120,128,0.2)", "rgba(120,120,128,0.32)"];
};
