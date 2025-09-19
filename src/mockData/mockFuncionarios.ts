import type { Funcionario } from "../api/models/funcionario/FuncinarioModel";

export const mockFuncionarios: Funcionario[] = [
  {
    nome: "Carlos Silva",
    endereco: "Rua das Flores, 123 - Porto Alegre, RS",
    telefone: "(51) 98765-4321",
    dataAdmissao: "2020-02-15",
    cpfCnpj: "123.456.789-00",
    dataRescisao: undefined,
  },
  {
    nome: "Fernanda Oliveira",
    endereco: "Avenida Brasil, 456 - São Paulo, SP",
    telefone: "(11) 91234-5678",
    dataAdmissao: "2019-11-10",
    cpfCnpj: "987.654.321-00",
    dataRescisao: undefined,
  },
  {
    nome: "Ricardo Santos",
    endereco: "Rua das Palmeiras, 789 - Curitiba, PR",
    telefone: "(41) 99876-5432",
    dataAdmissao: "2021-07-01",
    cpfCnpj: "321.654.987-00",
    dataRescisao: undefined,
  },
  {
    nome: "Mariana Costa",
    endereco: "Travessa Central, 321 - Belo Horizonte, MG",
    telefone: "(31) 93456-7890",
    dataAdmissao: "2022-03-20",
    cpfCnpj: "654.987.321-00",
    dataRescisao: undefined,
  },
  {
    nome: "João Pereira",
    endereco: "Rua do Comércio, 654 - Florianópolis, SC",
    telefone: "(48) 97654-3210",
    dataAdmissao: "2018-09-05",
    cpfCnpj: "456.123.789-00",
    dataRescisao: undefined,
  },
];
