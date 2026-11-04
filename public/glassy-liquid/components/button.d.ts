/**
 * <glass-button> - iOS 26 glass button.
 *
 * Attributes: variant="glass|prominent|plain", size="small|medium|large",
 * shape="capsule|circle|rounded", disabled, type="button|submit|reset",
 * href / target (renders as a link), plus every glass attribute.
 *
 * ```html
 * <glass-button>Edit</glass-button>
 * <glass-button variant="prominent">Done</glass-button>
 * <glass-button shape="circle" aria-label="Add"><svg …/></glass-button>
 * ```
 */
import { GlassElement } from "./base.js";
import type { GlassOptions } from "../engine/surface.js";
export declare class GlassButtonElement extends GlassElement {
    static glassDefaults: GlassOptions;
    static interactive: boolean;
    static styles: string;
    static formAssociated: boolean;
    static extraAttributes: string[];
    private internals;
    constructor();
    protected render(): string;
    glassOptions(): GlassOptions;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected attributeChanged(name: string): void;
    private syncRole;
    private onKeyDown;
    private onKeyUp;
    private onClick;
    get disabled(): boolean;
    set disabled(v: boolean);
}
