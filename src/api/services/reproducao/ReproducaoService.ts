import Api from "../Api";
import type { ReproducaoRequestDTO } from "../../dtos/reproducao/ReproducaoRequestDTO";
import type { ReproducaoResponseDTO } from "../../dtos/reproducao/ReproducaoResponseDTO";

export class ReproducaoService {


  static async listar(): Promise<ReproducaoResponseDTO[]> {
    const { data } = await Api.get<ReproducaoResponseDTO[]>("/user/reproducoes");

    return data.map((r: any): ReproducaoResponseDTO => ({
      id: r.id,
      carneiro: r.carneiroId ?? r.carneiroPai ?? null,
      ovelha: r.ovelhaId ?? r.ovelhaMae ?? null,
      typeReproducao: r.typeReproducao,
      dataReproducao: r.dataReproducao,
      observacoes: r.observacoes ?? null,
    }));
  }


  static async buscarPorId(id: number): Promise<ReproducaoResponseDTO> {
    const { data } = await Api.get<any>(`/user/reproducoes/${id}`);

    return {
      id: data.id,
      carneiro: data.carneiroId ?? data.carneiroPai ?? null,
      ovelha: data.ovelhaId ?? data.ovelhaMae ?? null,
      typeReproducao: data.typeReproducao,
      dataReproducao: data.dataReproducao,
      observacoes: data.observacoes ?? null,
    };
  }


  static async criar(dto: ReproducaoRequestDTO): Promise<ReproducaoResponseDTO> {
    const { data } = await Api.post<any>("/user/reproducoes", dto);

    return {
      id: data.id,
      carneiro: data.carneiroId ?? data.carneiroPai ?? null,
      ovelha: data.ovelhaId ?? data.ovelhaMae ?? null,
      typeReproducao: data.typeReproducao,
      dataReproducao: data.dataReproducao,
      observacoes: data.observacoes ?? null,
    };
  }

  static async editar(id: number, dto: ReproducaoRequestDTO): Promise<ReproducaoResponseDTO> {
    const { data } = await Api.put<any>(`/user/reproducoes/${id}`, dto);

    return {
      id: data.id,
      carneiro: data.carneiroId ?? data.carneiroPai ?? null,
      ovelha: data.ovelhaId ?? data.ovelhaMae ?? null,
      typeReproducao: data.typeReproducao,
      dataReproducao: data.dataReproducao,
      observacoes: data.observacoes ?? null,
    };
  }

  static async remover(id: number): Promise<void> {
    await Api.delete(`/user/reproducoes/${id}`);
  }
}
