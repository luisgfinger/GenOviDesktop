import type { TypeGrauPureza } from "../../enums/typeGrauPureza/TypeGrauPureza";
import type { TypeRaca } from "../../enums/typeRaca/TypeRaca";
import type { TypeSexo } from "../../enums/typeSexo/TypeSexo";
import type { TypeStatus } from "../../enums/typeStatus/TypeStatus";
import type { Pesagem } from "../pesagem/PesagemModel";

export interface Ovino {
  id: number;
  rfid: number;
  nome: string;
  raca: TypeRaca;
  fbb: string;
  dataNascimento?: string;
  dataCadastro?: string;
  grauPureza: TypeGrauPureza;
  sexo: TypeSexo;

  ovinoMae?: {
    id: number;
    nome: string;
  };

  ovinoPai?: {
    id: number;
    nome: string;
  };

  status: TypeStatus;
  fotoOvino?: string;
  compra?: { id: number };
  parto?: { id: number };
  pesagens?: Pesagem[];
}


