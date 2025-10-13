import type { Compra } from "../../models/compra/CompraModel";
import type { CompraRequestDTO } from "../../dtos/compra/CompraRequestDTO";
import type { CompraResponseDTO } from "../../dtos/compra/CompraResponseDTO";
import type { Vendedor } from "../../models/vendedor/VendedorModel";

export class CompraMapper {
  static toModel(dto: CompraResponseDTO): Compra {
    return {
      id: dto.id,
      dataCompra: dto.dataCompra,
      valor: dto.valor,
      vendedor: dto.vendedor
        ? ({
            id: dto.vendedor.id,
            nome: dto.vendedor.nome,
            cpfCnpj: dto.vendedor.cpfCnpj,
            email: dto.vendedor.email,
            endereco: dto.vendedor.endereco,
            telefone: dto.vendedor.telefone,
            ativo: dto.vendedor.ativo,
          } as Vendedor)
        : undefined,
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
