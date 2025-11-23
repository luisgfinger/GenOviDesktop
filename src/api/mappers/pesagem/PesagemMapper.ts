import type { PesagemRequestDTO } from "../../../api/dtos/pesagem/PesagemRequestDTO";
import type { PesagemResponseDTO } from "../../../api/dtos/pesagem/PesagemResponseDTO";

export const pesagemMapper = {
  toRequest: (dto: PesagemRequestDTO): any => ({
    idOvino: dto.ovinoId,
    dataPesagem: dto.dataPesagem,
    pesagem: dto.peso,
    idFuncionario: dto.idFuncionario,
  }),

  fromResponse: (data: any): PesagemResponseDTO => ({
    id: data.id,
    ovino: data.ovino,
    dataPesagem: data.dataPesagem,
    peso: data.peso,
  }),
};
