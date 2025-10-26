export interface RegistroRequestDTO {
  dataRegistro: string;
  isSugestao: boolean;
  funcionarioId: number;
  reproducaoId?: number;
  gestacaoId?: number;
  partoId?: number;
  aplicacaoId?: number;
  ocorrenciaDoencaId?: number;
}
