/**
 * Styles for the glass layers. The same rules are used in two places:
 * adopted into every component's shadow root, and injected once into the
 * document for surfaces created with `glass(element)` on light-DOM elements.
 *
 * Layer stack inside <gl-fx> (bottom → top):
 *   .s  drop shadow (kept separate, see below)
 *   .b  transmitted backdrop: refraction/blur filter, fill color
 *   .t  tint (colored glass)
 *   .r  specular rim light (9-slice border-image)
 *   .g  interactive illumination following the finger
 */
export declare const fxCss = "\ngl-fx{position:absolute;inset:0;z-index:-1;display:block;pointer-events:none;border-radius:inherit;}\ngl-fx>*{position:absolute;inset:0;display:block;border-radius:inherit;box-sizing:border-box;}\n/* Fading uses --gl-o on each layer: opacity on a parent would make it a backdrop root and empty the glass. */\ngl-fx>.s,gl-fx>.b{opacity:var(--gl-o,1);}\ngl-fx>.s{box-shadow:var(--gl-shadow,none);}\n/* Never put box-shadow on the filtered layer: Chromium offsets backdrop-filter url() by the shadow's overflow. */\ngl-fx>.b{background-color:var(--gl-fill,transparent);}\ngl-fx>.b>canvas{position:absolute;inset:0;width:100%;height:100%;border-radius:inherit;}\ngl-fx>.t{background:var(--gl-tint,transparent);opacity:calc(var(--gl-tint-opacity,0) * var(--gl-o,1));mix-blend-mode:var(--gl-tint-blend,normal);}\ngl-fx>.r{border-style:solid;border-color:transparent;opacity:calc(var(--gl-rim-o,1) * var(--gl-o,1));}\ngl-fx>.g{overflow:hidden;opacity:calc(var(--gl-glow,0) * var(--gl-o,1));}\ngl-fx>.g>i{position:absolute;left:0;top:0;width:var(--gl-glow-size,120px);height:var(--gl-glow-size,120px);border-radius:50%;\n  translate:calc(var(--gl-glow-x,50%) - 50%) calc(var(--gl-glow-y,50%) - 50%);\n  background:radial-gradient(closest-side,rgba(255,255,255,var(--gl-glow-core,.5)),rgba(255,255,255,calc(var(--gl-glow-core,.5)*.35)) 55%,rgba(255,255,255,0));}\ngl-fx>svg{position:absolute;inset:auto;width:0;height:0;overflow:hidden;}\n@media (prefers-reduced-transparency: reduce){gl-fx>.b{background-color:var(--gl-solid,rgba(242,242,247,.96));}}\n@media (forced-colors: active){gl-fx>.b{background:Canvas;border:1px solid CanvasText;box-shadow:none;}gl-fx>.r,gl-fx>.g,gl-fx>.t{display:none;}}\n";
/** Constructable sheet shared by all shadow roots (falls back to <style>). */
export declare function adoptStyles(root: ShadowRoot, ...extra: string[]): void;
/** Inject the layer styles into the document (for light-DOM surfaces). */
export declare function ensureDocumentStyles(): void;
