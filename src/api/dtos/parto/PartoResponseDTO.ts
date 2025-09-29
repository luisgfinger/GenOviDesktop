import type { Ovino } from "../../models/ovino/OvinoModel";
import type { GestacaoResponseDTO } from "../gestacao/GestacaoResponseDTO";

export interface PartoResponseDTO {
  id: number;
  ovelhaMae: Ovino;
  ovelhaPai: Ovino;
  gestacao: GestacaoResponseDTO;
  dataParto: string;
}
