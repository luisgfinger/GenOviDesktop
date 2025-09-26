import type { Reproducao } from "../../models/reproducao/ReproducaoModel";
import type { ReproducaoRequestDTO } from "../../dtos/reproducao/ReproducaoRequestDTO";
import type { ReproducaoResponseDTO } from "../../dtos/reproducao/ReproducaoResponseDTO";
import type { Ovino } from "../../models/ovino/OvinoModel";
import type { TypeReproducao } from "../../enums/typeReproducao/TypeReproducao";

export class ReproducaoMapper {
  static toEntity(
    dto: ReproducaoRequestDTO,
    carneiroPai: Ovino,
    ovelhaMae: Ovino,
    typeReproducao: TypeReproducao
  ): Reproducao {
    return {
      id: 0, 
      carneiroPai,
      ovelhaMae,
      typeReproducao,
      dataReproducao: dto.dataReproducao,
      observacoes: dto.observacoes,
    };
  }

  static toResponse(entity: Reproducao): ReproducaoResponseDTO {
    return {
      id: entity.id,
      carneiroPai: entity.carneiroPai,
      ovelhaMae: entity.ovelhaMae,
      typeReproducao: entity.typeReproducao,
      dataReproducao: entity.dataReproducao,
      observacoes: entity.observacoes,
    };
  }
}
