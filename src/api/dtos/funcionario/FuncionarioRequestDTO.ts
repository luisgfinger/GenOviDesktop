export interface FuncionarioRequestDTO {
  nome: string;
  cpfCnpj: string;
  endereco: string;
  telefone: string;
  dataAdmissao: string;
  dataRecisao?: string; 
}
