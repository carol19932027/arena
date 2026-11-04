import { type GlassOptions } from "../engine/surface.js";
import { HTMLElementBase } from "./base.js";
/** <glass-menu-item> */
export declare class GlassMenuItem extends HTMLElementBase {
    private initialized;
    connectedCallback(): void;
    get value(): string;
    get disabled(): boolean;
}
/** <glass-menu-separator> */
export declare class GlassMenuSeparator extends HTMLElementBase {
    connectedCallback(): void;
}
/** <glass-menu-label> - a section header. */
export declare class GlassMenuLabel extends HTMLElementBase {
    connectedCallback(): void;
}
export declare class GlassMenuElement extends HTMLElementBase {
    static get observedAttributes(): string[];
    private shadow;
    private panel;
    private content;
    private glassSurface;
    private progress;
    private from;
    private to;
    private isOpen;
    private removeTask;
    private highlighted;
    private gesture;
    private initialized;
    private supportsPopover;
    constructor();
    get open(): boolean;
    set open(v: boolean);
    get trigger(): HTMLElement | null;
    get items(): GlassMenuItem[];
    /** Glass options for the panel (override via the `glass` property). */
    glass: GlassOptions;
    private task;
    connectedCallback(): void;
    private syncTrigger;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string): void;
    /** Open the menu. `focusFirst` moves focus into it (keyboard opening). */
    show(focusFirst?: boolean): void;
    /** Close the menu, morphing back into the trigger. */
    hide(returnFocus?: boolean): void;
    toggle(): void;
    private finishClose;
    private layout;
    private attachGlobal;
    private detachGlobal;
    private onViewportChange;
    private onOutside;
    private itemAt;
    private highlight;
    private choose;
    private onPointerDown;
    private suppressClick;
    private onGestureMove;
    private onGestureUp;
    private onClick;
    private onPanelMove;
    private onPanelLeave;
    private onKeyDown;
}
