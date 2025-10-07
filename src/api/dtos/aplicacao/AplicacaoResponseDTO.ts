import type { Ovino } from "../../models/ovino/OvinoModel";
import type { Medicamento } from "../../models/medicamento/MedicamentoModel";

export interface AplicacaoResponseDTO {
  id: number;
  ovino: Ovino;
  dataAplicacao: string;
  medicamento: Medicamento;
}
