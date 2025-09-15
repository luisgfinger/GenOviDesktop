import type { FuncionarioRequestDTO } from "../../dto/funcionario/FuncionarioRequestDTO";
import type { FuncionarioResponseDTO } from "../../dto/funcionario/FuncionarioResponseDTO";
import { Funcionario } from "../../models/funcionario/FuncionarioModel";

export class FuncionarioMapper {
  static fromDTO(dto: FuncionarioResponseDTO): Funcionario {
    return new Funcionario(
      dto.id,
      dto.cpfCnpj,
      dto.endereco,
      dto.nome,
      dto.telefone,
    );
  }

  static fromDTOList(dtos: FuncionarioResponseDTO[]): Funcionario[] {
    return dtos.map(dto => this.fromDTO(dto));
  }

  static toRequest(funcionario: Omit<Funcionario, "id">): FuncionarioRequestDTO {
    return {
      cpfCnpj: funcionario.cpfCnpj,
      endereco: funcionario.endereco,
      nome: funcionario.nome,
      telefone: funcionario.telefone,
    };
  }
}
