import { HTMLElementBase } from "./base.js";
export declare class GlassSheetElement extends HTMLElementBase {
    static get observedAttributes(): string[];
    private shadow;
    private sheet;
    private body;
    private scrim;
    private glassSurface;
    private h;
    private isOpen;
    private detentIndex;
    private removeTask;
    private drag;
    private returnFocus;
    private initialized;
    private unwatch;
    constructor();
    get open(): boolean;
    set open(v: boolean);
    /** Detent heights in px for the current viewport. */
    get detents(): number[];
    private task;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string): void;
    /** tint, blur, and material update the slab. Missing attributes reset to the material default. */
    private materialOptions;
    /** Present the sheet at a detent (default: the smallest). */
    show(detent?: number): void;
    hide(): void;
    /** Animate to a detent index. */
    snapTo(index: number): void;
    private finishClose;
    private layout;
    private onScrim;
    private onKey;
    /** Focusable content of the sheet, in tab order. Slotted elements live in the light DOM. */
    private focusables;
    /** A modal sheet keeps Tab and Shift+Tab inside itself. */
    private trapTab;
    /** Focus that moves outside a modal sheet (a click, a script, a screen reader) comes back. */
    private onFocusIn;
    private releaseFocus;
    private onDown;
    private onMove;
    private onUp;
}
