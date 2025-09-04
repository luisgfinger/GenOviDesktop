export interface OvinoResponseDTO {
  rfid: string;
  nome: string;
  raca: string;
  fbb: string;
  dataNascimento?: string;
  typeGrauPureza?: string;
  sexo?: string;
  peso?: number;
  status?: string;
  comportamento?: string;
  ascendencia?: {
    ovinoPai?: { nome: string };
    ovinoMae?: { nome: string };
  };
}
