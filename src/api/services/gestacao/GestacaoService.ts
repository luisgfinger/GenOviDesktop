import Api from "../Api";
import type { GestacaoRequestDTO } from "../../dtos/gestacao/GestacaoRequestDTO";
import type { GestacaoResponseDTO } from "../../dtos/gestacao/GestacaoResponseDTO";
import type { Ovino } from "../../models/ovino/OvinoModel";
import type { ReproducaoResponseDTO } from "../../dtos/reproducao/ReproducaoResponseDTO";

function mapGestacao(raw: any): GestacaoResponseDTO {
  return {
    id: raw.id,
    reproducao: raw.reproducao
      ? ({
          id: raw.reproducao.id,
          carneiroPai: raw.reproducao.carneiroPai ?? raw.reproducao.carneiroId,
          ovelhaMae: raw.reproducao.ovelhaMae ?? raw.reproducao.ovelhaId,
          typeReproducao: raw.reproducao.typeReproducao,
          dataReproducao: raw.reproducao.dataReproducao,
          observacoes: raw.reproducao.observacoes,
        } as ReproducaoResponseDTO)
      : ({} as ReproducaoResponseDTO),
    ovelhaPai: (raw.ovelhaPai ?? raw.carneiroId ?? {}) as Ovino,
    ovelhaMae: (raw.ovelhaMae ?? raw.ovelhaId ?? {}) as Ovino,
    dataGestacao: raw.dataGestacao ?? "",
  };
}

export class GestacaoService {
  static async listar(): Promise<GestacaoResponseDTO[]> {
    const { data } = await Api.get<any[]>("/user/gestacoes");
    return data.map(mapGestacao);
  }

  static async buscarPorId(id: number): Promise<GestacaoResponseDTO> {
    const { data } = await Api.get<any>(`/user/gestacoes/${id}`);
    return mapGestacao(data);
  }

  static async criar(dto: GestacaoRequestDTO): Promise<GestacaoResponseDTO> {
  const payload: any = Object.fromEntries(
    Object.entries(dto).filter(([_, v]) => v !== undefined)
  );

  const { data } = await Api.post<any>("/user/gestacoes", payload);
  return mapGestacao(data);
}

}
