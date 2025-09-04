import api from "../api";
import { Criador } from "../../models/criador/CriadorModel";
import type { CriadorResponseDTO } from "../../dto/criador/CriadorReponseDto";
import { CriadorMapper } from "../../mappers/criador/CriadorMapper";

class CriadorService {
  async getAll(): Promise<Criador[]> {
    const token = localStorage.getItem("token");
    const response = await api.get<CriadorResponseDTO[]>("/user/criadores", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return CriadorMapper.fromDTOList(response.data);
  }
}

export default new CriadorService();
