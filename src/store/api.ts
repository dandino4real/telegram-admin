// store/api.ts
"use client";

import { createApi } from "@reduxjs/toolkit/query/react";
import { DefaultResponse, REST_API_VERBS } from "./type";
import { axiosBaseQuery } from "./utils";
import { Admin } from "./types/admin";
import { CryptoUser } from "./types/cryptoUser";
import { ForexUser } from "./types/forexUser";
import {
  resetPasswordEmailPayload,
  resetPasswordOtpPayload,
  resetPasswordPayload,
  SignInPayload,
} from "./type";
import { setAccessToken } from "@/lib/authManager";
import { setSession } from "./sessionStore";
import { NewForexUser } from "./types/newForexUser";

export type UserStats = {
  totalApprovedUsers: number;
  totalPendingUsers: number;
  monthlyNewUsers: number;
  cryptoApproved: number;
  forexApproved: number;
  monthlyBreakdown: Array<{ month: string; crypto: number; forex: number }>;
};

const AUTH_URL = "api/auth";

export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery,
  tagTypes: [
    "Admins",
    "AdminProfile",
    "CryptoUsers",
    "ForexUsers",
    "UserStats",
    "NewForexUsers",
  ],

  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 30,
  endpoints: (builder) => ({
    login: builder.mutation<DefaultResponse, SignInPayload>({
      query: (data) => ({
        url: `/${AUTH_URL}/login`,
        method: REST_API_VERBS.POST,
        data,
      }),
      transformResponse: (response: DefaultResponse) => response,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          if (data.accessToken && data.id) {
            setAccessToken(data.accessToken);
            console.log("api: Access token set in memory");

            // Dispatch setSession with both refreshToken and user ID
            dispatch(
              setSession({
                refreshToken: data.refreshToken || "",
                user: { id: data.id },
              })
            );
          } else {
            console.warn("api: No accessToken in response");
          }
        } catch (error) {
          console.log("Login query error:", error);
        }
      },
    }),
    forgotPassword: builder.mutation<
      DefaultResponse,
      resetPasswordEmailPayload
    >({
      query: (data) => ({
        url: `/${AUTH_URL}/forgot-password`,
        method: REST_API_VERBS.POST,
        data,
      }),
      transformResponse: (response: DefaultResponse) => response,
    }),
    verifyOTP: builder.mutation<DefaultResponse, resetPasswordOtpPayload>({
      query: (data) => ({
        url: `/${AUTH_URL}/verify-otp`,
        method: REST_API_VERBS.POST,
        data,
      }),
      transformResponse: (response: DefaultResponse) => response,
    }),
    resetPassword: builder.mutation<
      DefaultResponse,
      { data: resetPasswordPayload }
    >({
      query: ({ data }) => ({
        url: `/${AUTH_URL}/reset-password`,
        method: REST_API_VERBS.POST,
        data,
      }),
      transformResponse: (response: DefaultResponse) => response,
    }),
    getAdmins: builder.query<
      { data: Admin[]; total: number },
      {
        page: number;
        limit: number;
        search?: string;
        status?: string;
        dateFilter?: string;
      }
    >({
      query: ({ page, limit, search, status, dateFilter }) => ({
        url: "/api/admin/all",
        method: REST_API_VERBS.GET,
        params: { page, limit, search, status, date: dateFilter },
      }),
      transformResponse: (response: {
        admins: { admins: Admin[]; total: number };
      }) => ({
        data: response.admins.admins,
        total: response.admins.total,
      }),
      providesTags: ["Admins"],
    }),
    updateAdmin: builder.mutation<
      Admin,
      { _id: string; updates: Partial<Admin> }
    >({
      query: ({ _id, updates }) => ({
        url: `/api/admin/edit/${_id}`,
        method: REST_API_VERBS.PATCH,
        data: updates,
      }),
      invalidatesTags: ["Admins"],
    }),
    deleteAdmin: builder.mutation<{ success: boolean }, string>({
      query: (_id) => ({
        url: `/api/admin/delete/${_id}`,
        method: REST_API_VERBS.DELETE,
      }),
      invalidatesTags: ["Admins"],
    }),
    createAdmin: builder.mutation<Admin, Partial<Admin>>({
      query: (data) => ({
        url: "/api/admin/create",
        method: REST_API_VERBS.POST,
        data,
      }),
      invalidatesTags: ["Admins"],
    }),
    getAdminProfile: builder.query<Admin, string>({
      query: (id) => ({
        url: `/api/admin/profile/${id}`,
        method: REST_API_VERBS.GET,
      }),
      transformResponse: (response: { admin: Admin }) => response.admin,
      providesTags: (result, error, id) => [{ type: "AdminProfile", id }],
      keepUnusedDataFor: 300,
    }),
    updateAdminProfile: builder.mutation<
      Admin,
      {
        id: string;
        updates: Partial<Admin> & {
          oldPassword?: string;
          newPassword?: string;
        };
      }
    >({
      query: ({ id, updates }) => ({
        url: `/api/admin/profile/${id}`,
        method: REST_API_VERBS.PATCH,
        data: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AdminProfile", id },
      ],
    }),
    getCryptoUsers: builder.query<
      {
        data: CryptoUser[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      },
      {
        page: number;
        limit: number;
        search?: string;
        status?: "pending" | "approved" | "rejected";
        platform?: "both" | "blofin" | "weex";
        country?: string;
        dateFrom?: string;
        dateTo?: string;
      }
    >({
      query: ({
        page,
        limit,
        search,
        status,
        platform,
        country,
        dateFrom,
        dateTo,
      }) => ({
        url: "/api/users/crypto",
        method: REST_API_VERBS.GET,
        params: {
          page,
          limit,
          search,
          status,
          platform,
          country,
          dateFrom,
          dateTo,
        },
      }),
      transformResponse: (response: {
        users: CryptoUser[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }) => ({
        data: response.users,
        meta: response.meta,
      }),
      providesTags: ["CryptoUsers"],
      keepUnusedDataFor: 5,
    }),
    approveCryptoUser: builder.mutation<
      { message: string; data: CryptoUser },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/api/users/crypto/${id}/approve`,
        method: REST_API_VERBS.PATCH,
      }),
      invalidatesTags: ["CryptoUsers", "UserStats"],
    }),
    rejectCryptoUser: builder.mutation<
      { message: string; data: CryptoUser },
      {
        id: string;
        admin: { name: string; email: string };
        rejectionReason: "no_affiliate_link" | "no_kyc";
      }
    >({
      query: ({ id, admin, rejectionReason }) => ({
        url: `/api/users/crypto/${id}/reject`,
        method: REST_API_VERBS.PATCH,
        data: { ...admin, rejectionReason },
      }),
      invalidatesTags: ["CryptoUsers", "UserStats"],
    }),
    deleteCryptoUser: builder.mutation<
      { message: string; user: CryptoUser },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/api/users/crypto/${id}`,
        method: REST_API_VERBS.DELETE,
      }),
      invalidatesTags: ["CryptoUsers", "UserStats"],
    }),
    getForexUsers: builder.query<
      {
        data: ForexUser[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      },
      {
        page: number;
        limit: number;
        search?: string;
        status?:
          | "pending"
          | "awaiting_approver"
          | "approved"
          | "rejected"
          | "all";
        startDate?: string;
        endDate?: string;
      }
    >({
      query: ({ page, limit, search, status, startDate, endDate }) => ({
        url: "/api/users/forex",
        method: REST_API_VERBS.GET,
        params: { page, limit, search, status, startDate, endDate },
      }),
      transformResponse: (
        response: { users: ForexUser[]; total: number },
        meta,
        arg
      ) => ({
        data: response.users,
        meta: {
          page: arg.page,
          limit: arg.limit,
          total: response.total,
          totalPages: Math.ceil(response.total / arg.limit),
        },
      }),
      providesTags: ["ForexUsers"],
      keepUnusedDataFor: 5,
    }),
    approveForexUser: builder.mutation<
      { message: string; data: ForexUser },
      { id: string; admin: { name: string; email: string } }
    >({
      query: ({ id, admin }) => ({
        url: `/api/users/forex/${id}/approve`,
        method: REST_API_VERBS.PATCH,
        data: admin,
      }),
      invalidatesTags: ["ForexUsers", "UserStats"],
    }),
    rejectForexUser: builder.mutation<
      { message: string; data: ForexUser },
      {
        id: string;
        admin: { name: string; email: string };
        rejectionReason: "no_affiliate_link" | "insufficient_deposit";
      }
    >({
      query: ({ id, admin, rejectionReason }) => ({
        url: `/api/users/forex/${id}/reject`,
        method: REST_API_VERBS.PATCH,
        data: { ...admin, rejectionReason },
      }),
      invalidatesTags: ["ForexUsers", "UserStats"],
    }),
    deleteForexUser: builder.mutation<
      { message: string; user: ForexUser },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/api/users/forex/${id}`,
        method: REST_API_VERBS.DELETE,
      }),
      invalidatesTags: ["ForexUsers", "UserStats"],
    }),
    getUserStats: builder.query<UserStats, void>({
      query: () => ({
        url: "/api/users/stats",
        method: REST_API_VERBS.GET,
      }),
      providesTags: [{ type: "UserStats" }],
      keepUnusedDataFor: 300,
    }),
    validateToken: builder.query<{ message: string }, void>({
      query: () => ({
        url: "/api/admin/validate",
        method: REST_API_VERBS.GET,
      }),
      transformResponse: (response: { message: string }) => response,
    }),
    logout: builder.mutation<DefaultResponse, void>({
      query: () => ({
        url: `/${AUTH_URL}/logout`,
        method: REST_API_VERBS.PATCH,
      }),
    }),

    getNewForexUsers: builder.query<
      {
        data: NewForexUser[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      },
      { page: number; limit: number; search?: string; status?: string; broker?: string; hasUnreadMessages?: 'true' | 'false' | 'all' }
    >({
      query: ({ page, limit, search, status,broker, hasUnreadMessages }) => ({
        url: "/api/new-forex-users",
        method: REST_API_VERBS.GET,
        params: { page, limit, search, status, broker, hasUnreadMessages: hasUnreadMessages === 'all' ? undefined : hasUnreadMessages },
      }),
      transformResponse: (
        response: { users: NewForexUser[]; total: number },
        meta,
        arg
      ) => ({
        data: response.users,
        meta: {
          page: arg.page,
          limit: arg.limit,
          total: response.total,
          totalPages: Math.ceil(response.total / arg.limit),
        },
      }),
      providesTags: ["NewForexUsers"],
    }),
    approveForexLoginId: builder.mutation<
      { message: string; user: NewForexUser },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/api/new-forex-users/loginid/${id}/approve`,
        method: REST_API_VERBS.PUT,
      }),
      invalidatesTags: ["NewForexUsers", "UserStats"],
    }),

    rejectForexLoginId: builder.mutation<
      { message: string; user: NewForexUser },
      {
        id: string;
        reason:
          | "deposit_missing"
          | "deposit_incomplete"
          | "duplicate_id"
          | "wrong_link"
          | "demo_account"
          | "other";
        customReason?: string;
      }
    >({
      query: ({ id, reason, customReason }) => ({
        url: `/api/new-forex-users/loginid/${id}/reject`,
        method: REST_API_VERBS.PUT,
        data: {
          reason,
          ...(customReason ? { customReason } : {}), // Only include if present
        },
      }),
      invalidatesTags: ["NewForexUsers", "UserStats"],
    }),

    approveForexAccountScreenshot: builder.mutation<
      { message: string; user: NewForexUser },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/api/new-forex-users/account-screenshot/${id}/approve`,
        method: REST_API_VERBS.PUT,
      }),
      invalidatesTags: ["NewForexUsers", "UserStats"],
    }),

    rejectForexAccountScreenshot: builder.mutation<
      { message: string; user: NewForexUser },
      {
        id: string;
        reason: "blurry_image" | "wrong_screenshot" | "other";
        customReason?: string;
      }
    >({
      query: ({ id, reason, customReason }) => ({
        url: `/api/new-forex-users/account-screenshot/${id}/reject`,
        method: REST_API_VERBS.PUT,
        data: {
          reason,
          ...(customReason ? { customReason } : {}), // include only if provided
        },
      }),
      invalidatesTags: ["NewForexUsers", "UserStats"],
    }),

    approveForexTestTradesScreenshot: builder.mutation<
      { message: string; user: NewForexUser },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/api/new-forex-users/testtrades-screenshot/${id}/approve`,
        method: REST_API_VERBS.PUT,
      }),
      invalidatesTags: ["NewForexUsers", "UserStats"],
    }),

    rejectForexTestTradesScreenshot: builder.mutation<
      { message: string; user: NewForexUser },
      {
        id: string;
        reason: "blurry_image" | "wrong_screenshot" | "other";
        customReason?: string;
      }
    >({
      query: ({ id, reason, customReason }) => ({
        url: `/api/new-forex-users/testtrades-screenshot/${id}/reject`,
        method: REST_API_VERBS.PUT,
        data: {
          reason,
          ...(customReason ? { customReason } : {}), // include only if provided
        },
      }),
      invalidatesTags: ["NewForexUsers", "UserStats"],
    }),

    deleteNewForexUser: builder.mutation<{ message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/api/new-forex-users/${id}`,
        method: REST_API_VERBS.DELETE,
      }),
      invalidatesTags: ["NewForexUsers", "UserStats"],
    }),

    getChatMessges: builder.query<
      {
        messages: Array<{
          sender: "user" | "admin";
          user: "User" | "Admin";
          text: string;
          timestamp: string;
        }>;
      },
      { telegramId: string }
    >({
      query: ({ telegramId }) => ({
        url: `/api/new-forex-users/chat/${telegramId}/messages`,
        method: REST_API_VERBS.GET,
      }),
      transformResponse: (response: {
        messages: Array<{
          sender: "user" | "admin";
          user: "User" | "Admin";
          text: string;
          timestamp: string;
        }>;
      }) => response,
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
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
  useValidateTokenQuery,
  useLogoutMutation,
  useGetNewForexUsersQuery,
  useApproveForexLoginIdMutation,
  useRejectForexLoginIdMutation,
  useApproveForexAccountScreenshotMutation,
  useRejectForexAccountScreenshotMutation,
  useApproveForexTestTradesScreenshotMutation,
  useRejectForexTestTradesScreenshotMutation,
  useDeleteNewForexUserMutation,
  useGetChatMessgesQuery,
} = api;
