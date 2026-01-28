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
      action: PayloadAction<{ refreshToken: string; user: { id: string } }>,
    ) {
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
    },
    clearSession(state) {
      state.refreshToken = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.login.matchFulfilled,
      (state, action: PayloadAction<DefaultResponse>) => {
        if (action.payload.refreshToken && action.payload.id) {
          state.refreshToken = action.payload.refreshToken;
          state.user = { id: action.payload.id };
        }
      },
    );
    builder.addMatcher(api.endpoints.resetPassword.matchFulfilled, (state) => {
      state.refreshToken = null;
      state.user = null;
    });

    builder.addMatcher(
      (action) => action.type === "persist/REHYDRATE",
      (state, action: PayloadAction<{ authSession?: AuthSessionState }>) => {
        if (action.payload?.authSession) {
          const persistedSession = action.payload.authSession;

          // Only restore if we have valid data
          if (persistedSession.refreshToken && persistedSession.user?.id) {
            state.refreshToken = persistedSession.refreshToken;
            state.user = persistedSession.user;
          }
        }

        state.isRehydrated = true;
      },
    );
  },
});

export const { setSession, clearSession } = authSessionSlice.actions;
export const authSessionReducer = authSessionSlice.reducer;
