import Api from "../Api";
import type { ReproducaoRequestDTO } from "../../dtos/reproducao/ReproducaoRequestDTO";
import type { ReproducaoResponseDTO } from "../../dtos/reproducao/ReproducaoResponseDTO";

export class ReproducaoService {

  static async listar(): Promise<ReproducaoResponseDTO[]> {
    const { data } = await Api.get<ReproducaoResponseDTO[]>("/user/reproducoes");
    console.log("Reproduções recebidas:", data);

    return data.map((r: any): ReproducaoResponseDTO => ({
      id: r.id,
      carneiro: r.carneiro ?? null,
      ovelha: r.ovelha ?? null,
      typeReproducao: r.typeReproducao,
      dataReproducao: r.dataReproducao,
      observacoes: r.observacoes ?? null,
    }));
  }


  static async buscarPorId(id: number): Promise<ReproducaoResponseDTO> {
    const { data } = await Api.get<any>(`/user/reproducoes/${id}`);
    console.log("Reprodução encontrada:", data);

    return {
      id: data.id,
      carneiro: data.carneiro ?? null,
      ovelha: data.ovelha ?? null,
      typeReproducao: data.typeReproducao,
      dataReproducao: data.dataReproducao,
      observacoes: data.observacoes ?? null,
    };
  }

 
  static async criar(dto: ReproducaoRequestDTO): Promise<ReproducaoResponseDTO> {
    const { data } = await Api.post<any>("/user/reproducoes", dto);
    console.log("Reprodução criada:", data);

    return {
      id: data.id,
      carneiro: data.carneiro ?? null,
      ovelha: data.ovelha ?? null,
      typeReproducao: data.typeReproducao,
      dataReproducao: data.dataReproducao,
      observacoes: data.observacoes ?? null,
    };
  }


  static async editar(id: number, dto: ReproducaoRequestDTO): Promise<ReproducaoResponseDTO> {
    const { data } = await Api.put<any>(`/user/reproducoes/${id}`, dto);
    console.log("Reprodução atualizada:", data);

    return {
      id: data.id,
      carneiro: data.carneiro ?? null,
      ovelha: data.ovelha ?? null,
      typeReproducao: data.typeReproducao,
      dataReproducao: data.dataReproducao,
      observacoes: data.observacoes ?? null,
    };
  }

 
  static async remover(id: number): Promise<void> {
    await Api.delete(`/user/reproducoes/${id}`);
    console.log(`Reprodução ID ${id} removida com sucesso.`);
  }
}
