import Api from "../Api";
import type { Usuario } from "../../models/usuario/UsuarioModel";
import type { UsuarioRequestDTO } from "../../dtos/usuario/UsuarioRequestDTO";
import type { UsuarioResponseDTO } from "../../dtos/usuario/UsuarioResponseDTO";
import {
  fromUsuarioResponseDTO,
  toUsuarioRequestDTO,
} from "../../mappers/usuario/UsuarioMapper";

export const UsuarioService = {
  async listar(): Promise<Usuario[]> {
    const response = await Api.get<UsuarioResponseDTO[]>("/auth/usuarios");
    console.log(response.data);
    return response.data.map(fromUsuarioResponseDTO);
  },

  async buscarPorId(id: number): Promise<Usuario> {
    const response = await Api.get<UsuarioResponseDTO>(`/auth/usuarios/${id}`);
    return fromUsuarioResponseDTO(response.data);
  },

  async criar(usuario: Usuario): Promise<Usuario> {
    const dto: UsuarioRequestDTO = toUsuarioRequestDTO(usuario);
    const response = await Api.post<UsuarioResponseDTO>("/auth/usuarios", dto);
    return fromUsuarioResponseDTO(response.data);
  },

  async atualizar(id: number, usuario: Usuario): Promise<Usuario> {
    const dto: UsuarioRequestDTO = toUsuarioRequestDTO(usuario);
    const response = await Api.put<UsuarioResponseDTO>(`/auth/usuarios/${id}`, dto);
    return fromUsuarioResponseDTO(response.data);
  },

  async deletar(id: number): Promise<void> {
    await Api.delete(`/auth/usuarios/${id}`);
  },
};
