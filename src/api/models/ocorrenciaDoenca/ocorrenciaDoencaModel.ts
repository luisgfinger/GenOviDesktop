import type { Doenca } from "../doenca/DoencaModel";
import type { Ovino } from "../ovino/OvinoModel";

export interface OcorrenciaDoenca {
  id: number;
  ovino: Ovino;
  doenca: Doenca;
  dataInicio: string;
  dataFinal?: string;
  curado: boolean;
}
