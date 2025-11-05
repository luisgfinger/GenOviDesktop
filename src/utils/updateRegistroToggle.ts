import { RegistroService } from "../api/services/registro/RegistroService";
import type { Registro } from "../api/models/registro/RegistroModel";
import type { RegistroRequestDTO } from "../api/dtos/registro/RegistroRequestDTO";

/**
 * Atualiza um registro existente, invertendo o valor de um campo booleano (ex: isSugestao).
 * Pode receber o ID direto do registro ou o ID de uma entidade vinculada
 * (ex: ocorrência, parto, gestação, etc.).
 *
 * @param entityId ID da entidade (registro ou entidade relacionada)
 * @param field Nome do campo booleano a alternar (ex: "isSugestao")
 */
export async function updateRegistroToggle(
  entityId: number,
  field: keyof Pick<Registro, "isSugestao">
): Promise<void> {
  try {
    const registros: Registro[] = await RegistroService.listarTodos();

    const registroAtual = registros.find(
      (r) =>
        r.idRegistro === entityId ||
        r.aplicacao?.id === entityId ||
        r.reproducao?.id === entityId ||
        r.gestacao?.id === entityId ||
        r.parto?.id === entityId ||
        r.ocorrenciaDoenca?.id === entityId
    );

    if (!registroAtual) {
      console.warn(`Nenhum registro encontrado contendo a entidade com ID ${entityId}.`);
      return;
    }

    const valorAtual = (registroAtual as any)[field];
    if (typeof valorAtual !== "boolean") {
      console.error(`Campo "${String(field)}" não é booleano no registro.`);
      return;
    }

    const novoValor = !valorAtual;

    const funcionarioId =
      registroAtual.funcionario?.id ??
      Number(localStorage.getItem("funcionarioId")) ??
      1;

    const dto: RegistroRequestDTO = {
      dataRegistro: registroAtual.dataRegistro ?? new Date().toISOString().split("Z")[0],
      idFuncionario: funcionarioId,
      isSugestao: field === "isSugestao" ? novoValor : registroAtual.isSugestao,
      idAplicacoes: registroAtual.aplicacao?.id,
      idReproducao: registroAtual.reproducao?.id,
      idGestacao: registroAtual.gestacao?.id,
      idParto: registroAtual.parto?.id,
      idOcorrenciaDoencas: registroAtual.ocorrenciaDoenca?.id,
    };

    await RegistroService.editar(registroAtual.idRegistro, dto);
    console.log(`Campo "${String(field)}" atualizado para ${novoValor} no registro ID ${registroAtual.idRegistro}.`);
  } catch (error) {
    console.error(`Erro ao atualizar registro (entityId: ${entityId}):`, error);
  }
}
