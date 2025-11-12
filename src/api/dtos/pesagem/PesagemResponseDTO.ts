import type { Ovino } from "../../models/ovino/OvinoModel";

export interface PesagemResponseDTO {
  id: number;
  ovino: Ovino;
  dataPesagem: string;
  peso: number;
}
