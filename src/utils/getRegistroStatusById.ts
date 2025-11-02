import { RegistroService } from "../api/services/registro/RegistroService";
import type { Registro } from "../api/models/registro/RegistroModel";

/**
 * Busca o status (ex: isSugestao) de um registro pelo ID de uma entidade relacionada
 * (ex: ocorrência, parto, gestação, reprodução, aplicação).
 *
 * @param entityId ID da entidade relacionada ou do próprio registro
 * @returns Retorna true/false se encontrado, ou null se não existir
 */
export async function getRegistroStatusByEntityId(
  entityId: number
): Promise<boolean | null> {
  try {
    const registros: Registro[] = await RegistroService.listarTodos();

    const registro = registros.find(
      (r) =>
        r.idRegistro === entityId ||
        r.aplicacao?.id === entityId ||
        r.reproducao?.id === entityId ||
        r.gestacao?.id === entityId ||
        r.parto?.id === entityId ||
        r.ocorrenciaDoenca?.id === entityId
    );

    if (!registro) {
      console.warn(`⚠️ Nenhum registro encontrado para a entidade com ID ${entityId}.`);
      return null;
    }

    console.log(`ℹ️ Registro encontrado (ID: ${registro.idRegistro}) — isSugestao: ${registro.isSugestao}`);
    return registro.isSugestao;
  } catch (error) {
    console.error(`❌ Erro ao buscar status do registro (entityId: ${entityId}):`, error);
    return null;
  }
}
