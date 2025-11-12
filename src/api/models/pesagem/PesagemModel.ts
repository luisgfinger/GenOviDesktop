import type { Ovino } from "../ovino/OvinoModel";

export interface Pesagem {
  id: number;
  dataPesagem: string; 
  ovino: Ovino;
  peso: number;
}
