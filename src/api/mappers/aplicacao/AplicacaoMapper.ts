import type { AplicacaoRequestDTO } from "../../../api/dtos/aplicacao/AplicacaoRequestDTO";
import type { AplicacaoResponseDTO } from "../../../api/dtos/aplicacao/AplicacaoResponseDTO";

export const aplicacaoMapper = {
  toRequest: (dto: AplicacaoRequestDTO): any => ({
    ovinoId: dto.ovinoId,
    dataAplicacao: dto.dataAplicacao,
    medicamentoId: dto.medicamentoId,
    idFuncionario: dto.idFuncionario,
    isSugestao: dto.isSugestao,
  }),

  fromResponse: (data: any): AplicacaoResponseDTO => ({
    id: data.id,
    ovino: data.ovino,
    dataAplicacao: data.data,
    medicamento: data.medicamento,
  }),
};
