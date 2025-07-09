// store/storage.ts
import { WebStorage } from "redux-persist/es/types";

const createNoopStorage = (): WebStorage => {
  return {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  };
};

let sessionStorage: WebStorage | undefined;

// Only attempt to import browser-side storage in client environment
if (typeof window !== 'undefined') {
  try {
    import('redux-persist/lib/storage/session')
      .then(module => {
        sessionStorage = module.default;
      })
      .catch(() => {
        console.warn('Failed to import session storage module');
      });
  } catch (e) {
    console.warn('Session storage import error:', e);
  }
}

export const safeSessionStorage = (): WebStorage => {
  if (typeof window === 'undefined') {
    return createNoopStorage();
  }
  return sessionStorage || createNoopStorage();
};