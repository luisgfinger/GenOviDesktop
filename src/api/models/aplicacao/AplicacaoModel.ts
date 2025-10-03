import type { Medicamento } from "../medicamento/MedicamentoModel";
import type { Ovino } from "../ovino/OvinoModel";

export interface Aplicacao{
    id: number;
    ovino: Ovino;
    dataAplicacao: string;
    medicamento: Medicamento;
}