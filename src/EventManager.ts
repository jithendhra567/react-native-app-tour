const listeners: any = {};

export const addListener = (eventName: string, callback: Function) => {
  listeners[eventName] = callback;
};

export const removeListener = (eventName: string) => {
  delete listeners[eventName];
};

export const triggerEvent = (eventName: string, data: any) => {
  if (listeners[eventName]) {
    listeners[eventName](data);
  }
};
