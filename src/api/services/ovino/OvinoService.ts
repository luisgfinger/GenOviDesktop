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
    console.log(payload)
    return responseToModel(data);
  },
};
