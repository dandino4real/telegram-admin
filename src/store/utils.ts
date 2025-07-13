


// // src/store/utils.ts
// import axios, { AxiosError, AxiosRequestConfig } from 'axios';
// import { BaseQueryFn, BaseQueryApi } from '@reduxjs/toolkit/query';
// import { getAccessToken, setAccessToken } from '@/lib/authManager';
// import { setSession, clearSession } from './sessionStore';

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

// export type State = {
//   authSession: {
//     refreshToken: string | null;
//     user: { id: string } | null;
//   };
// };

// export type Dispatch = (action: unknown) => void;

// // Define a type for backend error responses
// export interface ApiError {
//   message: string;
// }

// export const createAxiosInstance = (getState: () => State, dispatch: Dispatch) => {
//   const instance = axios.create({ baseURL: BASE_URL });

//   let isRefreshing = false;
//   let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = [];

//   const processQueue = (error: unknown, token: string | null = null) => {
//     failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
//     failedQueue = [];
//   };

//   instance.interceptors.request.use(
//     async (config) => {
//       const token = getAccessToken();
//       const refreshToken = getState().authSession.refreshToken;
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       if (refreshToken) {
//         config.headers['x-refresh-token'] = refreshToken;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   instance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config;

//       if (error.response?.status === 401 && !originalRequest._retry) {
//         if (isRefreshing) {
//           return new Promise((resolve, reject) => {
//             failedQueue.push({ resolve, reject });
//           })
//             .then(() => {
//               originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;
//               return instance(originalRequest);
//             })
//             .catch((err) => Promise.reject(err));
//         }

//         originalRequest._retry = true;
//         isRefreshing = true;

//         try {
//           const refreshToken = getState().authSession.refreshToken;
//           if (!refreshToken) throw new Error('No refresh token available');

//           const response = await axios.post(`${BASE_URL}/api/auth/refresh-token`, {
//             refreshToken,
//           });

//           const { accessToken, refreshToken: newRefreshToken, id } = response.data;

//           if (!accessToken || !id) {
//             throw new Error('Invalid refresh token response');
//           }

//           setAccessToken(accessToken);
//           dispatch(setSession({ refreshToken: newRefreshToken || refreshToken, user: { id } }));

//           originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//           processQueue(null, accessToken);

//           return instance(originalRequest);
//         } catch (refreshErr) {
//           processQueue(refreshErr);
//           dispatch(clearSession());
//           setAccessToken(null);
//           if (typeof window !== 'undefined') {
//             console.log('Redirecting to /login due to failed token refresh');
//             window.location.href = '/login';
//           }
//           return Promise.reject(refreshErr);
//         } finally {
//           isRefreshing = false;
//         }
//       }

//       return Promise.reject(error);
//     }
//   );

//   return instance;
// };

// export const axiosBaseQuery: BaseQueryFn<
//   AxiosRequestConfig,
//   unknown,
//   { status?: number; data?: ApiError | string }
// > = async (args, { getState, dispatch }: BaseQueryApi) => {
//   const instance = createAxiosInstance(getState as () => State, dispatch as Dispatch);
//   try {
//     const result = await instance(args);
//     return { data: result?.data };
//   } catch (axiosError) {
//     const err = axiosError as AxiosError;
//     return {
//       error: {
//         status: err?.response?.status,
//         data: (err?.response?.data as ApiError) || err?.message,
//       },
//     };
//   }
// };





import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { BaseQueryFn, BaseQueryApi } from '@reduxjs/toolkit/query';
import { getAccessToken, setAccessToken } from '@/lib/authManager';
import { setSession, clearSession } from './sessionStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export type State = {
  authSession: {
    refreshToken: string | null;
    user: { id: string } | null;
    isRehydrated: boolean; // Make sure this matches your session state
  };
};

export type Dispatch = (action: unknown) => void;

export interface ApiError {
  message: string;
}

export const createAxiosInstance = (getState: () => State, dispatch: Dispatch) => {
  const instance = axios.create({ baseURL: BASE_URL });

  let isRefreshing = false;
  let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = [];

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
    failedQueue = [];
  };

  instance.interceptors.request.use(
    async (config) => {
      const token = getAccessToken();
      const refreshToken = getState().authSession.refreshToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (refreshToken) {
        config.headers['x-refresh-token'] = refreshToken;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        // ADDED: Wait for Redux state rehydration before proceeding
        if (!getState().authSession.isRehydrated) {
          await new Promise<void>(resolve => {
            const checkRehydration = () => {
              if (getState().authSession.isRehydrated) {
                resolve();
              } else {
                setTimeout(checkRehydration, 100);
              }
            };
            checkRehydration();
          });
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = getState().authSession.refreshToken;
          if (!refreshToken) throw new Error('No refresh token available');

          const response = await axios.post(`${BASE_URL}/api/auth/refresh-token`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken, id } = response.data;

          if (!accessToken || !id) {
            throw new Error('Invalid refresh token response');
          }

          setAccessToken(accessToken);
          dispatch(setSession({ refreshToken: newRefreshToken || refreshToken, user: { id } }));

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);

          return instance(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr);
          dispatch(clearSession());
          setAccessToken(null);
          if (typeof window !== 'undefined') {
            console.log('Redirecting to /login due to failed token refresh');
            window.location.href = '/login';
          }
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const axiosBaseQuery: BaseQueryFn<
  AxiosRequestConfig,
  unknown,
  { status?: number; data?: ApiError | string }
> = async (args, { getState, dispatch }: BaseQueryApi) => {
  const instance = createAxiosInstance(getState as () => State, dispatch as Dispatch);
  try {
    const result = await instance(args);
    return { data: result?.data };
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    return {
      error: {
        status: err?.response?.status,
        data: (err?.response?.data as ApiError) || err?.message,
      },
    };
  }
};