import type { Ovino } from "../../models/ovino/OvinoModel";

export interface ReproducaoResponseDTO {
  id: number;
  carneiro: Ovino;
  ovelha: Ovino;
  enumReproducao: string;
  dataReproducao: string;
  observacoes?: string | null;
}
