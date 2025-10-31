export interface RegistroRequestDTO {
  dataRegistro: string;
  isSugestao: boolean;
  idFuncionario: number;
  idReproducao?: number;
  idGestacao?: number;
  idParto?: number;
  idAplicacoes?: number;
  idOcorrenciaDoencas?: number;
}
