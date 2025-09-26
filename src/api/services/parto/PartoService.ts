import type { PartoResponseDTO } from "../../dtos/parto/PartoResponseDTO";
import Api from "../Api";

export class PartoService {
  static async listar(): Promise<PartoResponseDTO[]> {
    const response = await Api.get<PartoResponseDTO[]>("/partos");
    return response.data;
  }
}
