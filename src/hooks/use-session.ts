// "use client";

// import { useSelector } from "react-redux";
// import { RootState } from "@/store";

// export const useSession = () => {
//   const { adminId, isLoggedIn } = useSelector((state: RootState) => state.auth);
//   return {
//     adminId,
//     isLoggedIn,
//   };
// };


// 'use client';

// import { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '@/store';
// import { getCookie, setCookie } from 'cookies-next';
// import { setCredentials, logout } from '@/store/slices/authSlice';

// interface Session {
//   adminId: string | null;
//   isLoggedIn: boolean;
//   isRestoring: boolean;
// }

// export const useSession = (): Session => {
//   const dispatch = useDispatch();
//   const { adminId, isLoggedIn } = useSelector((state: RootState) => state.auth);
//   const [isRestoring, setIsRestoring] = useState(false);

//   useEffect(() => {
//     const restoreSession = async () => {
//       const refreshToken = getCookie('refreshToken');
//       if (refreshToken && !isLoggedIn) {
//         setIsRestoring(true);
//         try {
//           const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             credentials: 'include',
//             body: JSON.stringify({ refreshToken }),
//           });
//           const data = await response.json();
//           if (data.accessToken && data.id) {
//             dispatch(setCredentials({ accessToken: data.accessToken, adminId: data.id }));
//             setCookie('refreshToken', data.refreshToken || refreshToken, {
//               httpOnly: true,
//               secure: process.env.NODE_ENV === 'production',
//               sameSite: 'strict',
//               maxAge: 7 * 24 * 60 * 60,
//             });
//           } else {
//             dispatch(logout());
//             setCookie('refreshToken', '');
//           }
//         } catch (error) {
//           console.error('Session restoration failed:', error);
//           dispatch(logout());
//           setCookie('refreshToken', '');
//         } finally {
//           setIsRestoring(false);
//         }
//       }
//     };

//     restoreSession();
//   }, [dispatch, isLoggedIn]);

//   return {
//     adminId,
//     isLoggedIn,
//     isRestoring,
//   };
// };


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