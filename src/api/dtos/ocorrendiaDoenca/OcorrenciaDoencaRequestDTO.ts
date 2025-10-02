export interface OcorrenciaDoencaRequestDTO {
  ovinoId: number;
  doencaId: number;
  dataInicio: string;
  dataFinal?: string;
  curada: boolean;
}
