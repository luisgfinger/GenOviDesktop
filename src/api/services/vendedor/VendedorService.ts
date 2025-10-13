import Api from "../Api";
import type { VendedorResponseDTO } from "../../dtos/vendedor/VendedorResponseDTO";
import type { VendedorRequestDTO } from "../../dtos/vendedor/VendedorRequestDTO";

const API_URL = "/user/vendedores";

export const VendedorService = {
  listarTodos: async (): Promise<VendedorResponseDTO[]> => {
    const response = await Api.get<VendedorResponseDTO[]>(API_URL);
    return response.data;
  },

  async salvar(vendedor: VendedorRequestDTO): Promise<VendedorResponseDTO> {
    const response = await Api.post(API_URL, vendedor);
    return response.data;
  },
};
