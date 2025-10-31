import type { TypeReproducao } from "../../enums/typeReproducao/TypeReproducao";
import type { Ovino } from "../ovino/OvinoModel";

export interface Reproducao {
  id: number;
  carneiro: Ovino;
  ovelha: Ovino;
  enumReproducao: TypeReproducao;
  dataReproducao: string;
  observacoes?: string;  
}
