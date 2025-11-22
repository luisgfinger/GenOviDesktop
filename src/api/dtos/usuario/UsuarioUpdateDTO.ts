import type { Role } from "../../enums/role/Role";

export interface UsuarioUpdateDTO {
  email?: string;
  senha?: string;
  ativo?: boolean;
  autenticacao2fa?: boolean | null;
  enumRoles?: Role[];
  funcionarioId?: number | null;
}
