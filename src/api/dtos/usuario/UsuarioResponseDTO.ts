import type { Role } from "../../enums/role/Role";
import type { Funcionario } from "../../models/funcionario/FuncinarioModel";

export interface UsuarioResponseDTO {
  id: number;
  email: string;
  ativo: boolean;
  autenticacao2fa?: boolean | null;
  enumRoles: Role[];
  funcionario: Funcionario;
}
