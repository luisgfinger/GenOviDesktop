import type { Doenca } from "../../models/doenca/DoencaModel";
import type { Ovino } from "../../models/ovino/OvinoModel";

export interface OcorrenciaDoencaResponseDTO {
  id: number;
  ovino: Ovino;
  doenca: Doenca;
  dataInicio: string;
  dataFinal?: string;
  curada: boolean;
}