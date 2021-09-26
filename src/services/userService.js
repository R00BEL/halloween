import { BACKEND_URL } from "../constants";

export const createPost = async (file, access_token) => {
  let formData = new FormData();
  formData.append("file", file);

  await fetch(`${BACKEND_URL}/user/post?access_token=${access_token}`, {
    method: "POST",
    "Content-Type": "multipart/form-data",
    body: formData,
  });
};

export const getUser = async (accessToken) => {
  const res = await fetch(`${BACKEND_URL}/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    return;
  }

  return res.json();
};

export const createAccessToken = async (code) => {
  const res = await fetch(`${BACKEND_URL}/user/access-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    return;
  }

  return res.json();
};
