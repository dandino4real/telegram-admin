

// src/lib/authManager.ts
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  console.log('authManager: Access token set:', !!accessToken);
};

export const getAccessToken = () => {
  console.log('authManager: Getting access token:', accessToken);
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
  console.log('authManager: Access token cleared');
};


// lib/authManager.ts
export const clearAllTokens = () => {
  accessToken = null;
  console.log('authManager: All tokens cleared');
};