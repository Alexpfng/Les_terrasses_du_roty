// Test instrumentation only. Loaded into the real built server via --import.
// Preserve timer behavior; observe the 120 s SSR lifecycle safety net without
// waiting two minutes or replacing the renderer with a mock.
const nativeSetTimeout = globalThis.setTimeout;
const nativeClearTimeout = globalThis.clearTimeout;
const active = new Map();
let started = 0;
let cleared = 0;
let expired = 0;

globalThis.setTimeout = function trackedSetTimeout(callback, delay, ...arguments_) {
  if (delay !== 120_000) return nativeSetTimeout(callback, delay, ...arguments_);
  let handle;
  handle = nativeSetTimeout(
    function trackedLifetimeCallback(...values) {
      active.delete(handle);
      expired++;
      return Reflect.apply(callback, this, values);
    },
    delay,
    ...arguments_,
  );
  active.set(handle, Date.now());
  started++;
  return handle;
};

globalThis.clearTimeout = function trackedClearTimeout(handle) {
  if (active.delete(handle)) cleared++;
  else if (typeof handle === "number") {
    for (const timer of active.keys()) {
      if (Number(timer) === handle) {
        active.delete(timer);
        cleared++;
        break;
      }
    }
  }
  return nativeClearTimeout(handle);
};

process.on("message", (message) => {
  if (message?.type !== "roty-runtime-snapshot") return;
  process.send?.({
    type: "roty-runtime-snapshot-result",
    requestId: message.requestId,
    active: active.size,
    started,
    cleared,
    expired,
    oldestActiveMs: active.size ? Date.now() - Math.min(...active.values()) : 0,
  });
});
