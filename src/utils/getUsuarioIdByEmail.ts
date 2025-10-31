import { UsuarioService } from "../api/services/usuario/UsuarioService";

export async function getUsuarioIdByEmail(): Promise<number | null> {
  const cachedId = localStorage.getItem("usuarioId");
  if (cachedId) return Number(cachedId);

  const email = localStorage.getItem("email");
  if (!email) return null;

  try {
    const usuarios = await UsuarioService.listar();
    const usuario = usuarios.find((u) => u.email === email);
    if (!usuario) return null;

    localStorage.setItem("usuarioId", String(usuario.id));
    return usuario.id;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}
