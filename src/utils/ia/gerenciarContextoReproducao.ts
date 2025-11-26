import type { Ovino } from "../../api/models/ovino/OvinoModel";
import { formatEnum } from "../formatEnum";
import { formatDate } from "../formatDate";

function calcularIdadeMeses(iso?: string): number {
  if (!iso) return 0;
  const d = new Date(iso);
  const now = new Date();
  const anos = now.getFullYear() - d.getFullYear();
  const meses = anos * 12 + (now.getMonth() - d.getMonth());
  return now.getDate() >= d.getDate() ? meses : meses - 1;
}

export function gerarContextoReproducao(
  macho: Ovino | null,
  femea: Ovino | null
): string {

  if (!macho || !femea) return "";

  const idadeMacho = calcularIdadeMeses(macho.dataNascimento);
  const idadeFemea = calcularIdadeMeses(femea.dataNascimento);

  return `
Você é um especialista em reprodução ovina analisando a combinação entre um carneiro e uma ovelha no sistema Genovi.

DADOS DO MACHO
• Nome: ${macho.nome}
• RFID: ${macho.rfid}
• Raça: ${formatEnum(macho.raca)}
• Grau de Pureza: ${formatEnum(macho.grauPureza)}
• Idade: ${idadeMacho} meses
• Data de nascimento: ${formatDate(macho.dataNascimento ?? "")}

DADOS DA FÊMEA
• Nome: ${femea.nome}
• RFID: ${femea.rfid}
• Raça: ${formatEnum(femea.raca)}
• Grau de Pureza: ${formatEnum(femea.grauPureza)}
• Idade: ${idadeFemea} meses
• Data de nascimento: ${formatDate(femea.dataNascimento ?? "")}

INSTRUÇÕES PARA A IA
Analise se esta é uma boa combinação reprodutiva considerando:
- idade mínima recomendada dos dois
- risco genético
- consanguinidade (se possuem parentesco, evite ou alerte)
- compatibilidade de raça e pureza
- aptidão fisiológica para reprodução
- possíveis recomendações de manejo

Responda de forma clara e objetiva com base nesses dados.
Não solicite RFID novamente.
Priorize respostar curtas e objetivas.
Não ultrapassar 200 caracteres.
  `.trim();
}
