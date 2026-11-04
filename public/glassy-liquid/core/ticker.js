const tasks = /* @__PURE__ */ new Set();
const pending = /* @__PURE__ */ new Set();
let handle = 0;
let last = 0;
function frame(now) {
  handle = 0;
  const dt = last ? Math.min(0.1, Math.max(0, (now - last) / 1e3)) : 1 / 60;
  last = now;
  const batch = Array.from(pending);
  pending.clear();
  const skip = /* @__PURE__ */ new Set();
  for (const t of batch) {
    if (!tasks.has(t)) continue;
    if (t.read && t.read(now) === false) skip.add(t);
  }
  for (const t of batch) {
    if (!tasks.has(t) || skip.has(t)) continue;
    if (t.write(now, dt)) pending.add(t);
  }
  if (pending.size) handle = requestAnimationFrame(frame);
  else last = 0;
}
function addTask(task) {
  tasks.add(task);
  return () => {
    tasks.delete(task);
    pending.delete(task);
  };
}
function wake(task) {
  if (!tasks.has(task)) tasks.add(task);
  pending.add(task);
  if (!handle && typeof requestAnimationFrame === "function") handle = requestAnimationFrame(frame);
}
export {
  addTask,
  wake
};
