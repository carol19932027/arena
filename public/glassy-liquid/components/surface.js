import { GlassElement, define } from "./base.js";
class GlassSurfaceElement extends GlassElement {
}
GlassSurfaceElement.glassDefaults = { radius: 24 };
GlassSurfaceElement.styles = /* css */
`:host{display:block;}`;
define("glass-surface", GlassSurfaceElement);
export {
  GlassSurfaceElement
};
