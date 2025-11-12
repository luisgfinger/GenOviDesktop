import Api from "../Api";
import { pesagemMapper } from "../../mappers/pesagem/PesagemMapper";
import type { PesagemRequestDTO } from "../../dtos/pesagem/PesagemRequestDTO";
import type { PesagemResponseDTO } from "../../dtos/pesagem/PesagemResponseDTO";

export class PesagemService {
  static async listarTodos(): Promise<PesagemResponseDTO[]> {
    const { data } = await Api.get<any[]>("/user/pesagens");
    return data.map(pesagemMapper.fromResponse);
  }

  static async buscarPorId(id: number): Promise<PesagemResponseDTO> {
    const { data } = await Api.get<any>(`/user/pesagens/${id}`);
    return pesagemMapper.fromResponse(data);
  }

  static async criar(dto: PesagemRequestDTO): Promise<PesagemResponseDTO> {
    const payload = pesagemMapper.toRequest(dto);
    const { data } = await Api.post<any>("/user/pesagens", payload);
    return pesagemMapper.fromResponse(data);
  }

  static async editar(id: number, dto: PesagemRequestDTO): Promise<PesagemResponseDTO> {
    const payload = pesagemMapper.toRequest(dto);
    const { data } = await Api.put<any>(`/user/pesagens/${id}`, payload);
    return pesagemMapper.fromResponse(data);
  }

  static async remover(id: number): Promise<void> {
    await Api.delete(`/user/pesagens/${id}`);
  }
}
