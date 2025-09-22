import type { Vendedor } from "../vendedor/VendedorModel";

export interface Compra {
  id: number;
  dataCompra: string; 
  valor: number;
  vendedor?: Vendedor;
}