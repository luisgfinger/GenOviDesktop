import type { Parto } from "../../models/parto/PartoModel";
import type { PartoRequestDTO } from "../../dtos/parto/PartoRequestDTO";
import type { PartoResponseDTO } from "../../dtos/parto/PartoResponseDTO";
import type { Ovino } from "../../models/ovino/OvinoModel";
import type { Gestacao } from "../../models/gestacao/GestacaoModel";

export class PartoMapper {
  static toEntity(
    dto: PartoRequestDTO,
    ovinoMae: Ovino,
    ovinoPai: Ovino,
    gestacao: Gestacao
  ): Parto {
    return {
      id: 0,
      ovinoMae,
      ovinoPai,
      gestacao,
    };
  }

  static toResponse(entity: Parto): PartoResponseDTO {
    return {
      id: entity.id,
      ovinoMae: entity.ovinoMae,
      ovinoPai: entity.ovinoPai,
      gestacao: entity.gestacao,
    };
  }
}
