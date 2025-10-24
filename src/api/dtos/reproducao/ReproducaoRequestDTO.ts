export interface ReproducaoRequestDTO {
  id?: number;
  carneiroId?: number;
  ovelhaId?: number;
  typeReproducao: string;
  dataReproducao: string; 
  observacoes?: string;
}
