import type { Funcionario } from "../funcionario/FuncinarioModel";
import type { Reproducao } from "../reproducao/ReproducaoModel";
import type { Gestacao } from "../gestacao/GestacaoModel";
import type { Parto } from "../parto/PartoModel";
import type { Aplicacao } from "../aplicacao/AplicacaoModel";
import type { OcorrenciaDoenca } from "../ocorrenciaDoenca/ocorrenciaDoencaModel";

export interface Registro {
  id: number;
  dataRegistro: string;
  funcionario: Funcionario;
  reproducao?: Reproducao | null;
  gestacao?: Gestacao | null;
  parto?: Parto | null;
  aplicacao?: Aplicacao | null;
  ocorrenciaDoenca?: OcorrenciaDoenca | null;
}
