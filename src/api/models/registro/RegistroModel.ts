import type { Funcionario } from "../funcionario/FuncinarioModel";
import type { Reproducao } from "../reproducao/ReproducaoModel";
import type { Gestacao } from "../gestacao/GestacaoModel";
import type { Parto } from "../parto/PartoModel";
import type { Aplicacao } from "../aplicacao/AplicacaoModel";
import type { OcorrenciaDoenca } from "../ocorrenciaDoenca/ocorrenciaDoencaModel";
import type { Pesagem } from '../pesagem/PesagemModel';

export interface Registro {
  idRegistro: number;
  dataRegistro: string;
  isSugestao: boolean;
  funcionario: Funcionario;
  reproducao?: Reproducao | null;
  gestacao?: Gestacao | null;
  parto?: Parto | null;
  aplicacao?: Aplicacao | null;
  ocorrenciaDoenca?: OcorrenciaDoenca | null;
  pesagem?: Pesagem | null;
}
