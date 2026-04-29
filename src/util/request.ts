const BASE_URL = "http://localhost:3000";

export const executePost = (endpoint: string = "", body?: string) =>
  fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  }).then((res) => {
    return res.json();
  });

export const executeGet = (endpoint: string = "") =>
  fetch(`${BASE_URL}/${endpoint}`).then((res) => {
    return res.json();
  });
