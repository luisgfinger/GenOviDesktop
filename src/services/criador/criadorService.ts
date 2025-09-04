import api from "../../api/services/api";


export interface Criador {
  id: string;
  cpfCnpj: string;
  endereco: string;
  nome: string;
  telefone: string;
  imagem?: string;
}

class CriadorService {
  async getAll(): Promise<Criador[]> {
    const token = localStorage.getItem("token");
    const response = await api.get("/user/criadores", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    return response.data.map((item: any) => {
      return {
        id: item.id ?? `sem-id-${Math.random()}`,
        cpfCnpj: item.cpfCnpj,
        endereco: item.endereco,
        nome: item.nome,
        telefone: item.telefone,
        imagem: undefined,
      };
    });
  }
}

export default new CriadorService();
