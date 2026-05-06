const BASE_URL = "http://localhost:3000/api";

export const executePost = async (endpoint: string = "", body?: string) => {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await res.json();
  console.log(">> data", data);
  return data;
};

export const executeGet = (endpoint: string = "") =>
  fetch(`${BASE_URL}/${endpoint}`).then((res) => {
    return res.json();
  });
