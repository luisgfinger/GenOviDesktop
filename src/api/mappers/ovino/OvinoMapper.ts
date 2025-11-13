import type { Ovino } from "../../models/ovino/OvinoModel";
import type { OvinoRequestDTO } from "../../dtos/ovino/OvinoRequestDTO";
import type { OvinoResponseDTO } from "../../dtos/ovino/OvinoResponseDTO";


export const responseToModel = (dto: OvinoResponseDTO): Ovino => ({
  id: dto.id,
  rfid: dto.rfid,
  nome: dto.nome,
  raca: dto.raca,
  fbb: dto.fbb,
  dataNascimento: dto.dataNascimento,
  dataCadastro: dto.dataCadastro,
  grauPureza: dto.grauPureza,
  sexo: dto.sexo,
  ovinoMae: dto.maeOvino ? { id: dto.maeOvino.id, nome: dto.maeOvino.nome } : undefined,
  ovinoPai: dto.paiOvino ? { id: dto.paiOvino.id, nome: dto.paiOvino.nome } : undefined,
  status: dto.status,
  fotoOvino: dto.fotoOvino,
  compra: dto.compra ? { id: dto.compra.id } : undefined,
  parto: dto.parto ? { id: dto.parto.id } : undefined,
  pesagens: dto.pesos ?? [],
});


export const modelToRequest = (ovino: Ovino): OvinoRequestDTO => ({
  rfid: ovino.rfid,
  nome: ovino.nome,
  raca: ovino.raca,
  fbb: ovino.fbb,
  dataNascimento: ovino.dataNascimento,
  dataCadastro: ovino.dataCadastro,
  grauPureza: ovino.grauPureza,
  sexo: ovino.sexo,
  maeId: ovino.ovinoMae?.id && ovino.ovinoMae.id > 0 ? ovino.ovinoMae.id : undefined,
  paiId: ovino.ovinoPai?.id && ovino.ovinoPai.id > 0 ? ovino.ovinoPai.id : undefined,
  compra: ovino.compra?.id && ovino.compra.id > 0 ? ovino.compra.id : undefined,
  parto: ovino.parto?.id && ovino.parto.id > 0 ? ovino.parto.id : undefined,
  status: ovino.status,
  fotoOvino: ovino.fotoOvino,
});