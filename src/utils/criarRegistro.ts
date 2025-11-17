import type { Aplicacao } from "../api/models/aplicacao/AplicacaoModel";
import type { Reproducao } from "../api/models/reproducao/ReproducaoModel";
import type { Gestacao } from "../api/models/gestacao/GestacaoModel";
import type { Parto } from "../api/models/parto/PartoModel";
import type { OcorrenciaDoenca } from "../api/models/ocorrenciaDoenca/ocorrenciaDoencaModel";
import type { RegistroRequestDTO } from "../api/dtos/registro/RegistroRequestDTO";
import type { Pesagem } from "../api/models/pesagem/PesagemModel";

import { RegistroService } from "../api/services/registro/RegistroService";
import { getUsuarioIdByEmail } from "./getUsuarioIdByEmail";
import { getFuncionarioIdByUsuarioId } from "./getFuncionarioIdByUsuarioId";


export async function createRegistroAuto(
  tipo: "aplicacao" | "reproducao" | "gestacao" | "parto" | "ocorrenciaDoenca" | "pesagem",
  entidade: Aplicacao | Reproducao | Gestacao | Parto | OcorrenciaDoenca | Pesagem,
  isSugestao = false
) {
  try {
    let usuarioId = localStorage.getItem("usuarioId");
    let funcionarioId = localStorage.getItem("funcionarioId");

    if (!usuarioId) {
      const foundUsuarioId = await getUsuarioIdByEmail();
      if (!foundUsuarioId) {
        console.warn("Nenhum usuário logado encontrado. Registro não será criado.");
        return;
      }
      usuarioId = String(foundUsuarioId);
      localStorage.setItem("usuarioId", usuarioId);
    }

    if (!funcionarioId) {
      const foundFuncionarioId = await getFuncionarioIdByUsuarioId(Number(usuarioId));
      if (foundFuncionarioId) {
        funcionarioId = String(foundFuncionarioId);
        localStorage.setItem("funcionarioId", funcionarioId);
      } else {
        console.warn(
          "Usuário logado não possui funcionário vinculado. Usando funcionário ID = 1 como padrão."
        );
        funcionarioId = "1";
      }
    }

    const dto: RegistroRequestDTO = {
      dataRegistro: new Date().toISOString().split("Z")[0],
      isSugestao,
      idFuncionario: Number(funcionarioId),
      idAplicacoes: undefined,
      idReproducao: undefined,
      idGestacao: undefined,
      idParto: undefined,
      idOcorrenciaDoencas: undefined,
      idPesagem: undefined,
    };

    switch (tipo) {
      case "aplicacao":
        dto.idAplicacoes = (entidade as Aplicacao).id;
        break;
      case "reproducao":
        dto.idReproducao = (entidade as Reproducao).id;
        break;
      case "gestacao":
        dto.idGestacao = (entidade as Gestacao).id;
        break;
      case "parto":
        dto.idParto = (entidade as Parto).id;
        break;
      case "ocorrenciaDoenca":
        dto.idOcorrenciaDoencas = (entidade as OcorrenciaDoenca).id;
        break;
      case "pesagem":
        dto.idPesagem = (entidade as Pesagem).id;
    }

    console.log("DTO enviado para RegistroService:", dto);
    await RegistroService.criar(dto);

    console.log(`Registro automático criado para ${tipo} (funcionário ID: ${funcionarioId}).`);
  } catch (error) {
    console.error(`Erro ao criar registro automático (${tipo}):`, error);
  }
}
