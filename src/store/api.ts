
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { setCookie} from 'cookies-next';
import { Mutex } from 'async-mutex';
import { setCredentials, logout } from './slices/authSlice';
import { Admin } from './types/admin';
import { CryptoUser } from './types/cryptoUser';
import type { RootState } from './index';
import { ForexUser } from './types/forexUser';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.API_URL || '/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const adminId = typeof window !== 'undefined' ? localStorage.getItem('adminId') : null
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh-token',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: {},
          },
          api,
          extraOptions
        );
        const refreshData = refreshResult.data as { accessToken?: string; refreshToken?: string };
        if (refreshData?.accessToken && adminId) {
          api.dispatch(setCredentials({ accessToken: refreshData.accessToken, adminId }));
          if (refreshData.refreshToken) {
            setCookie('refreshToken', refreshData.refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 7 * 24 * 60 * 60,
              path: '/',
            });
          }
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export type UserStats = {
  totalApprovedUsers: number;
  totalPendingUsers: number;
  monthlyNewUsers: number;
  cryptoApproved: number;
  forexApproved: number;
  monthlyBreakdown: Array<{ month: string; crypto: number; forex: number }>;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Admins', 'AdminProfile', 'CryptoUsers', 'ForexUsers', 'UserStats'],
  endpoints: (builder) => ({
    login: builder.mutation<{ accessToken: string; id: string }, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ accessToken: data.accessToken, adminId: data.id }));
        } catch (error) {
          console.log('api: Login failed:', error);
        }
      },
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    verifyOTP: builder.mutation<{ message: string }, { email: string; otp: string }>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, { email: string; newPassword: string }>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    getAdmins: builder.query<
      { data: Admin[]; total: number },
      { page: number; limit: number; search?: string; status?: string; dateFilter?: string }
    >({
      query: ({ page, limit, search, status, dateFilter }) => ({
        url: '/admin/all',
        params: { page, limit, search, status, date: dateFilter },
      }),
      transformResponse: (response: { admins: { admins: Admin[]; total: number } }) => ({
        data: response.admins.admins,
        total: response.admins.total,
      }),
      providesTags: ['Admins'],
    }),
    updateAdmin: builder.mutation<Admin, { _id: string; updates: Partial<Admin> }>({
      query: ({ _id, updates }) => ({
        url: `/admin/edit/${_id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['Admins'],
    }),
    deleteAdmin: builder.mutation<{ success: boolean }, string>({
      query: (_id) => ({
        url: `/admin/delete/${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admins'],
    }),
    createAdmin: builder.mutation<Admin, Partial<Admin>>({
      query: (body) => ({
        url: '/admin/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Admins'],
    }),
    getAdminProfile: builder.query<Admin, string>({
      query: (id) => ({
        url: `/admin/profile/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: { admin: Admin }) => response.admin,
      providesTags: (result, error, id) => [{ type: 'AdminProfile', id }],
      keepUnusedDataFor: 300,
    }),
    updateAdminProfile: builder.mutation<
      Admin,
      { id: string; updates: Partial<Admin> & { oldPassword?: string; newPassword?: string } }
    >({
      query: ({ id, updates }) => ({
        url: `/admin/profile/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AdminProfile', id }],
    }),
    getCryptoUsers: builder.query<
      {
        data: CryptoUser[];
        meta: { page: number; limit: number; total: number; totalPages: number };
      },
      {
        page: number;
        limit: number;
        search?: string;
        status?: 'pending' | 'approved' | 'rejected';
        platform?: 'bybit' | 'blofin';
        country?: string;
        dateFrom?: string;
        dateTo?: string;
      }
    >({
      query: ({ page, limit, search, status, platform, country, dateFrom, dateTo }) => ({
        url: 'users/crypto',
        params: { page, limit, search, status, platform, country, dateFrom, dateTo },
      }),
      transformResponse: (response: {
        users: CryptoUser[];
        meta: { page: number; limit: number; total: number; totalPages: number };
      }) => ({
        data: response.users,
        meta: response.meta,
      }),
      providesTags: ['CryptoUsers'],
    }),
    approveCryptoUser: builder.mutation<{ message: string; data: CryptoUser }, { id: string }>({
      query: ({ id }) => ({
        url: `/users/crypto/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['CryptoUsers', 'UserStats'],
    }),
    rejectCryptoUser: builder.mutation<{ message: string; data: CryptoUser }, { id: string }>({
      query: ({ id }) => ({
        url: `/users/crypto/${id}/reject`,
        method: 'PATCH',
      }),
      invalidatesTags: ['CryptoUsers', 'UserStats'],
    }),
    deleteCryptoUser: builder.mutation<{ message: string; user: CryptoUser }, { id: string }>({
      query: ({ id }) => ({
        url: `/users/crypto/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CryptoUsers', 'UserStats'],
    }),
    getForexUsers: builder.query<
      {
        data: ForexUser[];
        meta: { page: number; limit: number; total: number; totalPages: number };
      },
      {
        page: number;
        limit: number;
        search?: string;
        status?: 'pending' | 'approved' | 'rejected';
        startDate?: string;
        endDate?: string;
      }
    >({
      query: ({ page, limit, search, status, startDate, endDate }) => ({
        url: '/users/forex',
        params: { page, limit, search, status, startDate, endDate },
      }),
      transformResponse: (response: { users: ForexUser[]; total: number }, meta, arg) => ({
        data: response.users,
        meta: {
          page: arg.page,
          limit: arg.limit,
          total: response.total,
          totalPages: Math.ceil(response.total / arg.limit),
        },
      }),
      providesTags: ['ForexUsers'],
    }),
    approveForexUser: builder.mutation<
      { message: string; data: ForexUser },
      { id: string; admin: { name: string; email: string } }
    >({
      query: ({ id, admin }) => ({
        url: `/users/forex/${id}/approve`,
        method: 'PATCH',
        body: admin,
      }),
      invalidatesTags: ['ForexUsers', 'UserStats'],
    }),
    rejectForexUser: builder.mutation<
      { message: string; data: ForexUser },
      { id: string; admin: { name: string; email: string } }
    >({
      query: ({ id, admin }) => ({
        url: `/users/forex/${id}/reject`,
        method: 'PATCH',
        body: admin,
      }),
      invalidatesTags: ['ForexUsers', 'UserStats'],
    }),
    deleteForexUser: builder.mutation<{ message: string; user: ForexUser }, { id: string }>({
      query: ({ id }) => ({
        url: `/users/forex/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ForexUsers', 'UserStats'],
    }),
    getUserStats: builder.query<UserStats, void>({
      query: () => ({
        url: '/users/stats',
        method: 'GET',
      }),
      providesTags: [{ type: 'UserStats' }],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation, // New export
  useGetAdminsQuery,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useCreateAdminMutation,
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useGetCryptoUsersQuery,
  useApproveCryptoUserMutation,
  useRejectCryptoUserMutation,
  useDeleteCryptoUserMutation,
  useGetForexUsersQuery,
  useApproveForexUserMutation,
  useRejectForexUserMutation,
  useDeleteForexUserMutation,
  useGetUserStatsQuery,
} = api;