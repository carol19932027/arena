/**
 * <glass-search> - iOS 26 search field on a glass capsule.
 *
 * ```html
 * <glass-search placeholder="Search" name="q"></glass-search>
 * ```
 * Events: `input`, `change`, `search` (Enter; detail { value }).
 * Form-associated; property `value`.
 */
import { GlassElement } from "./base.js";
import type { GlassOptions } from "../engine/surface.js";
export declare class GlassSearchElement extends GlassElement {
    static glassDefaults: GlassOptions;
    static styles: string;
    static delegatesFocus: boolean;
    static formAssociated: boolean;
    static extraAttributes: string[];
    private internals;
    private input;
    constructor();
    protected render(): string;
    protected setup(): void;
    protected attributeChanged(name: string, _old: string | null, value: string | null): void;
    private sync;
    get value(): string;
    set value(v: string);
    focus(options?: FocusOptions): void;
    formResetCallback(): void;
}
