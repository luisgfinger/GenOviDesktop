export interface AplicacaoRequestDTO {
  ovinoId: number;
  dataAplicacao: string;
  medicamentoId: number;
  idFuncionario?: number;
  isSugestao?: boolean;
}
