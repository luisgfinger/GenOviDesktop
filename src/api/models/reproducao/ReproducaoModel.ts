import type { TypeReproducao } from "../../enums/typeReproducao/TypeReproducao";
import type { Ovino } from "../ovino/OvinoModel";

export interface Reproducao {
  id: number;
  carneiro: number;
  ovelha: number;
  typeReproducao: TypeReproducao;
  dataReproducao: string;
  observacoes?: string;  
}
