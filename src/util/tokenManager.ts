export const tokenManager = {
  setAccessToken: (token: string) => {
    localStorage.setItem("accessToken", token);
  },

  setRefreshToken: (token: string) => {
    localStorage.setItem("refreshToken", token);
  },

  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken: () => {
    return localStorage.getItem("refreshToken");
  },

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  hasTokens: () => {
    return (
      !!localStorage.getItem("accessToken") &&
      !!localStorage.getItem("refreshToken")
    );
  },
};
