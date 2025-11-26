import type { Ovino } from "../../api/models/ovino/OvinoModel";
import { formatEnum } from "../formatEnum";
import { formatDate } from "../formatDate";

export function gerarContextoOvino(ovino: Ovino): string {
  if (!ovino) return "";

  const nome = ovino.nome ?? "Sem nome";
  const rfid = ovino.rfid ?? "Não informado";
  const sexo = formatEnum(ovino.sexo) ?? "Não informado";
  const raca = formatEnum(ovino.raca) ?? "Não informada";
  const pureza = formatEnum(ovino.grauPureza) ?? "Não informado";
  const status = formatEnum(ovino.status) ?? "Não informado";

  const nascimento = ovino.dataNascimento
    ? formatDate(ovino.dataNascimento, true)
    : "Não informado";

  const pesoAtual = ovino.pesagens?.length
    ? `${ovino.pesagens[ovino.pesagens.length - 1].peso} kg`
    : "Não informado";

  const mae = ovino.ovinoMae?.nome ?? "Não informado";
  const pai = ovino.ovinoPai?.nome ?? "Não informado";

  return `
Você está na página de informações completas de um ovino no sistema Genovi.

Dados do ovino selecionado:
• Nome: ${nome}
• RFID: ${rfid}
• Sexo: ${sexo}
• Raça: ${raca}
• Grau de Pureza: ${pureza}
• Status: ${status}
• Data de Nascimento: ${nascimento}
• Peso Atual: ${pesoAtual}
• Mãe: ${mae}
• Pai: ${pai}

Use somente esses dados como referência.
Nunca peça RFID novamente.
Responda como um especialista em ovinos.
Priorize respostas curtar e objetivas.
Não ultrapassar 200 caracteres.
  `.trim();
}
