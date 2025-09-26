import Api from "../Api";
import type { ReproducaoRequestDTO } from "../../dtos/reproducao/ReproducaoRequestDTO";
import type { ReproducaoResponseDTO } from "../../dtos/reproducao/ReproducaoResponseDTO";

export class ReproducaoService {
  static async listar(): Promise<ReproducaoResponseDTO[]> {
    const response = await Api.get<ReproducaoResponseDTO[]>("/user/reproducoes");
    console.log(response);
    return response.data;
  }

  static async buscarPorId(id: number): Promise<ReproducaoResponseDTO> {
    const response = await Api.get<ReproducaoResponseDTO>(`/user/reproducoes/${id}`);
    return response.data;
  }

  static async criar(dto: ReproducaoRequestDTO): Promise<ReproducaoResponseDTO> {
    const response = await Api.post<ReproducaoResponseDTO>("/user/reproducoes", dto);
    return response.data;
  }
}
