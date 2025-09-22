import type { Compra } from "../../models/compra/CompraModel";
import type { CompraRequestDTO } from "../../dtos/compra/CompraRequestDTO";
import type { CompraResponseDTO } from "../../dtos/compra/CompraResponseDTO";

export class CompraMapper {
  static toModel(dto: CompraResponseDTO): Compra {
    return {
      id: dto.id,
      dataCompra: dto.dataCompra,
      valor: dto.valor,
      vendedor: dto.vendedor,
    };
  }

  static toRequest(model: Omit<Compra, "id">): CompraRequestDTO {
    return {
      dataCompra: model.dataCompra,
      valor: model.valor,
      vendedorId: model.vendedor?.id,
    };
  }
}
