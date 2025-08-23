import api from "./api";
export interface Ovino {
  id: number;
  imagem?: string;
  nome: string;
  sexo: string;
  fbb: string;
  raca: string;
  pai: string;
  mae: string;
  pureza: string;
}

class OvinoService {
  async getAll(): Promise<Ovino[]> {
    const token = localStorage.getItem("token");
    const response = await api.get<Ovino[]>("/user/ovinos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}

export default new OvinoService();

