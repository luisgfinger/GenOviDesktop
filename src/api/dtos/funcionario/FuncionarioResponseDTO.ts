export interface FuncionarioResponseDTO {
  id: number;
  nome: string;
  cpfCnpj: string;
  endereco: string;
  telefone: string;
  dataAdmissao: string;
  dataRecisao?: string;
}
