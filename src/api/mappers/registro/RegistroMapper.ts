import type { RegistroRequestDTO } from "../../dtos/registro/RegistroRequestDTO";
import type { RegistroResponseDTO } from "../../dtos/registro/RegistroResponseDTO";

export const registroMapper = {
  toRequest: (dto: RegistroRequestDTO): any => ({
    dataRegistro: dto.dataRegistro,
    isSugestao: dto.isSugestao,
    funcionarioId: dto.funcionarioId,
    reproducaoId: dto.reproducaoId ?? undefined,
    gestacaoId: dto.gestacaoId ?? undefined,
    partoId: dto.partoId ?? undefined,
    aplicacaoId: dto.aplicacaoId ?? undefined,
    ocorrenciaDoencaId: dto.ocorrenciaDoencaId ?? undefined,
  }),

  fromResponse: (data: any): RegistroResponseDTO => ({
    id: data.id,
    dataRegistro: data.dataRegistro,
    isSugestao: data.isSugestao,
    funcionario: data.funcionario,
    reproducao: data.reproducao ?? null,
    gestacao: data.gestacao ?? null,
    parto: data.parto ?? null,
    aplicacao: data.aplicacao ?? null,
    ocorrenciaDoenca: data.ocorrenciaDoenca ?? null,
  }),
};
