import type { Ovino } from "../../models/ovino/OvinoModel";
import type { ReproducaoResponseDTO } from "../reproducao/ReproducaoResponseDTO";

export interface GestacaoResponseDTO {
  id: number;
  reproducao?: ReproducaoResponseDTO;
  ovelhaMae: Ovino;
  ovelhaPai: Ovino;
  observacoes?: string;
  dataGestacao: string;
}