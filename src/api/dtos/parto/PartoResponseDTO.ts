import type { Ovino } from "../../models/ovino/OvinoModel";
import type { Gestacao } from "../../models/gestacao/GestacaoModel";

export interface PartoResponseDTO {
  id: number;
  ovinoMae: Ovino;
  ovinoPai: Ovino;
  gestacao: Gestacao;
}
