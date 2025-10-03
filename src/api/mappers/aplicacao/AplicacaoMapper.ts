import type { AplicacaoRequestDTO } from "../../../api/dtos/aplicacao/AplicacaoRequestDTO";
import type { AplicacaoResponseDTO } from "../../../api/dtos/aplicacao/AplicacaoResponseDTO";

export const aplicacaoMapper = {
  toRequest: (dto: AplicacaoRequestDTO): any => ({
    ovinoId: dto.ovinoId,
    medicamentoId: dto.medicamentoId,
    data: dto.data,
  }),

  fromResponse: (data: any): AplicacaoResponseDTO => ({
    id: data.id,
    ovino: data.ovino,
    medicamento: data.medicamento,
    data: data.data,
  }),
};
