import Api from "../Api";
import type { PartoRequestDTO } from "../../dtos/parto/PartoRequestDTO";
import type { PartoResponseDTO } from "../../dtos/parto/PartoResponseDTO";
import type { Ovino } from "../../models/ovino/OvinoModel";
import type { GestacaoResponseDTO } from "../../dtos/gestacao/GestacaoResponseDTO";


function mapParto(raw: any): PartoResponseDTO {
  return {
    id: raw.id,
    gestacao: raw.gestacao
      ? ({
          id: raw.gestacao.id,
          ovelhaPai: raw.gestacao.ovelhaPai ?? raw.gestacao.ovelhaPaiId,
          ovelhaMae: raw.gestacao.ovelhaMae ?? raw.gestacao.ovelhaMaeId,
          dataGestacao: raw.gestacao.dataGestacao,
        } as GestacaoResponseDTO)
      : ({} as GestacaoResponseDTO),
    ovelhaPai: (raw.ovelhaPai ?? raw.carneiroId ?? {}) as Ovino,
    ovelhaMae: (raw.ovelhaMae ?? raw.ovelhaId ?? {}) as Ovino,
    dataParto: raw.dataParto ?? "",
  };
}

export class PartoService {
  static async listar(): Promise<PartoResponseDTO[]> {
    const { data } = await Api.get<any[]>("/user/partos");
    return data.map(mapParto);
  }

  static async buscarPorId(id: number): Promise<PartoResponseDTO> {
    const { data } = await Api.get<any>(`/user/partos/${id}`);
    return mapParto(data);
  }

  static async criar(dto: PartoRequestDTO): Promise<PartoResponseDTO> {
  const payload: any = Object.fromEntries(
    Object.entries(dto).filter(([_, v]) => v !== undefined)
  );

  const { data } = await Api.post<any>("/user/partos", payload);
  return mapParto(data);
}

}
