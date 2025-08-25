import api from "./api";
export interface Ovino {
  id: number;
  imagem?: string;
  nome: string;
  sexo: string;
  fbb: string;
  raca: string;
  pai: string;
  mae: string;
  pureza: string;
}

function formatarSexo(sexo?: string): string {
  switch (sexo?.toUpperCase()) {
    case "MACHO":
      return "Macho";
    case "FEMEA":
      return "Fêmea";
    default:
      return "Não informado";
  }
}

function formatarPureza(pureza?: string): string {
  switch (pureza?.toUpperCase()) {
    case "PURO_ORIGEM":
      return "Puro de origem";
    case "PURO_POR_CRUZA":
      return "Puro por cruza";
    case "CRUZADO_CONTROLADO":
      return "Cruzado controlado";
    case "CRUZADO_INDETERMINADO":
      return "Cruzado indeterminado";
    default:
      return "Não informado";
  }
}

class OvinoService {
  async getAll(): Promise<Ovino[]> {
    const token = localStorage.getItem("token");
    const response = await api.get("/user/ovinos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    return response.data.map((item: any) => {
      return {
        id: item.rfid ?? `sem-id-${Math.random()}`,
        imagem: undefined,
        nome: item.nome ?? "Não informado",
        sexo: formatarSexo(item.sexo),
        fbb: item.fbb ?? "Não informado",
        raca: item.raca ?? "Não informado",
        pai: item.ascendencia?.ovinoPai?.nome ?? "Não informado",
        mae: item.ascendencia?.ovinoMae?.nome ?? "Não informado",
        pureza: formatarPureza(item.typeGrauPureza),
      };
    });
  }
}

export default new OvinoService();
