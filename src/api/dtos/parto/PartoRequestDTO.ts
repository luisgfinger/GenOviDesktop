export interface PartoRequestDTO {
  ovelhaMaeId: number;
  ovelhaPaiId: number;
  gestacaoId?: number;
  dataParto: string;
  idFuncionario?: number;
  isSugestao?: boolean;
}
