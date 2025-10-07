import Api from "../Api";
import type { DoencaResponseDTO } from "../../dtos/doenca/DoencaResponseDTO";
import type { Doenca } from "../../models/doenca/DoencaModel";

const API_URL = "/user/doencas";

export const DoencaService = {

  listarTodos: async (): Promise<DoencaResponseDTO[]> => {
    const { data } = await Api.get<DoencaResponseDTO[]>(API_URL);
    return data;
  },

  salvar: async (doenca: Omit<Doenca, "id">): Promise<Doenca> => {
    const { data } = await Api.post<Doenca>(API_URL, doenca);
    return data;
  },

  buscarPorId: async (id: number): Promise<DoencaResponseDTO> => {
    const { data } = await Api.get<DoencaResponseDTO>(`${API_URL}/${id}`);
    return data;
  },

  editar: async (id: number, doenca: Partial<Doenca>): Promise<Doenca> => {
    const { data } = await Api.put<Doenca>(`${API_URL}/${id}`, doenca);
    return data;
  },

  remover: async (id: number): Promise<void> => {
    await Api.delete(`${API_URL}/${id}`);
  },
};
