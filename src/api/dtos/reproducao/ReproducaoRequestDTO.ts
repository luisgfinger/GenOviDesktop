export interface ReproducaoRequestDTO {
  id?: number;
  carneiroId?: number;
  ovelhaId?: number;
  enumReproducao: string;
  dataReproducao: string; 
  idFuncionario?: number;
  isSugestao?: boolean;
}
