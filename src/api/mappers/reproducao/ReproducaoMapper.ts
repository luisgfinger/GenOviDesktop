import type { Reproducao } from "../../models/reproducao/ReproducaoModel";
import type { ReproducaoRequestDTO } from "../../dtos/reproducao/ReproducaoRequestDTO";
import type { ReproducaoResponseDTO } from "../../dtos/reproducao/ReproducaoResponseDTO";
import type { TypeReproducao } from "../../enums/typeReproducao/TypeReproducao";
import type { Ovino } from "../../models/ovino/OvinoModel"; // se já existir

export class ReproducaoMapper {
  static toEntity(
    dto: ReproducaoRequestDTO,
    carneiro: Ovino,
    ovelha: Ovino,
    typeReproducao: TypeReproducao
  ): Reproducao {
    return {
      id: dto.id ?? 0,
      carneiro,
      ovelha,
      typeReproducao,
      dataReproducao: dto.dataReproducao,
      observacoes: dto.observacoes,
    };
  }

  static toResponse(entity: Reproducao): ReproducaoResponseDTO {
    return {
      id: entity.id,
      carneiro: entity.carneiro,
      ovelha: entity.ovelha,
      typeReproducao: entity.typeReproducao,
      dataReproducao: entity.dataReproducao,
      observacoes: entity.observacoes,
    };
  }
}
