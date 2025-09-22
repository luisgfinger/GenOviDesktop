import type { Funcionario } from "../../models/funcionario/FuncinarioModel";
import type { FuncionarioRequestDTO } from "../../dtos/funcionario/FuncionarioRequestDTO";
import type { FuncionarioResponseDTO } from "../../dtos/funcionario/FuncionarioResponseDTO";

export const responseToModel = (dto: FuncionarioResponseDTO): Funcionario => ({
  id: dto.id,
  nome: dto.nome,
  cpfCnpj: dto.cpfCnpj,
  endereco: dto.endereco,
  telefone: dto.telefone,
  dataAdmissao: dto.dataAdmissao,
  dataRecisao: dto.dataRecisao,
});

export const modelToRequest = (
  funcionario: Funcionario
): FuncionarioRequestDTO => ({
  nome: funcionario.nome,
  cpfCnpj: funcionario.cpfCnpj,
  endereco: funcionario.endereco,
  telefone: funcionario.telefone,
  dataAdmissao: funcionario.dataAdmissao,
  dataRecisao: funcionario.dataRecisao,
});
