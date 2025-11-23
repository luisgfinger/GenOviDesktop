import type { Reproducao } from "../../models/reproducao/ReproducaoModel";
import type { ReproducaoRequestDTO } from "../../dtos/reproducao/ReproducaoRequestDTO";
import type { ReproducaoResponseDTO } from "../../dtos/reproducao/ReproducaoResponseDTO";
import type { TypeReproducao } from "../../enums/typeReproducao/TypeReproducao";
import type { Ovino } from "../../models/ovino/OvinoModel";

export class ReproducaoMapper {
  static toEntity(
  dto: ReproducaoRequestDTO,
  carneiro: Ovino,
  ovelha: Ovino,
  enumReproducao: TypeReproducao,
): Reproducao {
  return {
    id: dto.id ?? 0,
    carneiro,
    ovelha,
    enumReproducao,
    dataReproducao: dto.dataReproducao,
  };
}


  static toResponse(entity: Reproducao): ReproducaoResponseDTO {
    return {
      id: entity.id,
      carneiro: entity.carneiro,
      ovelha: entity.ovelha,
      enumReproducao: entity.enumReproducao,
      dataReproducao: entity.dataReproducao,
    };
  }
}
