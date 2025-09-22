import Api from "../Api";
import { CompraMapper } from "../../mappers/compra/CompraMapper";
import type { Compra } from "../../models/compra/CompraModel";
import type { CompraResponseDTO } from "../../dtos/compra/CompraResponseDTO";

export class CompraService {
  static async listarTodos(): Promise<Compra[]> {
    const response = await Api.get<CompraResponseDTO[]>("/user/compras");
    return response.data.map(CompraMapper.toModel);
  }
}