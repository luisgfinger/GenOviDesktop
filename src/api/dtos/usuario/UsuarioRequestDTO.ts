import type { Role } from "../../enums/role/Role";

export interface UsuarioRequestDTO {
  email: string;
  senha?: string;
  ativo?: boolean;
  autenticacao2fa?: boolean | null;
  enumRoles: Role[];
  funcionarioId?: number; 
}
