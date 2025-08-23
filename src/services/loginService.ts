import api from "./api";

interface LoginResponse {
  token: string;
  username: string;
}

export async function login(username: string, senha: string): Promise<LoginResponse> {
  const response = await api.post("/auth/login", { username, senha });
  return response.data;
}
