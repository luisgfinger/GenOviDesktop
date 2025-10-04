import Api from "../Api";
import type { PartoRequestDTO } from "../../dtos/parto/PartoRequestDTO";
import type { PartoResponseDTO } from "../../dtos/parto/PartoResponseDTO";
import type { Ovino } from "../../models/ovino/OvinoModel";
import type { GestacaoResponseDTO } from "../../dtos/gestacao/GestacaoResponseDTO";

export class PartoService {
  static async listar(): Promise<PartoResponseDTO[]> {
    const { data } = await Api.get<any[]>("/user/partos");

    return data.map(
      (p: any): PartoResponseDTO => ({
        id: p.id,
        gestacao: p.gestacao
          ? ({
              id: p.gestacao.id,
              ovelhaPai:
                p.gestacao.ovelhaPai ??
                p.gestacao.ovelhaPaiId ??
                ({} as Ovino),
              ovelhaMae:
                p.gestacao.ovelhaMae ??
                p.gestacao.ovelhaMaeId ??
                ({} as Ovino),
              dataGestacao: p.gestacao.dataGestacao,
            } as GestacaoResponseDTO)
          : ({} as GestacaoResponseDTO),
        ovelhaPai: (p.ovelhaPai ?? p.carneiroId ?? {}) as Ovino,
        ovelhaMae: (p.ovelhaMae ?? p.ovelhaId ?? {}) as Ovino,
        dataParto: p.dataParto,
      })
    );
  }

  static async buscarPorId(id: number): Promise<PartoResponseDTO> {
    const { data } = await Api.get<any>(`/user/partos/${id}`);

    return {
      id: data.id,
      gestacao: data.gestacao
        ? ({
            id: data.gestacao.id,
            ovelhaPai:
              data.gestacao.ovelhaPai ??
              data.gestacao.ovelhaPaiId ??
              ({} as Ovino),
            ovelhaMae:
              data.gestacao.ovelhaMae ??
              data.gestacao.ovelhaMaeId ??
              ({} as Ovino),
            dataGestacao: data.gestacao.dataGestacao,
          } as GestacaoResponseDTO)
        : ({} as GestacaoResponseDTO),
      ovelhaPai: (data.ovelhaPai ?? data.carneiroId ?? {}) as Ovino,
      ovelhaMae: (data.ovelhaMae ?? data.ovelhaId ?? {}) as Ovino,
      dataParto: data.dataParto,
    };
  }

  static async criar(dto: PartoRequestDTO): Promise<PartoResponseDTO> {
    const { data } = await Api.post<any>("/user/partos", dto);

    return {
      id: data.id,
      gestacao: data.gestacao
        ? ({
            id: data.gestacao.id,
            ovelhaPai:
              data.gestacao.ovelhaPai ??
              data.gestacao.ovelhaPaiId ??
              ({} as Ovino),
            ovelhaMae:
              data.gestacao.ovelhaMae ??
              data.gestacao.ovelhaMaeId ??
              ({} as Ovino),
            dataGestacao: data.gestacao.dataGestacao,
          } as GestacaoResponseDTO)
        : ({} as GestacaoResponseDTO),
      ovelhaPai: (data.ovelhaPai ?? data.carneiroId ?? {}) as Ovino,
      ovelhaMae: (data.ovelhaMae ?? data.ovelhaId ?? {}) as Ovino,
      dataParto: data.dataParto,
    };
  }

  static async editar(
    id: number,
    dto: PartoRequestDTO
  ): Promise<PartoResponseDTO> {
    const { data } = await Api.put<any>(`/user/partos/${id}`, dto);

    return {
      id: data.id,
      gestacao: data.gestacao
        ? ({
            id: data.gestacao.id,
            ovelhaPai:
              data.gestacao.ovelhaPai ??
              data.gestacao.ovelhaPaiId ??
              ({} as Ovino),
            ovelhaMae:
              data.gestacao.ovelhaMae ??
              data.gestacao.ovelhaMaeId ??
              ({} as Ovino),
            dataGestacao: data.gestacao.dataGestacao,
          } as GestacaoResponseDTO)
        : ({} as GestacaoResponseDTO),
      ovelhaPai: (data.ovelhaPai ?? data.carneiroId ?? {}) as Ovino,
      ovelhaMae: (data.ovelhaMae ?? data.ovelhaId ?? {}) as Ovino,
      dataParto: data.dataParto,
    };
  }

  static async remover(id: number): Promise<void> {
    await Api.delete(`/user/partos/${id}`);
  }
}
