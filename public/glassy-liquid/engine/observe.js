const resizeCbs = /* @__PURE__ */ new WeakMap();
const visibleCbs = /* @__PURE__ */ new WeakMap();
let ro;
let io;
function observeSize(el, cb) {
  if (typeof ResizeObserver === "undefined") return () => {
  };
  ro ?? (ro = new ResizeObserver((entries) => {
    for (const e of entries) {
      const fn = resizeCbs.get(e.target);
      if (!fn) continue;
      const box = e.borderBoxSize?.[0];
      const w = box ? box.inlineSize : e.target.offsetWidth;
      const h = box ? box.blockSize : e.target.offsetHeight;
      fn(w, h);
    }
  }));
  resizeCbs.set(el, cb);
  ro.observe(el, { box: "border-box" });
  return () => {
    resizeCbs.delete(el);
    ro?.unobserve(el);
  };
}
function observeVisibility(el, cb) {
  if (typeof IntersectionObserver === "undefined") {
    cb(true);
    return () => {
    };
  }
  io ?? (io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) visibleCbs.get(e.target)?.(e.isIntersecting);
    },
    { rootMargin: "200px" }
  ));
  visibleCbs.set(el, cb);
  io.observe(el);
  return () => {
    visibleCbs.delete(el);
    io?.unobserve(el);
  };
}
export {
  observeSize,
  observeVisibility
};
