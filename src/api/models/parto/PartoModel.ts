import type { Ovino } from "../ovino/OvinoModel";
import type { Gestacao } from "../gestacao/GestacaoModel";

export interface Parto {
  id: number;
  ovinoMae: Ovino;
  ovinoPai: Ovino;
  gestacao: Gestacao;
}
