import Api from "../Api";
import type { DoencaResponseDTO } from "../../dtos/doenca/DoencaResponseDTO";
import type { Doenca } from "../../models/doenca/DoencaModel";

const API_URL = "/user/doencas";

export const DoencaService = {
  listarTodos: async (): Promise<DoencaResponseDTO[]> => {
    const response = await Api.get<DoencaResponseDTO[]>(API_URL);
    return response.data;
  },

  async salvar(doenca: Omit<Doenca, "id">): Promise<Doenca> {
    const response = await Api.post(API_URL, doenca);
    return response.data;
  },

  async buscarPorId(id: number): Promise<DoencaResponseDTO> {
    const response = await Api.get<DoencaResponseDTO>(`${API_URL}/${id}`);
    return response.data;
  },
};
