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
      id: dto.rfid,
      nome: dto.nome ?? "Não informado",
      raca: dto.raca ?? "Não informado",
      fbb: dto.fbb ?? "Não informado",
      sexo: formatarSexo(dto.sexo),
      dataNascimento: dto.dataNascimento,
      peso: dto.peso,
      pureza: formatarPureza(dto.typeGrauPureza),
      pai: dto.ascendencia?.ovinoPai?.nome ?? "Não informado",
      mae: dto.ascendencia?.ovinoMae?.nome ?? "Não informado",
      status: dto.status ?? "Não informado",
      comportamento: dto.comportamento ?? "Não informado",
    };
  },

  toRequest(data: Omit<OvinoRequestDTO, "rfid">): OvinoRequestDTO {
    return {
      rfid: Math.floor(Math.random() * 1_000_000_000),
      ...data,
    };
  }
};
