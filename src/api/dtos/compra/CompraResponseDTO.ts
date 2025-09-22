import type { Vendedor } from "../../models/vendedor/VendedorModel";

export interface CompraResponseDTO {
  id: number;
  dataCompra: string;
  valor: number;
  vendedor?: Vendedor;
}
