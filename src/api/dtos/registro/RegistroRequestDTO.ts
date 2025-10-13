export interface RegistroRequestDTO {
  dataRegistro: string;
  funcionarioId: number;
  reproducaoId?: number;
  gestacaoId?: number;
  partoId?: number;
  aplicacaoId?: number;
  ocorrenciaDoencaId?: number;
}
