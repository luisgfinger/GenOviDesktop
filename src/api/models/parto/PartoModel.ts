import type { Ovino } from "../ovino/OvinoModel";
import type { Gestacao } from "../gestacao/GestacaoModel";

export interface Parto {
  id: number;
  ovelhaMae: Ovino;
  ovelhaPai: Ovino;
  gestacao: Gestacao;
  dataParto: string;
}
