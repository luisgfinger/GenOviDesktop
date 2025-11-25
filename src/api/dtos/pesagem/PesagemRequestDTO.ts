export interface PesagemRequestDTO {
  ovinoId: number;
  dataPesagem: string;
  peso: number;
  idFuncionario?: number;
  isSugestao?: boolean;
}
