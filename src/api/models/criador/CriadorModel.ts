export class Criador {
  id: number;
  cpfCnpj: string;
  endereco: string;
  nome: string;
  telefone: string;
  imagem?: string;

  constructor(
    id: number,
    cpfCnpj: string,
    endereco: string,
    nome: string,
    telefone: string,
    imagem?: string
  ) {
    this.id = id;
    this.cpfCnpj = cpfCnpj;
    this.endereco = endereco;
    this.nome = nome;
    this.telefone = telefone;
    this.imagem = imagem;
  }
}
