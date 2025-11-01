import type { Ovino } from "../ovino/OvinoModel";
import type { Gestacao } from "../gestacao/GestacaoModel";

export interface Parto {
  id: number;
  mae: Ovino;
  pai: Ovino;
  gestacao: Gestacao;
  dataParto: string;
}
