export interface FuncionarioRequestDTO {
  cpfCnpj: string;
  endereco: string;
  nome: string;
  telefone: string;
  imagem?: string | null;
}