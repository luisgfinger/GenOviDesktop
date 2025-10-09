import type { Ovino } from "../../models/ovino/OvinoModel";
import type { GestacaoResponseDTO } from "../gestacao/GestacaoResponseDTO";

export interface PartoResponseDTO {
  id: number;
  ovinoMae: Ovino;
  ovinoPai: Ovino;
  gestacao: GestacaoResponseDTO;
  dataParto: string;
}
