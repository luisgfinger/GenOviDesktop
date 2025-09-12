import type { Ovino } from "../../models/ovino/Ovino";
import type { OvinoResponseDTO } from "../../dto/ovino/OvinoResponseDTO";
import type { OvinoRequestDTO } from "../../dto/ovino/OvinoRequestDTO";

function formatarSexo(sexo?: string): string {
  switch (sexo?.toUpperCase()) {
    case "MACHO": return "Macho";
    case "FEMEA": return "Femea";
    default: return "Não informado";
  }
}

function formatarPureza(pureza?: string): string {
  switch (pureza?.toUpperCase()) {
    case "PURO_ORIGEM": return "Puro de origem";
    case "PURO_POR_CRUZA": return "Puro por cruza";
    case "CRUZADO_CONTROLADO": return "Cruzado controlado";
    case "CRUZADO_INDETERMINADO": return "Cruzado indeterminado";
    default: return "Não informado";
  }
}

export const ovinoMapper = {
  toModel(dto: OvinoResponseDTO): Ovino {
    return {
      id: dto.id,
      nome: dto.nome,
      raca: dto.raca,
      fbb: dto.fbb,
      rfid: dto.rfid ?? "Não informado",
      sexo: formatarSexo(dto.sexo),
      dataNascimento: dto.dataNascimento?? "Não informado",
      peso: dto.peso?? 0,
      pureza: formatarPureza(dto.typeGrauPureza),
      pai: dto.ascendencia?.ovinoPai?.nome ?? "Não informado",
      mae: dto.ascendencia?.ovinoMae?.nome ?? "Não informado",
      status: dto.status,
      comportamento: dto.comportamento ?? "Não informado",
    };
  },

toRequest(data: OvinoRequestDTO): OvinoRequestDTO {
  return data;
}

};
