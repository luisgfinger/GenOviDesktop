import Api from "../Api";
import type { MedicamentoRequestDTO } from "../../dtos/medicamento/MedicamentoRequestDTO";
import type { MedicamentoResponseDTO } from "../../dtos/medicamento/MedicamentoResponseDTO";
import type { Doenca } from "../../models/doenca/DoencaModel";

function mapMedicamento(raw: any): MedicamentoResponseDTO {
  return {
    id: raw.id,
    nome: raw.nome ?? "",
    fabricante: raw.fabricante ?? "",
    doencas: (raw.doencas ?? []) as Doenca[],
    quantidadeDoses: raw.quantidadeDoses ?? 0,
    intervaloDoses: raw.intervaloDoses ?? 0,
    isVacina: raw.isVacina ?? false,
  };
}

export class MedicamentoService {
  static async listarTodos(): Promise<MedicamentoResponseDTO[]> {
    const { data } = await Api.get<any[]>("/user/medicamentos");
    return data.map(mapMedicamento);
  }

  static async buscarPorId(id: number): Promise<MedicamentoResponseDTO> {
    const { data } = await Api.get<any>(`/user/medicamentos/${id}`);
    return mapMedicamento(data);
  }

  static async criar(
    dto: MedicamentoRequestDTO
  ): Promise<MedicamentoResponseDTO> {
    const payload: any = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined)
    );

    console.log(payload);

    const { data } = await Api.post<any>("/user/medicamentos", payload);
    return mapMedicamento(data);
  }
}
