export interface ReproducaoResponseDTO {
  id: number;
  carneiro: number;
  ovelha: number;
  typeReproducao: string;
  dataReproducao: string;
  observacoes?: string | null;
}
