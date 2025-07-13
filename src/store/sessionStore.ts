

// src/sessionStore.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from './api';
import { DefaultResponse } from './type';

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
  name: 'authSession',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<{ refreshToken: string; user: { id: string } }>) {
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      console.log('sessionStore: setSession called:', action.payload);
    },
    clearSession(state) {
      state.refreshToken = null;
      state.user = null;
      console.log('sessionStore: clearSession called');
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.login.matchFulfilled,
      (state, action: PayloadAction<DefaultResponse>) => {
        console.log('sessionStore: Login action payload:', action.payload);
        if (action.payload.refreshToken && action.payload.id) {
          state.refreshToken = action.payload.refreshToken;
          state.user = { id: action.payload.id };
          console.log('sessionStore: Set refreshToken and user:', {
            refreshToken: state.refreshToken,
            user: state.user,
          });
          console.log(
            'sessionStore: sessionStorage persist:root after login:',
            typeof window !== 'undefined' ? window.sessionStorage.getItem('persist:root') : null
          );
          setTimeout(() => {
            console.log(
              'sessionStore: Delayed sessionStorage persist:root after login:',
              typeof window !== 'undefined' ? window.sessionStorage.getItem('persist:root') : null
            );
          }, 1000);
        } else {
          console.warn('sessionStore: Incomplete login response:', action.payload);
        }
      }
    );
    builder.addMatcher(api.endpoints.resetPassword.matchFulfilled, (state) => {
      state.refreshToken = null;
      state.user = null;
      console.log('sessionStore: Reset password, cleared session');
    });
    builder.addMatcher(
      (action) => action.type === 'persist/REHYDRATE',
      // (state, action: PayloadAction<unknown>) => {
      //   console.log('sessionStore: Rehydration triggered, payload:', action.payload);
      // }
       (state, action: PayloadAction<unknown>) => {
    console.log('sessionStore: Rehydration completed');
    console.log('sessionStore: Rehydration triggered, payload:', action.payload);
    state.isRehydrated = true; // Set flag when rehydration completes
  }
    );
  },
});

export const { setSession, clearSession } = authSessionSlice.actions;
export const authSessionReducer = authSessionSlice.reducer;



