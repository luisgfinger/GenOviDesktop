export interface Vendedor {
  id: number;
  ativo: boolean;
  nome: string;
  cpfCnpj: string;
  email?: string;
  endereco: string;
  telefone: string;
}
