const gWindowTracker = imports.gi.Shell.WindowTracker.get_default();

const connect: typeof gWindowTracker.connect = (...args) => {
  return gWindowTracker.connect(...args);
};

export const WindowTracker = {
  connect,

  disconnect(id: number) {
    gWindowTracker.disconnect(id);
  },
};
