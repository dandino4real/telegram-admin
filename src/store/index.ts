// store/index.ts

"use client";

import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { authSessionReducer } from "./sessionStore";
import { api } from "./api";
import { safeSessionStorage } from "./storage";

import { combineReducers } from "@reduxjs/toolkit";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  authSession: authSessionReducer,
});

const persistConfig = {
  key: "root",
  storage: safeSessionStorage(),
  whitelist: ["authSession"],
  debug: process.env.NODE_ENV !== "production",
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
