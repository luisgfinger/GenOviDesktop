export interface CriadorResponseDTO {
  id: string;
  cpfCnpj: string;
  endereco: string;
  nome: string;
  telefone: string;
  imagem?: string | null;
}