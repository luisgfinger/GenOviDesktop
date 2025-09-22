import type { Ovino } from "../ovino/OvinoModel";
import type { Reproducao } from "../reproducao/ReproducaoModel";

export interface Gestacao {
  id: number;
  ovelhaMae: Ovino;
  ovelhaPai: Ovino;
  reproducao: Reproducao;
}
