import { tokenManager } from "./tokenManager";

const BASE_URL = "http://localhost:3000/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${tokenManager.getAccessToken()}`,
});

export const executePost = async (endpoint: string = "", body?: string) => {
  let res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: getHeaders(),
    body,
  });

  // If token expired, try to refresh
  if (res.status === 401) {
    const refreshToken = tokenManager.getRefreshToken();
    if (refreshToken) {
      const refreshRes = await fetch(`${BASE_URL}/user/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        tokenManager.setAccessToken(refreshData.accessToken);

        // Retry original request with new token
        res = await fetch(`${BASE_URL}/${endpoint}`, {
          method: "POST",
          headers: getHeaders(),
          body,
        });
      }
    }
  }

  const data = await res.json();
  console.log(">> data", data);
  return data;
};

export const executeGet = (endpoint: string = "") => {
  return fetch(`${BASE_URL}/${endpoint}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.json();
  });
};
