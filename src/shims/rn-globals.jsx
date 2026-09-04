if (typeof globalThis.__DEV__ === 'undefined') {
  globalThis.__DEV__ = true;
}
if (typeof globalThis.global === 'undefined') {
  globalThis.global = globalThis;
}
if (typeof globalThis.process === 'undefined') {
  globalThis.process = { env: { NODE_ENV: 'development' } };
} else if (!globalThis.process.env) {
  globalThis.process.env = { NODE_ENV: 'development' };
}
if (!globalThis.expo) {
  class EventEmitter {
    addListener() {
      return { remove() {} };
    }
    removeListener() {}
    removeAllListeners() {}
    emit() {}
    listenerCount() {
      return 0;
    }
  }
  class NativeModule extends EventEmitter {}
  class SharedObject extends EventEmitter {
    release() {}
  }
  globalThis.expo = {
    EventEmitter,
    NativeModule,
    SharedObject,
    modules: {},
    uuidv4: () => crypto.randomUUID(),
    uuidv5: () => crypto.randomUUID(),
    getViewConfig: () => ({}),
    reloadAppAsync: async () => window.location.reload(),
  };
}