export interface ReproducaoRequestDTO {
  carneiroId?: number;
  ovelhaId?: number;
  typeReproducao: string;
  dataReproducao: string; 
  observacoes?: string;
}
