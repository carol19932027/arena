import { type GlassSurface, type SceneBinding, type SceneHost } from "../engine/surface.js";
import { HTMLElementBase } from "../components/base.js";
export declare class GlassSceneElement extends HTMLElementBase implements SceneHost {
    static get observedAttributes(): string[];
    private bindings;
    private tex;
    private texVersion;
    private visible;
    private io;
    private uid;
    private dom;
    private backdropEl;
    private mode;
    private watchUntil;
    private removeTask;
    private ro;
    private mediaDirty;
    /** Decoding of the backdrop image, which must finish before its first upload. */
    private decoding;
    private videoHandle;
    private listening;
    /**
     * The `src` image lives in the scene's shadow root (part "backdrop"), not in
     * its light DOM: frameworks hydrating server markup must find exactly the
     * children they rendered, even if the elements upgraded first.
     */
    private autoImg;
    /** A src that already failed to load. Do not assign it again (that loops the broken icon). */
    private failedSrc;
    private ensureShadow;
    get sceneMode(): "gl" | "dom" | null;
    /** `force` attribute: use the scene engines in Chromium too. */
    get sceneForced(): boolean;
    /** The element whose content the glass refracts. */
    get backdrop(): Element | null;
    private task;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(_name: string, old: string | null, value: string | null): void;
    /** Re-render after the backdrop changed (e.g. you drew into a backdrop canvas). */
    invalidate(): void;
    /** Keep tracking surface positions for a while (scrolling, animations). */
    private poke;
    private findBackdrop;
    private hideFailedImage;
    private watchAutoImage;
    private resolve;
    private watchVideo;
    private teardownRenderers;
    private reattachSurfaces;
    attachSurface(surface: GlassSurface): SceneBinding | null;
    private frame;
    private measure;
    private frameGl;
    /**
     * Whether a backdrop image can be uploaded. Firefox reports an image's size
     * while it is still streaming in or not decoded yet (preloaded or cached
     * photos with async decoding), and a texture uploaded then stays empty:
     * black glass. So an image uploads only once it is loaded and decoded.
     */
    private decoded;
    private frameDom;
    private fallbackToDom;
}
