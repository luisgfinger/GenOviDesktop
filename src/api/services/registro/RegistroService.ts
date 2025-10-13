import Api from "../Api";
import type { RegistroRequestDTO } from "../../dtos/registro/RegistroRequestDTO";
import type { RegistroResponseDTO } from "../../dtos/registro/RegistroResponseDTO";
import type { Funcionario } from "../../models/funcionario/FuncinarioModel";
import type { Reproducao } from "../../models/reproducao/ReproducaoModel";
import type { Gestacao } from "../../models/gestacao/GestacaoModel";
import type { Parto } from "../../models/parto/PartoModel";
import type { Aplicacao } from "../../models/aplicacao/AplicacaoModel";
import type { OcorrenciaDoenca } from "../../models/ocorrenciaDoenca/ocorrenciaDoencaModel";

function mapRegistro(raw: any): RegistroResponseDTO {
  return {
    id: raw.id,
    dataRegistro: raw.dataRegistro ?? "",
    funcionario: (raw.funcionario ?? raw.funcionarioId ?? {}) as Funcionario,
    reproducao: (raw.reproducao ?? raw.reproducaoId ?? null) as Reproducao | null,
    gestacao: (raw.gestacao ?? raw.gestacaoId ?? null) as Gestacao | null,
    parto: (raw.parto ?? raw.partoId ?? null) as Parto | null,
    aplicacao: (raw.aplicacao ?? raw.aplicacaoId ?? null) as Aplicacao | null,
    ocorrenciaDoenca: (raw.ocorrenciaDoenca ?? raw.ocorrenciaDoencaId ?? null) as OcorrenciaDoenca | null,
  };
}

export class RegistroService {

  static async listarTodos(): Promise<RegistroResponseDTO[]> {
    const { data } = await Api.get<any[]>("/user/registros");
    return data.map(mapRegistro);
  }

  static async buscarPorId(id: number): Promise<RegistroResponseDTO> {
    const { data } = await Api.get<any>(`/user/registros/${id}`);
    return mapRegistro(data);
  }

  static async criar(dto: RegistroRequestDTO): Promise<RegistroResponseDTO> {
    const payload: any = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined)
    );

    const { data } = await Api.post<any>("/user/registros", payload);
    return mapRegistro(data);
  }

  static async editar(id: number, dto: RegistroRequestDTO): Promise<RegistroResponseDTO> {
    const payload: any = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined)
    );

    const { data } = await Api.put<any>(`/user/registros/${id}`, payload);
    return mapRegistro(data);
  }

  static async remover(id: number): Promise<void> {
    await Api.delete(`/user/registros/${id}`);
  }
}
