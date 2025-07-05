
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setCookie } from 'cookies-next';

export interface AuthState {
  accessToken: string | null;
  adminId: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  adminId: typeof window !== 'undefined' ? localStorage.getItem('adminId') : null,
  isLoggedIn: typeof window !== 'undefined' ? !!localStorage.getItem('adminId') : false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string | null; adminId: string | null }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.adminId = action.payload.adminId;
      state.isLoggedIn = !!action.payload.accessToken && !!action.payload.adminId;
      if (action.payload.adminId && typeof window !== 'undefined') {
        localStorage.setItem('adminId', action.payload.adminId);
        console.log('authSlice: adminId set in localStorage:', action.payload.adminId);
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.adminId = null;
      state.isLoggedIn = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminId');
        setCookie('refreshToken', '', { path: '/', maxAge: 0 });
        console.log('authSlice: adminId removed from localStorage, refreshToken cookie cleared');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;