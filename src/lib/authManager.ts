// src/lib/authManager.ts
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  console.log("authManager: Access token set:", !!token);
};

export const getAccessToken = () => {
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
  console.log("authManager: Access token cleared");
};
