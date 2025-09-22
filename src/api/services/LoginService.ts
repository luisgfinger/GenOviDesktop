import Api from "./Api";

interface LoginResponse {
  token: string;
  email: string;
}

export async function login(email: string, senha: string): Promise<LoginResponse> {
  const response = await Api.post("/auth/login", { email, senha });
  return response.data;
}