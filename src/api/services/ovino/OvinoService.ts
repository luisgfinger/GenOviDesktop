import Api from "../Api";
import type { Ovino } from "../../models/ovino/OvinoModel";
import type { OvinoRequestDTO } from "../../dtos/ovino/OvinoRequestDTO";
import type { OvinoResponseDTO } from "../../dtos/ovino/OvinoResponseDTO";
import { responseToModel, modelToRequest } from "../../mappers/ovino/OvinoMapper";

export const OvinoService = {
  listarTodos: async (): Promise<Ovino[]> => {
    const { data } = await Api.get<OvinoResponseDTO[]>("/user/ovinos");
    return data.map(responseToModel);
  },

  salvar: async (payload: OvinoRequestDTO): Promise<Ovino> => {
    const { data } = await Api.post<OvinoResponseDTO>("/user/ovinos", payload);
    console.log(payload);
    return responseToModel(data);
  },

  findById: async (id: number): Promise<Ovino> => {
    const { data } = await Api.get<OvinoResponseDTO>(`/user/ovinos/${id}`);
    console.log(data);
    return responseToModel(data);
  },

  editar: async (id: number, payload: OvinoRequestDTO): Promise<Ovino> => {
    const { data } = await Api.put<OvinoResponseDTO>(
      `/user/ovinos/${id}`,
      payload
    );
    console.log("Editando ovino:", id, payload);
    return responseToModel(data);
  },

  remover: async (id: number): Promise<void> => {
    await Api.delete(`/user/ovinos/${id}`);
    console.log("Ovino removido:", id);
  },
};
