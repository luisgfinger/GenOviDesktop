import type { TypeReproducao } from "../../enums/typeReproducao/TypeReproducao";
import type { Ovino } from "../../models/ovino/OvinoModel";

export interface ReproducaoResponseDTO {
  id: number;
  carneiroPai: Ovino;
  ovelhaMae: Ovino;
  typeReproducao: TypeReproducao;
  dataReproducao: string;
  observacoes?: string;
}
