import type { Doenca } from "../../models/doenca/DoencaModel";

export interface MedicamentoResponseDTO {
  id: number;
  nome: string;
  fabricante: string;
  doencas: Doenca[];
  quantidadeDoses: number;
  intervaloDoses: number;
  isVacina: boolean;
}
