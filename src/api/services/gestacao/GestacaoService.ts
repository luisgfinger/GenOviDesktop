import Api from "../Api";
import type { GestacaoRequestDTO } from "../../dtos/gestacao/GestacaoRequestDTO";
import type { GestacaoResponseDTO } from "../../dtos/gestacao/GestacaoResponseDTO";
import type { Ovino } from "../../models/ovino/OvinoModel";
import type { ReproducaoResponseDTO } from "../../dtos/reproducao/ReproducaoResponseDTO";

function mapReproducao(r: any): ReproducaoResponseDTO | undefined {
  if (!r) return undefined;

  return {
    id: r.id,
    carneiro: r.carneiroId ?? r.carneiroPai?.id ?? null,
    ovelha: r.ovelhaId ?? r.ovelhaMae?.id ?? null,
    typeReproducao: r.typeReproducao ?? "",
    dataReproducao: r.dataReproducao ?? "",
    observacoes: r.observacoes ?? null,
  };
}

function mapGestacao(g: any): GestacaoResponseDTO {
  return {
    id: g.id,
    dataGestacao: g.dataGestacao ?? "",
    reproducao: mapReproducao(g.reproducao),
    ovelhaPai: {
      id: g.ovelhaPai?.id ?? g.carneiroId ?? 0,
      nome: g.ovelhaPai?.nome ?? g.carneiro?.nome ?? "",
      fbb: g.ovelhaPai?.fbb ?? "",
      rfid: g.ovelhaPai?.rfid ?? 0,
      raca: g.ovelhaPai?.raca ?? "",
      sexo: g.ovelhaPai?.sexo ?? "MACHO",
      dataNascimento: g.ovelhaPai?.dataNascimento ?? "",
    } as Ovino,
    ovelhaMae: {
      id: g.ovelhaMae?.id ?? g.ovelhaId ?? 0,
      nome: g.ovelhaMae?.nome ?? "",
      fbb: g.ovelhaMae?.fbb ?? "",
      rfid: g.ovelhaMae?.rfid ?? 0,
      raca: g.ovelhaMae?.raca ?? "",
      sexo: g.ovelhaMae?.sexo ?? "FEMEA",
      dataNascimento: g.ovelhaMae?.dataNascimento ?? "",
    } as Ovino,
  };
}

export class GestacaoService {
  static async listar(): Promise<GestacaoResponseDTO[]> {
    try {
      const { data } = await Api.get<any[]>("/user/gestacoes");
      console.log("✅ Gestacoes recebidas:", data);
      return data.map(mapGestacao);
    } catch (err: any) {
      console.error("❌ Erro ao carregar gestações:", err.response?.data || err);
      throw new Error("Não foi possível carregar as gestações.");
    }
  }

  static async buscarPorId(id: number): Promise<GestacaoResponseDTO> {
    const { data } = await Api.get<any>(`/user/gestacoes/${id}`);
    return mapGestacao(data);
  }

  static async criar(dto: GestacaoRequestDTO): Promise<GestacaoResponseDTO> {
    const { data } = await Api.post<any>("/user/gestacoes", dto);
    return mapGestacao(data);
  }

  static async editar(
    id: number,
    dto: GestacaoRequestDTO
  ): Promise<GestacaoResponseDTO> {
    const { data } = await Api.put<any>(`/user/gestacoes/${id}`, dto);
    return mapGestacao(data);
  }

  static async remover(id: number): Promise<void> {
    await Api.delete(`/user/gestacoes/${id}`);
  }
}
