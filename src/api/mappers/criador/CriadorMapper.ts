import type { CriadorRequestDTO } from "../../dto/criador/CriadorRequestDto";
import type { CriadorResponseDTO } from "../../dto/criador/CriadorResponseDto";
import { Criador } from "../../models/criador/CriadorModel";

export class CriadorMapper {
  static fromDTO(dto: CriadorResponseDTO): Criador {
    return new Criador(
      dto.id,
      dto.cpfCnpj,
      dto.endereco,
      dto.nome,
      dto.telefone,
    );
  }

  static fromDTOList(dtos: CriadorResponseDTO[]): Criador[] {
    return dtos.map(dto => this.fromDTO(dto));
  }

  static toRequest(criador: Omit<Criador, "id">): CriadorRequestDTO {
    return {
      cpfCnpj: criador.cpfCnpj,
      endereco: criador.endereco,
      nome: criador.nome,
      telefone: criador.telefone,
    };
  }
}
