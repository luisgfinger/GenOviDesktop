import type { Role } from "../../enums/role/Role";
import type { Funcionario } from "../funcionario/FuncinarioModel";

export interface Usuario {
  id: number;
  ativo: boolean;
  email: string;
  senha: string;
  autenticacao2fa?: boolean | null;
  roles: Role[];
  funcionario?: Funcionario;
}
