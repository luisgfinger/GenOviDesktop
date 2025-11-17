import type { Funcionario } from "../../models/funcionario/FuncinarioModel";
import type { Reproducao } from "../../models/reproducao/ReproducaoModel";
import type { Gestacao } from "../../models/gestacao/GestacaoModel";
import type { Parto } from "../../models/parto/PartoModel";
import type { Aplicacao } from "../../models/aplicacao/AplicacaoModel";
import type { OcorrenciaDoenca } from "../../models/ocorrenciaDoenca/ocorrenciaDoencaModel";
import type { Pesagem } from "../../models/pesagem/PesagemModel";

export interface RegistroResponseDTO {
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
