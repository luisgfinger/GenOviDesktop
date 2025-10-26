import Api from "../Api";
import { registroMapper } from "../../mappers/registro/RegistroMapper";
import type { RegistroRequestDTO } from "../../dtos/registro/RegistroRequestDTO";
import type { RegistroResponseDTO } from "../../dtos/registro/RegistroResponseDTO";

export class RegistroService {
  static async listarTodos(): Promise<RegistroResponseDTO[]> {
    const { data } = await Api.get<any[]>("/user/registros");
    return data.map(registroMapper.fromResponse);
  }

  static async buscarPorId(id: number): Promise<RegistroResponseDTO> {
    const { data } = await Api.get<any>(`/user/registros/${id}`);
    return registroMapper.fromResponse(data);
  }

  static async criar(dto: RegistroRequestDTO): Promise<RegistroResponseDTO> {
    const payload = registroMapper.toRequest(dto);
    const { data } = await Api.post<any>("/user/registros", payload);
    return registroMapper.fromResponse(data);
  }

  static async editar(id: number, dto: RegistroRequestDTO): Promise<RegistroResponseDTO> {
    const payload = registroMapper.toRequest(dto);
    const { data } = await Api.put<any>(`/user/registros/${id}`, payload);
    return registroMapper.fromResponse(data);
  }

  static async remover(id: number): Promise<void> {
    await Api.delete(`/user/registros/${id}`);
  }
}
