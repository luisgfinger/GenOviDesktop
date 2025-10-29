import type { Usuario } from "../../models/usuario/UsuarioModel";
import type { UsuarioRequestDTO } from "../../dtos/usuario/UsuarioRequestDTO";
import type { UsuarioResponseDTO } from "../../dtos/usuario/UsuarioResponseDTO";

export function toUsuarioRequestDTO(usuario: Usuario): UsuarioRequestDTO {
  return {
    email: usuario.email,
    senha: usuario.senha,
    ativo: usuario.ativo,
    autenticacao2fa: usuario.autenticacao2fa ?? null,
    roles: usuario.roles,
    funcionarioId: usuario.funcionario?.id,
  };
}

export function fromUsuarioResponseDTO(dto: UsuarioResponseDTO): Usuario {
  return {
    id: dto.id,
    email: dto.email,
    ativo: dto.ativo,
    senha: "", 
    autenticacao2fa: dto.autenticacao2fa ?? null,
    roles: dto.roles,
    funcionario: dto.funcionario ?? undefined,
  };
}
