/* SAMVAAD POS — state, persistence and the change bus.
   One store. Every module reads it; nothing mutates it except update(). */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const KEY = 'samvaad-pos.state.v1';

  /* localStorage is unavailable on some file:// origins and in private modes.
     Fall back to memory so the counter keeps working instead of white-screening. */
  const disk = (() => {
    try {
      const probe = '__samvaad_probe__';
      localStorage.setItem(probe, '1');
      localStorage.removeItem(probe);
      return localStorage;
    } catch (_) {
      let mem = {};
      return {
        getItem: (k) => (k in mem ? mem[k] : null),
        setItem: (k, v) => { mem[k] = String(v); },
        removeItem: (k) => { delete mem[k]; },
        volatile: true
      };
    }
  })();

  let state = null;
  const listeners = new Set();
  let quiet = 0;

  function read() {
    try {
      const raw = disk.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && parsed.schema === 1 ? parsed : null;
    } catch (_) {
      return null;
    }
  }

  function write() {
    if (disk.volatile) return;
    try {
      disk.setItem(KEY, JSON.stringify(state));
    } catch (_) {
      /* quota or blocked — the session keeps running from memory */
    }
  }

  SV.store = {
    get volatile() { return !!disk.volatile; },

    init(seedFn) {
      state = read() || seedFn();
      write();
      return state;
    },

    get state() { return state; },

    /* Batch several mutations into one notification. */
    batch(fn) {
      quiet += 1;
      try { fn(state); } finally { quiet -= 1; }
      write();
      listeners.forEach((fn) => fn(state));
    },

    update(mutator) {
      mutator(state);
      write();
      listeners.forEach((fn) => fn(state));
    },

    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    /* Wipe the counter back to its seeded demo state. */
    reset(seedFn) {
      state = seedFn();
      write();
      listeners.forEach((fn) => fn(state));
    }
  };
})(window.SV);