import api from "../api";
import type { Ovino } from "../../models/ovino/Ovino";
import type { OvinoRequestDTO } from "../../dto/ovino/OvinoRequestDTO";
import type { OvinoResponseDTO } from "../../dto/ovino/OvinoResponseDTO";
import { ovinoMapper } from "../../mappers/ovino/OvinoMapper";

class OvinoService {
  async getAll(): Promise<Ovino[]> {
    const token = localStorage.getItem("token");
    const response = await api.get<OvinoResponseDTO[]>("/user/ovinos", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.map(ovinoMapper.toModel);
  }

  async create(data: Omit<OvinoRequestDTO, "rfid">): Promise<Ovino> {
    const token = localStorage.getItem("token");
    const dto = ovinoMapper.toRequest(data);

    const response = await api.post<OvinoResponseDTO>("/user/ovinos", dto, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return ovinoMapper.toModel(response.data);
  }
}

export default new OvinoService();
