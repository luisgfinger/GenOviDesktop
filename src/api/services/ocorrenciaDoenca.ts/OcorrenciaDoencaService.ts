import Api from "../Api";
import type { OcorrenciaDoencaRequestDTO } from "../../dtos/ocorrendiaDoenca/OcorrenciaDoencaRequestDTO";
import type { OcorrenciaDoencaResponseDTO } from "../../dtos/ocorrendiaDoenca/OcorrenciaDoencaResponseDTO";
import type { Doenca } from "../../models/doenca/DoencaModel";
import type { Ovino } from "../../models/ovino/OvinoModel";

function mapOcorrenciaDoenca(raw: any): OcorrenciaDoencaResponseDTO {
  return {
    id: raw.id,
    ovino: (raw.ovino ?? raw.ovinoId ?? {}) as Ovino,
    doenca: (raw.doenca ?? raw.doencaId ?? {}) as Doenca,
    dataInicio: raw.dataInicio ?? "",
    dataFinal: raw.dataFinal ?? "",
    curado: raw.curado ?? false,
  };
}

export class OcorrenciaDoencaService {
  static async listarTodos(): Promise<OcorrenciaDoencaResponseDTO[]> {
    const { data } = await Api.get<any[]>("/user/ocorrencias-doencas");
    return data.map(mapOcorrenciaDoenca);
  }

  static async buscarPorId(id: number): Promise<OcorrenciaDoencaResponseDTO> {
    const { data } = await Api.get<any>(`/user/ocorrencias-doencas/${id}`);
    return mapOcorrenciaDoenca(data);
  }

  static async criar(
    dto: OcorrenciaDoencaRequestDTO
  ): Promise<OcorrenciaDoencaResponseDTO> {
    const payload: any = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined)
    );

    const { data } = await Api.post<any>("/user/ocorrencias-doencas", payload);
    return mapOcorrenciaDoenca(data);
  }

  static async editar(
    id: number,
    dto: OcorrenciaDoencaRequestDTO
  ): Promise<OcorrenciaDoencaResponseDTO> {
    const payload: any = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined)
    );

    const { data } = await Api.put<any>(
      `/user/ocorrencias-doencas/${id}`,
      payload
    );
    return mapOcorrenciaDoenca(data);
  }

  static async remover(id: number): Promise<void> {
    await Api.delete(`/user/ocorrencias-doencas/${id}`);
  }
}
