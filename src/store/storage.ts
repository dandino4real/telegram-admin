// // store/storage.ts
import { WebStorage } from "redux-persist/es/types";

const createNoopStorage = (): WebStorage => {
  return {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  };
};

export const safeSessionStorage = (): WebStorage => {
  if (typeof window === "undefined") {
    return createNoopStorage();
  }

  return {
    getItem: (key) => {
      const value = window.sessionStorage.getItem(key);
      console.log(`sessionStorage: getItem(${key}) =>`, value);
      return Promise.resolve(value);
    },
    setItem: (key, value) => {
      console.log(`sessionStorage: setItem(${key}, ${value})`);
      window.sessionStorage.setItem(key, value);
      return Promise.resolve();
    },
    removeItem: (key) => {
      console.log(`sessionStorage: removeItem(${key})`);
      window.sessionStorage.removeItem(key);
      return Promise.resolve();
    },
  };
};
