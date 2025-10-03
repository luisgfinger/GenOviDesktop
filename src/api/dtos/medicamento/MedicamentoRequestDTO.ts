export interface MedicamentoRequestDTO {
  nome: string;
  fabricante: string;
  doencasIds: number[];
  quantidadeDoses: number;
  intervaloDoses: number;
  isVacina: boolean;
}
