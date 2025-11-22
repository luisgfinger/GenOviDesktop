import { Role } from "../api/enums/role/Role";

export function isAdmin(usuario: { enumRoles?: Role[] }): boolean {
  return usuario?.enumRoles?.includes(Role.ROLE_ADMIN) ?? false;
}
