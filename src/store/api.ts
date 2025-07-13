// "use client";

// import { createApi } from "@reduxjs/toolkit/query/react";
// import { DefaultResponse, REST_API_VERBS } from "./type";
// import { axiosBaseQuery } from "./utils";
// import { Admin } from "./types/admin";
// import { CryptoUser } from "./types/cryptoUser";
// import { ForexUser } from "./types/forexUser";
// import {
//   resetPasswordEmailPayload,
//   resetPasswordOtpPayload,
//   resetPasswordPayload,
//   SignInPayload,
// } from "./type";
// import { setAccessToken } from "@/lib/authManager";

// export type UserStats = {
//   totalApprovedUsers: number;
//   totalPendingUsers: number;
//   monthlyNewUsers: number;
//   cryptoApproved: number;
//   forexApproved: number;
//   monthlyBreakdown: Array<{ month: string; crypto: number; forex: number }>;
// };

// const AUTH_URL = "auth";

// // Define the API type explicitly
// // import type { State } from './utils';

// export const api = createApi({
//   reducerPath: "api",
//   baseQuery: axiosBaseQuery,
//   tagTypes: [
//     "Admins",
//     "AdminProfile",
//     "CryptoUsers",
//     "ForexUsers",
//     "UserStats",
//   ],
//   endpoints: (builder) => ({
//     login: builder.mutation<DefaultResponse, SignInPayload>({
//       query: (data) => ({
//         url: `/${AUTH_URL}/login`,
//         method: REST_API_VERBS.POST,
//         data,
//       }),
//       transformResponse: (response: DefaultResponse) => response,
//       onQueryStarted: async (_, { queryFulfilled }) => {
//         try {
//           const { data } = await queryFulfilled;
//           console.log("api: Login response:", data);
//           console.log("api: accessToken:", data.accessToken);
//           console.log("api: refreshToken:", data.refreshToken);
//           console.log("api: id:", data.id);

//           if (data.accessToken) {
//             setAccessToken(data.accessToken);
//             console.log("api: Access token set in memory");
//           } else {
//             console.warn("api: No accessToken in response");
//           }
//         } catch (error) {
//           console.log("Login query error:", error);
//         }
//       },
//     }),
//     forgotPassword: builder.mutation<
//       DefaultResponse,
//       resetPasswordEmailPayload
//     >({
//       query: (data) => ({
//         url: `/${AUTH_URL}/forgot-password`,
//         method: REST_API_VERBS.POST,
//         data,
//       }),
//       transformResponse: (response: DefaultResponse) => response,
//     }),
//     verifyOTP: builder.mutation<DefaultResponse, resetPasswordOtpPayload>({
//       query: (data) => ({
//         url: `/${AUTH_URL}/verify-otp`,
//         method: REST_API_VERBS.POST,
//         data,
//       }),
//       transformResponse: (response: DefaultResponse) => response,
//     }),
//     resetPassword: builder.mutation<
//       DefaultResponse,
//       { data: resetPasswordPayload }
//     >({
//       query: ({ data}) => ({
//         url: `/${AUTH_URL}/reset-password`,
//         method: REST_API_VERBS.POST,
//         data,
//       }),
//       transformResponse: (response: DefaultResponse) => response,
//     }),
//     getAdmins: builder.query<
//       { data: Admin[]; total: number },
//       {
//         page: number;
//         limit: number;
//         search?: string;
//         status?: string;
//         dateFilter?: string;
//       }
//     >({
//       query: ({ page, limit, search, status, dateFilter }) => ({
//         url: "/admin/all",
//         method: REST_API_VERBS.GET,
//         params: { page, limit, search, status, date: dateFilter },
//       }),
//       transformResponse: (response: {
//         admins: { admins: Admin[]; total: number };
//       }) => ({
//         data: response.admins.admins,
//         total: response.admins.total,
//       }),
//       providesTags: ["Admins"],
//     }),
//     updateAdmin: builder.mutation<
//       Admin,
//       { _id: string; updates: Partial<Admin> }
//     >({
//       query: ({ _id, updates }) => ({
//         url: `/admin/edit/${_id}`,
//         method: REST_API_VERBS.PATCH,
//         data: updates,
//       }),
//       invalidatesTags: ["Admins"],
//     }),
//     deleteAdmin: builder.mutation<{ success: boolean }, string>({
//       query: (_id) => ({
//         url: `/admin/delete/${_id}`,
//         method: REST_API_VERBS.DELETE,
//       }),
//       invalidatesTags: ["Admins"],
//     }),
//     createAdmin: builder.mutation<Admin, Partial<Admin>>({
//       query: (data) => ({
//         url: "/admin/create",
//         method: REST_API_VERBS.POST,
//         data,
//       }),
//       invalidatesTags: ["Admins"],
//     }),
//     getAdminProfile: builder.query<Admin, string>({
//       query: (id) => ({
//         url: `/admin/profile/${id}`,
//         method: REST_API_VERBS.GET,
//       }),
//       transformResponse: (response: { admin: Admin }) => response.admin,
//       providesTags: (result, error, id) => [{ type: "AdminProfile", id }],
//       keepUnusedDataFor: 300,
//     }),
//     updateAdminProfile: builder.mutation<
//       Admin,
//       {
//         id: string;
//         updates: Partial<Admin> & {
//           oldPassword?: string;
//           newPassword?: string;
//         };
//       }
//     >({
//       query: ({ id, updates }) => ({
//         url: `/admin/profile/${id}`,
//         method: REST_API_VERBS.PATCH,
//         data: updates,
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         { type: "AdminProfile", id },
//       ],
//     }),
//     getCryptoUsers: builder.query<
//       {
//         data: CryptoUser[];
//         meta: {
//           page: number;
//           limit: number;
//           total: number;
//           totalPages: number;
//         };
//       },
//       {
//         page: number;
//         limit: number;
//         search?: string;
//         status?: "pending" | "approved" | "rejected";
//         platform?: "bybit" | "blofin";
//         country?: string;
//         dateFrom?: string;
//         dateTo?: string;
//       }
//     >({
//       query: ({
//         page,
//         limit,
//         search,
//         status,
//         platform,
//         country,
//         dateFrom,
//         dateTo,
//       }) => ({
//         url: "/users/crypto",
//         method: REST_API_VERBS.GET,
//         params: {
//           page,
//           limit,
//           search,
//           status,
//           platform,
//           country,
//           dateFrom,
//           dateTo,
//         },
//       }),
//       transformResponse: (response: {
//         users: CryptoUser[];
//         meta: {
//           page: number;
//           limit: number;
//           total: number;
//           totalPages: number;
//         };
//       }) => ({
//         data: response.users,
//         meta: response.meta,
//       }),
//       providesTags: ["CryptoUsers"],
//     }),
//     approveCryptoUser: builder.mutation<
//       { message: string; data: CryptoUser },
//       { id: string }
//     >({
//       query: ({ id }) => ({
//         url: `/users/crypto/${id}/approve`,
//         method: REST_API_VERBS.PATCH,
//       }),
//       invalidatesTags: ["CryptoUsers", "UserStats"],
//     }),
//     rejectCryptoUser: builder.mutation<
//       { message: string; data: CryptoUser },
//       { id: string }
//     >({
//       query: ({ id }) => ({
//         url: `/users/crypto/${id}/reject`,
//         method: REST_API_VERBS.PATCH,
//       }),
//       invalidatesTags: ["CryptoUsers", "UserStats"],
//     }),
//     deleteCryptoUser: builder.mutation<
//       { message: string; user: CryptoUser },
//       { id: string }
//     >({
//       query: ({ id }) => ({
//         url: `/users/crypto/${id}`,
//         method: REST_API_VERBS.DELETE,
//       }),
//       invalidatesTags: ["CryptoUsers", "UserStats"],
//     }),
//     getForexUsers: builder.query<
//       {
//         data: ForexUser[];
//         meta: {
//           page: number;
//           limit: number;
//           total: number;
//           totalPages: number;
//         };
//       },
//       {
//         page: number;
//         limit: number;
//         search?: string;
//         status?: "pending" | "approved" | "rejected";
//         startDate?: string;
//         endDate?: string;
//       }
//     >({
//       query: ({ page, limit, search, status, startDate, endDate }) => ({
//         url: "/users/forex",
//         method: REST_API_VERBS.GET,
//         params: { page, limit, search, status, startDate, endDate },
//       }),
//       transformResponse: (
//         response: { users: ForexUser[]; total: number },
//         meta,
//         arg
//       ) => ({
//         data: response.users,
//         meta: {
//           page: arg.page,
//           limit: arg.limit,
//           total: response.total,
//           totalPages: Math.ceil(response.total / arg.limit),
//         },
//       }),
//       providesTags: ["ForexUsers"],
//     }),
//     approveForexUser: builder.mutation<
//       { message: string; data: ForexUser },
//       { id: string; admin: { name: string; email: string } }
//     >({
//       query: ({ id, admin }) => ({
//         url: `/users/forex/${id}/approve`,
//         method: REST_API_VERBS.PATCH,
//         data: admin,
//       }),
//       invalidatesTags: ["ForexUsers", "UserStats"],
//     }),
//     rejectForexUser: builder.mutation<
//       { message: string; data: ForexUser },
//       { id: string; admin: { name: string; email: string } }
//     >({
//       query: ({ id, admin }) => ({
//         url: `/users/forex/${id}/reject`,
//         method: REST_API_VERBS.PATCH,
//         data: admin,
//       }),
//       invalidatesTags: ["ForexUsers", "UserStats"],
//     }),
//     deleteForexUser: builder.mutation<
//       { message: string; user: ForexUser },
//       { id: string }
//     >({
//       query: ({ id }) => ({
//         url: `/users/forex/${id}`,
//         method: REST_API_VERBS.DELETE,
//       }),
//       invalidatesTags: ["ForexUsers", "UserStats"],
//     }),
//     getUserStats: builder.query<UserStats, void>({
//       query: () => ({
//         url: "/users/stats",
//         method: REST_API_VERBS.GET,
//       }),
//       providesTags: [{ type: "UserStats" }],
//       keepUnusedDataFor: 300,
//     }),
//     validateToken: builder.query<{ message: string }, void>({
//       query: () => ({
//         url: "/admin/validate",
//         method: REST_API_VERBS.GET,
//       }),
//       transformResponse: (response: { message: string }) => response,
//     }),

//     logout: builder.mutation<DefaultResponse, void>({
//       query: () => ({
//         url: `/${AUTH_URL}/logout`,
//         method: REST_API_VERBS.POST,
//       }),
//     }),
//   }),
// });

// export const {
//   useLoginMutation,
//   useForgotPasswordMutation,
//   useVerifyOTPMutation,
//   useResetPasswordMutation,
//   useGetAdminsQuery,
//   useUpdateAdminMutation,
//   useDeleteAdminMutation,
//   useCreateAdminMutation,
//   useGetAdminProfileQuery,
//   useUpdateAdminProfileMutation,
//   useGetCryptoUsersQuery,
//   useApproveCryptoUserMutation,
//   useRejectCryptoUserMutation,
//   useDeleteCryptoUserMutation,
//   useGetForexUsersQuery,
//   useApproveForexUserMutation,
//   useRejectForexUserMutation,
//   useDeleteForexUserMutation,
//   useGetUserStatsQuery,
//   useValidateTokenQuery,
//   useLogoutMutation,
// } = api;











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

export type UserStats = {
  totalApprovedUsers: number;
  totalPendingUsers: number;
  monthlyNewUsers: number;
  cryptoApproved: number;
  forexApproved: number;
  monthlyBreakdown: Array<{ month: string; crypto: number; forex: number }>;
};

const AUTH_URL = "auth";

export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery,
  tagTypes: [
    "Admins",
    "AdminProfile",
    "CryptoUsers",
    "ForexUsers",
    "UserStats",
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
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
        
          if (data.accessToken) {
            setAccessToken(data.accessToken);
            console.log("api: Access token set in memory");
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
        url: "/admin/all",
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
        url: `/admin/edit/${_id}`,
        method: REST_API_VERBS.PATCH,
        data: updates,
      }),
      invalidatesTags: ["Admins"],
    }),
    deleteAdmin: builder.mutation<{ success: boolean }, string>({
      query: (_id) => ({
        url: `/admin/delete/${_id}`,
        method: REST_API_VERBS.DELETE,
      }),
      invalidatesTags: ["Admins"],
    }),
    createAdmin: builder.mutation<Admin, Partial<Admin>>({
      query: (data) => ({
        url: "/admin/create",
        method: REST_API_VERBS.POST,
        data,
      }),
      invalidatesTags: ["Admins"],
    }),
    getAdminProfile: builder.query<Admin, string>({
      query: (id) => ({
        url: `/admin/profile/${id}`,
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
        url: `/admin/profile/${id}`,
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
        platform?: "bybit" | "blofin";
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
        url: "/users/crypto",
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
        url: `/users/crypto/${id}/approve`,
        method: REST_API_VERBS.PATCH,
      }),
      invalidatesTags: ["CryptoUsers", "UserStats"],
    }),
    rejectCryptoUser: builder.mutation<
      { message: string; data: CryptoUser },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/users/crypto/${id}/reject`,
        method: REST_API_VERBS.PATCH,
      }),
      invalidatesTags: ["CryptoUsers", "UserStats"],
    }),
    deleteCryptoUser: builder.mutation<
      { message: string; user: CryptoUser },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/users/crypto/${id}`,
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
        status?: "pending" | "approved" | "rejected";
        startDate?: string;
        endDate?: string;
      }
    >({
      query: ({ page, limit, search, status, startDate, endDate }) => ({
        url: "/users/forex",
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
        url: `/users/forex/${id}/approve`,
        method: REST_API_VERBS.PATCH,
        data: admin,
      }),
      invalidatesTags: ["ForexUsers", "UserStats"],
    }),
    rejectForexUser: builder.mutation<
      { message: string; data: ForexUser },
      { id: string; admin: { name: string; email: string }; rejectionReason: 'no_affiliate_link' | 'insufficient_deposit' }
    >({
      query: ({ id, admin, rejectionReason }) => ({
        url: `/users/forex/${id}/reject`,
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
        url: `/users/forex/${id}`,
        method: REST_API_VERBS.DELETE,
      }),
      invalidatesTags: ["ForexUsers", "UserStats"],
    }),
    getUserStats: builder.query<UserStats, void>({
      query: () => ({
        url: "/users/stats",
        method: REST_API_VERBS.GET,
      }),
      providesTags: [{ type: "UserStats" }],
      keepUnusedDataFor: 300,
    }),
    validateToken: builder.query<{ message: string }, void>({
      query: () => ({
        url: "/admin/validate",
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
} = api;










