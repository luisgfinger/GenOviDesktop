import type { MedicamentoRequestDTO } from "../../../api/dtos/medicamento/MedicamentoRequestDTO";
import type { MedicamentoResponseDTO } from "../../../api/dtos/medicamento/MedicamentoResponseDTO";

export const medicamentoMapper = {
  toRequest: (dto: MedicamentoRequestDTO): any => ({
    nome: dto.nome,
    fabricante: dto.fabricante,
    doencasIds: dto.doencasIds,
    quantidadeDoses: dto.quantidadeDoses,
    intervaloDoses: dto.intervaloDoses,
    isVacina: dto.isVacina,
  }),

  fromResponse: (data: any): MedicamentoResponseDTO => ({
    id: data.id,
    nome: data.nome,
    fabricante: data.fabricante,
    doencas: data.doencas,
    quantidadeDoses: data.quantidadeDoses,
    intervaloDoses: data.intervaloDoses,
    isVacina: data.isVacina,
  }),
};
