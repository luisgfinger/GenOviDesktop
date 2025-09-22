import type { TypeGrauPureza } from "../../enums/typeGrauPureza/TypeGrauPureza";
import type { TypeRaca } from "../../enums/typeRaca/TypeRaca";
import type { TypeSexo } from "../../enums/typeSexo/TypeSexo";
import type { TypeStatus } from "../../enums/typeStatus/TypeStatus";
import type { Compra } from "../../models/compra/CompraModel";
import type { Parto } from "../../models/parto/PartoModel";
import type { Pesagem } from "../../models/pesagem/PesagemModel";

export interface OvinoResponseDTO {
  id: number;
  rfid: number;
  nome: string;
  raca: TypeRaca;
  fbb: string;
  dataNascimento?: string;
  dataCadastro?: string;
  typeGrauPureza: TypeGrauPureza;
  sexo: TypeSexo;
  maeOvino?: { id: number; nome: string }; 
  paiOvino?: { id: number; nome: string };  
  status: TypeStatus;
  fotoOvino?: string;
  compra?: Compra;
  parto?: Parto;
  pesagens?: Pesagem[];
}

