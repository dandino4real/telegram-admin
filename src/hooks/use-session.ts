

'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { getCookie, setCookie } from 'cookies-next';
import { setCredentials, logout } from '@/store/slices/authSlice';

interface Session {
  adminId: string | null;
  isLoggedIn: boolean;
  isRestoring: boolean;
}

export const useSession = (): Session => {
  const dispatch = useDispatch();
  const { adminId, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const refreshToken = getCookie('refreshToken', { path: '/' });
      const storedAdminId = typeof window !== 'undefined' ? localStorage.getItem('adminId') : null;
      console.log('useSession: refreshToken from cookie:', refreshToken);
      console.log('useSession: storedAdminId from localStorage:', storedAdminId);

      if (refreshToken && storedAdminId && !isLoggedIn) {
        try {
          console.log('useSession: Attempting to restore session...');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({}),
          });
          console.log('useSession: Refresh token request sent with:', {
            url: `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            credentials: 'include',
          });
          console.log('useSession: Refresh token response status:', response.status);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
          }
          const data = await response.json();
          console.log('useSession: Refresh token response data:', data);
          if (data.accessToken) {
            dispatch(setCredentials({ accessToken: data.accessToken, adminId: storedAdminId }));
            if (data.refreshToken) {
              setCookie('refreshToken', data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60,
                path: '/',
              });
              console.log('useSession: Refresh token updated in cookie:', data.refreshToken);
            }
            console.log('useSession: Session restored successfully');
          } else {
            console.log('useSession: Invalid refresh token response, logging out');
            dispatch(logout());
          }
        } catch (error) {
          console.error('useSession: Session restoration failed:', error);
          dispatch(logout());
        }
      } else {
        console.log('useSession: No refreshToken, no storedAdminId, or already logged in', {
          refreshToken,
          storedAdminId,
          isLoggedIn,
        });
        if (!storedAdminId && !isLoggedIn) {
          dispatch(logout());
        }
      }
      setIsRestoring(false);
    };

    restoreSession();
  }, [dispatch, isLoggedIn]);

  return {
    adminId,
    isLoggedIn,
    isRestoring,
  };
};