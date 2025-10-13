export interface VendedorResponseDTO {
  id: number;
  nome: string;
  cpfCnpj: string;
  email?: string;
  endereco?: string;
  telefone?: string;
  ativo: boolean;
}
