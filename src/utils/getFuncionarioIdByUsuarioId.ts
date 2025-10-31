import { UsuarioService } from "../api/services/usuario/UsuarioService";

export async function getFuncionarioIdByUsuarioId(
  usuarioId: number
): Promise<number | null> {
  try {
    const usuario = await UsuarioService.buscarPorId(usuarioId);

    if (!usuario) {
      console.warn(`Usuário com ID ${usuarioId} não encontrado.`);
      return null;
    }

    const funcionarioId = usuario.funcionario?.id ?? null;

    if (!funcionarioId) {
      console.warn(`Usuário ${usuarioId} não possui funcionário vinculado.`);
      return null;
    }

    return funcionarioId;
  } catch (error) {
    console.error("Erro ao buscar funcionário pelo ID do usuário:", error);
    return null;
  }
}
