const { display: gDisplay } = global;

const connect: typeof gDisplay.connect = (...args) => {
  return gDisplay.connect(...args);
};

export const Display = {
  connect,
  disconnect(id: number) {
    gDisplay.disconnect(id);
  },
};
