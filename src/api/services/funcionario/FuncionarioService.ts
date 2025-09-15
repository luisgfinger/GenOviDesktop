import api from "../api";
import { Funcionario } from "../../models/funcionario/FuncionarioModel";
import type { FuncionarioResponseDTO } from "../../dto/funcionario/FuncionarioResponseDTO";
import type { FuncionarioRequestDTO } from "../../dto/funcionario/FuncionarioRequestDTO";
import { FuncionarioMapper } from "../../mappers/funcionario/FuncionarioMapper";

class FuncionarioService {
  async getAll(): Promise<Funcionario[]> {
    const token = localStorage.getItem("token");
    const response = await api.get<FuncionarioResponseDTO[]>("/user/criadores", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return FuncionarioMapper.fromDTOList(response.data);
  }

  async create(data: Omit<Funcionario, "id">): Promise<Funcionario> {
    const token = localStorage.getItem("token");
    const dto: FuncionarioRequestDTO = FuncionarioMapper.toRequest(data);

    const response = await api.post<FuncionarioResponseDTO>("/user/criadores", dto, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return FuncionarioMapper.fromDTO(response.data);
  }
}

export default new FuncionarioService();
