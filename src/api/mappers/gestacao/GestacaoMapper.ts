import type { GestacaoRequestDTO } from "../../dtos/gestacao/GestacaoRequestDTO";
import type { GestacaoResponseDTO } from "../../dtos/gestacao/GestacaoResponseDTO";

export const gestacaoMapper = {
  toRequest: (dto: GestacaoRequestDTO): any => ({
    reproducaoId: dto.reproducaoId ?? undefined,
    ovelhaMaeId: dto.ovelhaMaeId,
    ovelhaPaiId: dto.ovelhaPaiId,
    observacoes: dto.observacoes,
    dataGestacao: dto.dataGestacao,
  }),

  fromResponse: (data: any): GestacaoResponseDTO => ({
    id: data.id,
    reproducao: data.reproducaoId,
    ovelhaMae: data.ovelhaMae,
    ovelhaPai: data.ovelhaPai,
    observacoes: data.observacoes,
    dataGestacao: data.dataGestacao,
  }),
};
