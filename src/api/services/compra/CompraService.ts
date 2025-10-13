import Api from "../Api";
import { CompraMapper } from "../../mappers/compra/CompraMapper";
import type { Compra } from "../../models/compra/CompraModel";
import type { CompraRequestDTO } from "../../dtos/compra/CompraRequestDTO";
import type { CompraResponseDTO } from "../../dtos/compra/CompraResponseDTO";

export class CompraService {
  static async listarTodos(): Promise<Compra[]> {
    const response = await Api.get<CompraResponseDTO[]>("/user/compras");
    return response.data.map(CompraMapper.toModel);
  }

  static async buscarPorId(id: number): Promise<Compra> {
    const response = await Api.get<CompraResponseDTO>(`/user/compras/${id}`);
    return CompraMapper.toModel(response.data);
  }

  static async criar(dto: CompraRequestDTO): Promise<Compra> {
    const payload: any = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined)
    );

    const response = await Api.post<CompraResponseDTO>("/user/compras", payload);
    return CompraMapper.toModel(response.data);
  }

  static async editar(id: number, dto: CompraRequestDTO): Promise<Compra> {
    const payload: any = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined)
    );

    const response = await Api.put<CompraResponseDTO>(`/user/compras/${id}`, payload);
    return CompraMapper.toModel(response.data);
  }

  static async remover(id: number): Promise<void> {
    await Api.delete(`/user/compras/${id}`);
  }
}
