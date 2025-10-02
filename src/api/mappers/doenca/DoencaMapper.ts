import type { Doenca } from "../../models/doenca/DoencaModel";
import type { DoencaRequestDTO } from "../../dtos/doenca/DoencaRequestDTO";
import type { DoencaResponseDTO } from "../../dtos/doenca/DoencaResponseDTO";

export const responseToModel = (dto: DoencaResponseDTO): Doenca => ({
  id: dto.id,
  nome: dto.nome,
  descricao: dto.descricao,
});

export const modelToRequest = (
  doenca: Doenca
): DoencaRequestDTO => ({
  nome: doenca.nome,
  descricao: doenca.descricao,
});
