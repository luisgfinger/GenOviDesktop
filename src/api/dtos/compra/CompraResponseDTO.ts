import type { VendedorResponseDTO } from "../vendedor/VendedorResponseDTO";

export interface CompraResponseDTO {
  id: number;
  dataCompra: string;
  valor: number;
  vendedor?: VendedorResponseDTO;
}
