export interface ReproducaoRequestDTO {
  id?: number;
  carneiroId?: number;
  ovelhaId?: number;
  enumReproducao: string;
  dataReproducao: string; 
  observacoes?: string;
}
