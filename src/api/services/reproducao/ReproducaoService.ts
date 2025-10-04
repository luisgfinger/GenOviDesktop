import Api from "../Api";
import type { ReproducaoRequestDTO } from "../../dtos/reproducao/ReproducaoRequestDTO";
import type { ReproducaoResponseDTO } from "../../dtos/reproducao/ReproducaoResponseDTO";
import type { Ovino } from "../../models/ovino/OvinoModel";

export class ReproducaoService {

  static async listar(): Promise<ReproducaoResponseDTO[]> {
    const { data } = await Api.get<any[]>("/user/reproducoes");
    return data.map((r: any): ReproducaoResponseDTO => ({
      id: r.id,
      carneiroPai: (r.carneiroPai ?? r.carneiroId ?? r.pai ?? r.macho ?? {}) as Ovino,
      ovelhaMae: (r.ovelhaMae ?? r.ovelhaId ?? r.mae ?? r.femea ?? {}) as Ovino,
      typeReproducao: r.typeReproducao,
      dataReproducao: r.dataReproducao,
      observacoes: r.observacoes,
    }));
  }

  static async buscarPorId(id: number): Promise<ReproducaoResponseDTO> {
    const { data } = await Api.get<any>(`/user/reproducoes/${id}`);

    return {
      id: data.id,
      carneiroPai: (data.carneiroPai ?? data.carneiroId ?? {}) as Ovino,
      ovelhaMae: (data.ovelhaMae ?? data.ovelhaId ?? {}) as Ovino,
      typeReproducao: data.typeReproducao,
      dataReproducao: data.dataReproducao,
      observacoes: data.observacoes,
    };
  }

  static async criar(dto: ReproducaoRequestDTO): Promise<ReproducaoResponseDTO> {
    const { data } = await Api.post<any>("/user/reproducoes", dto);

    return {
      id: data.id,
      carneiroPai: (data.carneiroPai ?? data.carneiroId ?? {}) as Ovino,
      ovelhaMae: (data.ovelhaMae ?? data.ovelhaId ?? {}) as Ovino,
      typeReproducao: data.typeReproducao,
      dataReproducao: data.dataReproducao,
      observacoes: data.observacoes,
    };
  }

  static async editar(id: number, dto: ReproducaoRequestDTO): Promise<ReproducaoResponseDTO> {
    const { data } = await Api.put<any>(`/user/reproducoes/${id}`, dto);

    return {
      id: data.id,
      carneiroPai: (data.carneiroPai ?? data.carneiroId ?? {}) as Ovino,
      ovelhaMae: (data.ovelhaMae ?? data.ovelhaId ?? {}) as Ovino,
      typeReproducao: data.typeReproducao,
      dataReproducao: data.dataReproducao,
      observacoes: data.observacoes,
    };
  }

  static async remover(id: number): Promise<void> {
    await Api.delete(`/user/reproducoes/${id}`);
  }
}
