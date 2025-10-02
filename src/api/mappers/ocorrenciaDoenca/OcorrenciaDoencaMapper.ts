import type { OcorrenciaDoencaRequestDTO } from "../../../api/dtos/ocorrendiaDoenca/OcorrenciaDoencaRequestDTO";
import type { OcorrenciaDoencaResponseDTO } from "../../../api/dtos/ocorrendiaDoenca/OcorrenciaDoencaResponseDTO";

export const ocorrenciaDoencaMapper = {
  toRequest: (dto: OcorrenciaDoencaRequestDTO): any => ({
    ovinoId: dto.ovinoId,
    doencaId: dto.doencaId,
    dataInicio: dto.dataInicio,
    dataFinal: dto.dataFinal,
    curada: dto.curada,
  }),

  fromResponse: (data: any): OcorrenciaDoencaResponseDTO => ({
    id: data.id,
    ovino: data.ovino,
    doenca: data.doenca,
    dataInicio: data.dataInicio,
    dataFinal: data.dataFinal,
    curada: data.curada,
  }),
};
