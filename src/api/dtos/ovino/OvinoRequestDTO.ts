import { TypeGrauPureza } from "../../enums/typeGrauPureza/TypeGrauPureza";
import { TypeRaca } from "../../enums/typeRaca/TypeRaca";
import { TypeSexo } from "../../enums/typeSexo/TypeSexo";
import { TypeStatus } from "../../enums/typeStatus/TypeStatus";

export interface OvinoRequestDTO {
  rfid: number;
  nome: string;
  raca: TypeRaca;
  fbb: string;
  dataNascimento?: string;
  dataCadastro?: string;
  grauPureza: TypeGrauPureza;
  sexo: TypeSexo;
  status: TypeStatus;
  fotoOvino?: string;
  compra?: number;
  parto?: number;
  maeId?: number; 
  paiId?: number; 
}
