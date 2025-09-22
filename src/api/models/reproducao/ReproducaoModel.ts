import type { TypeReproducao } from "../../enums/typeReproducao/TypeReproducao";
import type { Ovino } from "../ovino/OvinoModel";

export interface Reproducao {
  id: number;
  carneiroPai: Ovino;
  ovelhaMae: Ovino;
  typeReproducao: TypeReproducao;
  dataReproducao: string;
  observacoes?: string;  
}
