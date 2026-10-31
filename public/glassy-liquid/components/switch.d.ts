import { HTMLElementBase } from "./base.js";
export declare class GlassSwitchElement extends HTMLElementBase {
    static formAssociated: boolean;
    static get observedAttributes(): string[];
    private shadow;
    private internals;
    private fill;
    private thumb;
    private pos;
    private on;
    private drag;
    private removeTask;
    private unwatch;
    private value_;
    private initialized;
    private suppressClick;
    /** Set while a click is handled, so a wrapping <label> re-dispatching it (Firefox) does not toggle twice. */
    private clicking;
    constructor();
    private task;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string): void;
    get checked(): boolean;
    set checked(v: boolean);
    get value(): string;
    get form(): HTMLFormElement | null;
    formResetCallback(): void;
    /** Toggle (animated, fires events). */
    toggle(force?: boolean): void;
    private applyAppearance;
    private syncAria;
    private setChecked;
    private onDown;
    private onMove;
    private onUp;
    private onClick;
    private onKey;
}
