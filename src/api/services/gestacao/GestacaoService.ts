import Api from "../Api";
import type { GestacaoRequestDTO } from "../../dtos/gestacao/GestacaoRequestDTO";
import type { GestacaoResponseDTO } from "../../dtos/gestacao/GestacaoResponseDTO";
import type { Ovino } from "../../models/ovino/OvinoModel";
import type { ReproducaoResponseDTO } from "../../dtos/reproducao/ReproducaoResponseDTO";

export class GestacaoService {
  static async listar(): Promise<GestacaoResponseDTO[]> {
    const { data } = await Api.get<any[]>("/user/gestacoes");

    return data.map(
      (g: any): GestacaoResponseDTO => ({
        id: g.id,
        reproducao: g.reproducao
          ? ({
              id: g.reproducao.id,
              carneiroPai:
                g.reproducao.carneiroPai ??
                g.reproducao.carneiroId ??
                ({} as Ovino),
              ovelhaMae:
                g.reproducao.ovelhaMae ??
                g.reproducao.ovelhaId ??
                ({} as Ovino),
              typeReproducao: g.reproducao.typeReproducao,
              dataReproducao: g.reproducao.dataReproducao,
              observacoes: g.reproducao.observacoes,
            } as ReproducaoResponseDTO)
          : ({} as ReproducaoResponseDTO),
        ovelhaPai: (g.ovelhaPai ?? g.carneiroId ?? {}) as Ovino,
        ovelhaMae: (g.ovelhaMae ?? g.ovelhaId ?? {}) as Ovino,
        dataGestacao: g.dataGestacao,
      })
    );
  }

  static async buscarPorId(id: number): Promise<GestacaoResponseDTO> {
    const { data } = await Api.get<any>(`/user/gestacoes/${id}`);

    return {
      id: data.id,
      reproducao: data.reproducao
        ? ({
            id: data.reproducao.id,
            carneiroPai:
              data.reproducao.carneiroPai ??
              data.reproducao.carneiroId ??
              ({} as Ovino),
            ovelhaMae:
              data.reproducao.ovelhaMae ??
              data.reproducao.ovelhaId ??
              ({} as Ovino),
            typeReproducao: data.reproducao.typeReproducao,
            dataReproducao: data.reproducao.dataReproducao,
            observacoes: data.reproducao.observacoes,
          } as ReproducaoResponseDTO)
        : ({} as ReproducaoResponseDTO),
      ovelhaPai: (data.ovelhaPai ?? data.carneiroId ?? {}) as Ovino,
      ovelhaMae: (data.ovelhaMae ?? data.ovelhaId ?? {}) as Ovino,
      dataGestacao: data.dataGestacao,
    };
  }

  static async criar(dto: GestacaoRequestDTO): Promise<GestacaoResponseDTO> {
    const { data } = await Api.post<any>("/user/gestacoes", dto);

    return {
      id: data.id,
      reproducao: data.reproducao
        ? ({
            id: data.reproducao.id,
            carneiroPai:
              data.reproducao.carneiroPai ??
              data.reproducao.carneiroId ??
              ({} as Ovino),
            ovelhaMae:
              data.reproducao.ovelhaMae ??
              data.reproducao.ovelhaId ??
              ({} as Ovino),
            typeReproducao: data.reproducao.typeReproducao,
            dataReproducao: data.reproducao.dataReproducao,
            observacoes: data.reproducao.observacoes,
          } as ReproducaoResponseDTO)
        : ({} as ReproducaoResponseDTO),
      ovelhaPai: (data.ovelhaPai ?? data.carneiroId ?? {}) as Ovino,
      ovelhaMae: (data.ovelhaMae ?? data.ovelhaId ?? {}) as Ovino,
      dataGestacao: data.dataGestacao,
    };
  }

  static async editar(
    id: number,
    dto: GestacaoRequestDTO
  ): Promise<GestacaoResponseDTO> {
    const { data } = await Api.put<any>(`/user/gestacoes/${id}`, dto);

    return {
      id: data.id,
      reproducao: data.reproducao
        ? ({
            id: data.reproducao.id,
            carneiroPai:
              data.reproducao.carneiroPai ??
              data.reproducao.carneiroId ??
              ({} as Ovino),
            ovelhaMae:
              data.reproducao.ovelhaMae ??
              data.reproducao.ovelhaId ??
              ({} as Ovino),
            typeReproducao: data.reproducao.typeReproducao,
            dataReproducao: data.reproducao.dataReproducao,
            observacoes: data.reproducao.observacoes,
          } as ReproducaoResponseDTO)
        : ({} as ReproducaoResponseDTO),
      ovelhaPai: (data.ovelhaPai ?? data.carneiroId ?? {}) as Ovino,
      ovelhaMae: (data.ovelhaMae ?? data.ovelhaId ?? {}) as Ovino,
      dataGestacao: data.dataGestacao,
    };
  }

  static async remover(id: number): Promise<void> {
    await Api.delete(`/user/gestacoes/${id}`);
  }
}
