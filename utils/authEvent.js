// utils/authEvents.js
export const authEvents = (() => {
  const listeners = new Set();
  return {
    onUnauthorized(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    emitUnauthorized(payload) {
      for (const fn of listeners) fn(payload);
    },
  };
})();
