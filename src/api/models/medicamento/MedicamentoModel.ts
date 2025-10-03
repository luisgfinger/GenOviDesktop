import type { Doenca } from "../doenca/DoencaModel";

export interface Medicamento {
    id: number;
    nome: string;
    fabricante: string;
    doencas: Doenca[];
    quantidadeDoses: number;
    intervaloDoses: number;
    isVacina: boolean;
    
}