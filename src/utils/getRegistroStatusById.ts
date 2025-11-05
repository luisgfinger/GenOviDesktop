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
  entityId: number,
  tipo:
    | "aplicacao"
    | "reproducao"
    | "gestacao"
    | "parto"
    | "ocorrenciaDoenca"
): Promise<boolean | null> {
  try {
    const registros: Registro[] = await RegistroService.listarTodos();

    const registro = registros.find((r) => {
      switch (tipo) {
        case "aplicacao":
          return r.aplicacao?.id === entityId;
        case "reproducao":
          return r.reproducao?.id === entityId;
        case "gestacao":
          return r.gestacao?.id === entityId;
        case "parto":
          return r.parto?.id === entityId;
        case "ocorrenciaDoenca":
          return r.ocorrenciaDoenca?.id === entityId;
        default:
          return false;
      }
    });

    if (!registro) {
      console.warn(`Nenhum registro encontrado para ${tipo} com ID ${entityId}.`);
      return null;
    }

    console.log(`Registro encontrado para ${tipo} ID ${entityId}:`, registro);
    return registro.isSugestao;
  } catch (error) {
    console.error(`Erro ao buscar status (${tipo}, entityId: ${entityId}):`, error);
    return null;
  }
}

