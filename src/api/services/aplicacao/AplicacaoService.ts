import Api from "../Api";
import type { AplicacaoRequestDTO } from "../../dtos/aplicacao/AplicacaoRequestDTO";
import type { AplicacaoResponseDTO } from "../../dtos/aplicacao/AplicacaoResponseDTO";
import type { Ovino } from "../../models/ovino/OvinoModel";
import type { Medicamento } from "../../models/medicamento/MedicamentoModel";

function mapAplicacao(raw: any): AplicacaoResponseDTO {
  return {
    id: raw.id,
    ovino: (raw.ovino ?? raw.ovinoId ?? {}) as Ovino,
    dataAplicacao: raw.dataAplicacao ?? "",
    medicamento: (raw.medicamento ?? raw.medicamentoId ?? {}) as Medicamento,
  };
}

export class AplicacaoService {
 
  static async listarTodos(): Promise<AplicacaoResponseDTO[]> {
    const { data } = await Api.get<any[]>("/user/aplicacoes");
    console.log("Dados recebidos:", data);
    return data.map(mapAplicacao);
  }

  static async buscarPorId(id: number): Promise<AplicacaoResponseDTO> {
    const { data } = await Api.get<any>(`/user/aplicacoes/${id}`);
    return mapAplicacao(data);
  }

  static async criar(dto: AplicacaoRequestDTO): Promise<AplicacaoResponseDTO> {
    const payload: any = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined)
    );

    const { data } = await Api.post<any>("/user/aplicacoes", payload);
    return mapAplicacao(data);
  }

  static async editar(id: number, dto: AplicacaoRequestDTO): Promise<AplicacaoResponseDTO> {
    const payload: any = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined)
    );

    const { data } = await Api.put<any>(`/user/aplicacoes/${id}`, payload);
    return mapAplicacao(data);
  }

  static async remover(id: number): Promise<void> {
    await Api.delete(`/user/aplicacoes/${id}`);
  }
}
