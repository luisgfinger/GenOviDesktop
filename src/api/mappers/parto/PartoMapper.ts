import type { PartoRequestDTO } from "../../dtos/parto/PartoRequestDTO";
import type { PartoResponseDTO } from "../../dtos/parto/PartoResponseDTO";

export const partoMapper = {
  toRequest: (dto: PartoRequestDTO): any => ({
    gestacaoId: dto.gestacaoId ?? undefined,
    ovinoMaeId: dto.ovelhaMaeId,
    ovinoPaiId: dto.ovelhaPaiId,
    dataParto: dto.dataParto,
    idFuncionario: dto.idFuncionario,
  }),

  fromResponse: (data: any): PartoResponseDTO => ({
    id: data.id,
    gestacao: data.gestacaoId,
    mae: data.mae,
    pai: data.pai,
    dataParto: data.dataParto,
  }),
};
