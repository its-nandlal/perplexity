import { api } from "../../../lib/provider/axios";

export async function regster({ username, email, password }) {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
}

export async function login({ email, password }) {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });
    return response.data;
}

export async function getMe() {
    const response = await api("/api/auth/get-me");
    return response.data;
}
