import { Criador } from "../../models/criador/CriadorModel";
import type { CriadorResponseDTO } from "../../dto/criador/CriadorReponseDto";

export class CriadorMapper {
  static fromDTO(dto: CriadorResponseDTO): Criador {
    return new Criador(
      dto.id ?? `sem-id-${Math.random()}`,
      dto.cpfCnpj ?? "Não informado",
      dto.endereco ?? "Não informado",
      dto.nome ?? "Não informado",
      dto.telefone ?? "Não informado",
      dto.imagem ?? undefined
    );
  }

  static fromDTOList(dtos: CriadorResponseDTO[]): Criador[] {
    return dtos.map(dto => this.fromDTO(dto));
  }
}
