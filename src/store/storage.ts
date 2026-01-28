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
      return Promise.resolve(value);
    },
    setItem: (key, value) => {
      window.sessionStorage.setItem(key, value);
      return Promise.resolve();
    },
    removeItem: (key) => {
      window.sessionStorage.removeItem(key);
      return Promise.resolve();
    },
  };
};
