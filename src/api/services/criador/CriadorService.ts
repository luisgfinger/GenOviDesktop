import api from "../api";
import { Criador } from "../../models/criador/CriadorModel";
import type { CriadorResponseDTO } from "../../dto/criador/CriadorResponseDto";
import type { CriadorRequestDTO } from "../../dto/criador/CriadorRequestDto";
import { CriadorMapper } from "../../mappers/criador/CriadorMapper";

class CriadorService {
  async getAll(): Promise<Criador[]> {
    const token = localStorage.getItem("token");
    const response = await api.get<CriadorResponseDTO[]>("/user/criadores", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return CriadorMapper.fromDTOList(response.data);
  }

  async create(data: Omit<Criador, "id">): Promise<Criador> {
    const token = localStorage.getItem("token");
    const dto: CriadorRequestDTO = CriadorMapper.toRequest(data);

    const response = await api.post<CriadorResponseDTO>("/user/criadores", dto, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return CriadorMapper.fromDTO(response.data);
  }
}

export default new CriadorService();
