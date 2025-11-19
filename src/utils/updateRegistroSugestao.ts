import { RegistroService } from "../api/services/registro/RegistroService";
import type { RegistroResponseDTO } from "../api/dtos/registro/RegistroResponseDTO";

export async function updateRegistroSugestao(
  registro: RegistroResponseDTO
): Promise<boolean> {
  try {
    if (!registro.isSugestao) {
      console.log("Registro já está confirmado. Nenhuma alteração feita.");
      return false;
    }

    await RegistroService.atualizarSugestao(registro.idRegistro, false);

    console.log(`Registro ${registro.idRegistro} confirmado com sucesso (isSugestao = false).`);
    return true;
  } catch (err) {
    console.error("Erro ao atualizar isSugestao:", err);
    return false;
  }
}
