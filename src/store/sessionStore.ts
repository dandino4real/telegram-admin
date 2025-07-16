// src/sessionStore.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "./api";
import { DefaultResponse } from "./type";

interface AuthSessionState {
  refreshToken: string | null;
  user: { id: string } | null;
  isRehydrated: boolean;
}

const initialState: AuthSessionState = {
  refreshToken: null,
  user: null,
  isRehydrated: false,
};

const authSessionSlice = createSlice({
  name: "authSession",
  initialState,
  reducers: {
    setSession(
      state,
      action: PayloadAction<{ refreshToken: string; user: { id: string } }>
    ) {
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      console.log("sessionStore: setSession called:", action.payload);
      console.log(
        "Storing to sessionStorage:",
        JSON.stringify({
          refreshToken: action.payload.refreshToken,
          user: action.payload.user,
        })
      );
    },
    clearSession(state) {
      state.refreshToken = null;
      state.user = null;
      console.log("sessionStore: clearSession called");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.login.matchFulfilled,
      (state, action: PayloadAction<DefaultResponse>) => {
        console.log("sessionStore: Login action payload:", action.payload);
        if (action.payload.refreshToken && action.payload.id) {
          state.refreshToken = action.payload.refreshToken;
          state.user = { id: action.payload.id };
          console.log("sessionStore: Set refreshToken and user:", {
            refreshToken: state.refreshToken,
            user: state.user,
          });
          console.log(
            "sessionStore: sessionStorage persist:root after login:",
            typeof window !== "undefined"
              ? window.sessionStorage.getItem("persist:root")
              : null
          );
          setTimeout(() => {
            console.log(
              "sessionStore: Delayed sessionStorage persist:root after login:",
              typeof window !== "undefined"
                ? window.sessionStorage.getItem("persist:root")
                : null
            );
          }, 1000);
        } else {
          console.warn(
            "sessionStore: Incomplete login response:",
            action.payload
          );
        }
      }
    );
    builder.addMatcher(api.endpoints.resetPassword.matchFulfilled, (state) => {
      state.refreshToken = null;
      state.user = null;
      console.log("sessionStore: Reset password, cleared session");
    });

    builder.addMatcher(
      (action) => action.type === "persist/REHYDRATE",
      (state, action: PayloadAction<{ authSession?: AuthSessionState }>) => {
        console.log(
          "sessionStore: Rehydration triggered, payload:",
          action.payload
        );

        if (action.payload?.authSession) {
          const persistedSession = action.payload.authSession;

          // Only restore if we have valid data
          if (persistedSession.refreshToken && persistedSession.user?.id) {
            state.refreshToken = persistedSession.refreshToken;
            state.user = persistedSession.user;
            console.log("sessionStore: Restored session from storage");
          } else {
            console.warn("sessionStore: Invalid persisted session data");
          }
        }

        state.isRehydrated = true;
        console.log("sessionStore: Rehydration completed");
      }
    );
  },
});

export const { setSession, clearSession } = authSessionSlice.actions;
export const authSessionReducer = authSessionSlice.reducer;
