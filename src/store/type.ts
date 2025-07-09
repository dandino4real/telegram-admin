

// src/types/type.ts
export interface DefaultResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
  id?: string; 
}

export enum REST_API_VERBS {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}


export interface ApiError {
  message: string;
}


export interface SignInPayload {
  email: string;
  password: string;
}

export interface resetPasswordEmailPayload {
  email: string;
}

export interface resetPasswordOtpPayload {
  email: string;
  otp: string;
}

export interface resetPasswordPayload {
  email: string;
  newPassword: string;
}