import { type GlassOptions } from "../engine/surface.js";
import { GlassElement, HTMLElementBase } from "./base.js";
/** <glass-tab> / <glass-segment> - an item of a selector. */
export declare class GlassSelectorItem extends HTMLElementBase {
    static get observedAttributes(): string[];
    private initialized;
    connectedCallback(): void;
    attributeChangedCallback(): void;
    get value(): string;
    get disabled(): boolean;
    /** Content wrapper, scaled up while the selection lens passes over the item. */
    get content(): HTMLElement | null;
}
export declare abstract class GlassSelectorElement extends GlassElement {
    static extraAttributes: string[];
    static delegatesFocus: boolean;
    protected abstract readonly itemTag: string;
    /** Lens overshoot around the selected item when lifted (px). */
    protected liftOut: {
        x: number;
        y: number;
    };
    /** Inset of the resting pill inside the item (px). */
    protected restIn: {
        x: number;
        y: number;
    };
    protected lensGlass: GlassOptions;
    /** Extra scale of an item while the lens is over it. */
    protected magnification: number;
    private lensEl;
    private restEl;
    private lensSurface;
    private x;
    private w;
    private lift;
    private stretch;
    private items;
    private geometry;
    private height;
    private selected;
    private drag;
    private removeTask;
    private mo;
    private ro;
    private lensSize;
    private magnified;
    private current;
    private unwatch;
    protected render(): string;
    get value(): string | null;
    set value(v: string | null);
    protected setup(): void;
    private applyAppearance;
    protected teardown(): void;
    protected attributeChanged(name: string, _old: string | null, value: string | null): void;
    private collect;
    private measure;
    private task;
    /** Swell the items under the lens (they are drawn above it, so the glass cannot magnify them). */
    private magnify;
    /** The item that shows the selection color: under the lens while it is lifted, else the selected one. */
    private highlight;
    private indexAt;
    private localX;
    /** Select an item. */
    select(index: number, user: boolean, animate?: boolean): void;
    private suppressClick;
    private onDown;
    private onMove;
    private onUp;
    private onClick;
    private onKey;
}
export declare class GlassTabBarElement extends GlassSelectorElement {
    static glassDefaults: GlassOptions;
    static styles: string;
    protected readonly itemTag = "glass-tab";
    protected liftOut: {
        x: number;
        y: number;
    };
}
export declare class GlassSegmentedElement extends GlassSelectorElement {
    /** The segmented track is not glass itself; only its lens is. */
    static hasGlass: boolean;
    static styles: string;
    protected readonly itemTag = "glass-segment";
    protected liftOut: {
        x: number;
        y: number;
    };
    protected magnification: number;
    protected render(): string;
    protected lensGlass: GlassOptions;
}
