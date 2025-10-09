import Api from "../Api";
import type { PartoRequestDTO } from "../../dtos/parto/PartoRequestDTO";
import type { PartoResponseDTO } from "../../dtos/parto/PartoResponseDTO";
import type { Ovino } from "../../models/ovino/OvinoModel";
import type { GestacaoResponseDTO } from "../../dtos/gestacao/GestacaoResponseDTO";

function normalizeOvino(raw: any): Ovino | {} {
  if (!raw && raw !== 0) return {};
  if (typeof raw === "number") return ({ id: raw } as Ovino);
  if (typeof raw === "object") {
    if ("id" in raw) return (raw as Ovino);
    return (raw as Ovino);
  }

  return {};
}

export class PartoService {
  static async listar(): Promise<PartoResponseDTO[]> {
    const { data } = await Api.get<any[]>("/user/partos");
    console.log(data);

    return data.map((p: any): PartoResponseDTO => {
      const gest = p.gestacao
        ? ({
            id: p.gestacao.id,
            ovelhaPai: normalizeOvino(p.gestacao.ovelhaPai ?? p.gestacao.ovelhaPaiId),
            ovelhaMae: normalizeOvino(p.gestacao.ovelhaMae ?? p.gestacao.ovelhaMaeId),
            dataGestacao: p.gestacao.dataGestacao,
          } as GestacaoResponseDTO)
        : ({} as GestacaoResponseDTO);

      const ovinoPai =
        normalizeOvino(p.ovinoPai ?? p.ovelhaPai ?? p.ovelhaPaiId ?? p.carneiroPai ?? p.carneiroId ?? p.pai);
      const ovinoMae = normalizeOvino(p.ovinoMae ?? p.ovelhaMae ?? p.ovelhaMaeId ?? p.mae ?? p.ovelhaId);

      return {
        id: p.id,
        gestacao: gest,
        ovinoPai: ovinoPai as Ovino,
        ovinoMae: ovinoMae as Ovino,
        dataParto: p.dataParto,
      } as PartoResponseDTO;
    });
  }

  static async buscarPorId(id: number): Promise<PartoResponseDTO> {
    const { data } = await Api.get<any>(`/user/partos/${id}`);

    const gest = data.gestacao
      ? ({
          id: data.gestacao.id,
          ovelhaPai: normalizeOvino(data.gestacao.ovelhaPai ?? data.gestacao.ovelhaPaiId),
          ovelhaMae: normalizeOvino(data.gestacao.ovelhaMae ?? data.gestacao.ovelhaMaeId),
          dataGestacao: data.gestacao.dataGestacao,
        } as GestacaoResponseDTO)
      : ({} as GestacaoResponseDTO);

    const ovinoPai = normalizeOvino(data.ovinoPai ?? data.ovelhaPai ?? data.ovelhaPaiId ?? data.carneiroPai ?? data.carneiroId ?? data.pai);
    const ovinoMae = normalizeOvino(data.ovinoMae ?? data.ovelhaMae ?? data.ovelhaMaeId ?? data.mae ?? data.ovelhaId);

    return {
      id: data.id,
      gestacao: gest,
      ovinoPai: ovinoPai as Ovino,
      ovinoMae: ovinoMae as Ovino,
      dataParto: data.dataParto,
    };
  }

  static async criar(dto: PartoRequestDTO): Promise<PartoResponseDTO> {
    const { data } = await Api.post<any>("/user/partos", dto);

    const gestCriado = data.gestacao
      ? ({
          id: data.gestacao.id,
          ovelhaPai: normalizeOvino(data.gestacao.ovelhaPai ?? data.gestacao.ovelhaPaiId),
          ovelhaMae: normalizeOvino(data.gestacao.ovelhaMae ?? data.gestacao.ovelhaMaeId),
          dataGestacao: data.gestacao.dataGestacao,
        } as GestacaoResponseDTO)
      : ({} as GestacaoResponseDTO);

    const ovinoPaiCriado = normalizeOvino(data.ovinoPai ?? data.ovelhaPai ?? data.ovelhaPaiId ?? data.carneiroPai ?? data.carneiroId ?? data.pai);
    const ovinoMaeCriado = normalizeOvino(data.ovinoMae ?? data.ovelhaMae ?? data.ovelhaMaeId ?? data.mae ?? data.ovelhaId);

    return {
      id: data.id,
      gestacao: gestCriado,
      ovinoPai: ovinoPaiCriado as Ovino,
      ovinoMae: ovinoMaeCriado as Ovino,
      dataParto: data.dataParto,
    };
  }

  static async editar(
    id: number,
    dto: PartoRequestDTO
  ): Promise<PartoResponseDTO> {
    const { data } = await Api.put<any>(`/user/partos/${id}`, dto);

    const gestEditado = data.gestacao
      ? ({
          id: data.gestacao.id,
          ovelhaPai: normalizeOvino(data.gestacao.ovelhaPai ?? data.gestacao.ovelhaPaiId),
          ovelhaMae: normalizeOvino(data.gestacao.ovelhaMae ?? data.gestacao.ovelhaMaeId),
          dataGestacao: data.gestacao.dataGestacao,
        } as GestacaoResponseDTO)
      : ({} as GestacaoResponseDTO);

    const ovinoPaiEditado = normalizeOvino(data.ovinoPai ?? data.ovelhaPai ?? data.ovelhaPaiId ?? data.carneiroPai ?? data.carneiroId ?? data.pai);
    const ovinoMaeEditado = normalizeOvino(data.ovinoMae ?? data.ovelhaMae ?? data.ovelhaMaeId ?? data.mae ?? data.ovelhaId);

    return {
      id: data.id,
      gestacao: gestEditado,
      ovinoPai: ovinoPaiEditado as Ovino,
      ovinoMae: ovinoMaeEditado as Ovino,
      dataParto: data.dataParto,
    };
  }

  static async remover(id: number): Promise<void> {
    await Api.delete(`/user/partos/${id}`);
  }
}
