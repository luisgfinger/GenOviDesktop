import Api from "../Api";
import type { Ovino } from "../../models/ovino/OvinoModel";
import type { OvinoRequestDTO } from "../../dtos/ovino/OvinoRequestDTO";
import type { OvinoResponseDTO } from "../../dtos/ovino/OvinoResponseDTO";
import { responseToModel } from "../../mappers/ovino/OvinoMapper";

export const OvinoService = {
  listarTodos: async (): Promise<Ovino[]> => {
    const { data } = await Api.get<OvinoResponseDTO[]>("/user/ovinos");
    return data.map(responseToModel);
  },

  salvar: async (payload: OvinoRequestDTO): Promise<Ovino> => {
    const { data } = await Api.post<OvinoResponseDTO>("/user/ovinos", payload);
    return responseToModel(data);
  },

  findById: async (id: number): Promise<Ovino> => {
    const { data } = await Api.get<OvinoResponseDTO>(`/user/ovinos/${id}`);
    return responseToModel(data);
  },

editar: async (id: number, payload: OvinoRequestDTO): Promise<Ovino> => {
  const formatado = {
    ...payload,
    compra: (payload as any).compra?.id ?? payload.compra,
    parto: (payload as any).parto?.id ?? payload.parto,
    maeId: (payload as any).maeId?.id ?? payload.maeId,
    paiId: (payload as any).paiId?.id ?? payload.paiId,
  };

  const { data } = await Api.put<OvinoResponseDTO>(`/user/ovinos/${id}`, formatado);
  return responseToModel(data);
},



  desativar: async (id: number): Promise<void> => {
    await Api.patch(`/user/ovinos/${id}/disable`);
  },
};
