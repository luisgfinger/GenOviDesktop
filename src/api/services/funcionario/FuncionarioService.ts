import Api from "../Api";
import type { FuncionarioResponseDTO } from "../../dtos/funcionario/FuncionarioResponseDTO";
import type { Funcionario } from "../../models/funcionario/FuncinarioModel";

const API_URL = "/user/funcionarios";

export const FuncionarioService = {
  listarTodos: async (): Promise<FuncionarioResponseDTO[]> => {
    const response = await Api.get<FuncionarioResponseDTO[]>(API_URL);
    return response.data;
  },

  async salvar(funcionario: Omit<Funcionario, "id">): Promise<Funcionario> {
    const response = await Api.post("/user/funcionarios", funcionario);
    return response.data;
  },
  
};
