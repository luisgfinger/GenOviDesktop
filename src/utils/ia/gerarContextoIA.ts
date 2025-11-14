export function gerarContextoIA(ctx: any): string {
  if (!ctx) return "";

  if (ctx && ctx.rfid && ctx.raca) {
    const ultimaPesagem = ctx.pesagens?.at(-1)?.peso ?? "Não informado";

    return `
Contexto do ovino analisado:
- Nome: ${ctx.nome}
- RFID: ${ctx.rfid}
- Raça: ${ctx.raca}
- Sexo: ${ctx.sexo}
- Peso atual: ${ultimaPesagem} kg
- Data de nascimento: ${ctx.dataNascimento}
`.trim();
  }

  if (ctx.macho && ctx.femea) {
    return `
Contexto de análise de reprodução:

Macho:
- RFID: ${ctx.macho.rfid}
- Nome: ${ctx.macho.nome}
- Raça: ${ctx.macho.raca}
- Peso: ${ctx.macho.pesagens?.at(-1)?.peso ?? "?"} kg
- Data de nascimento: ${ctx.macho.dataNascimento}

Fêmea:
-RFID: ${ctx.femea.rfid}
- Nome: ${ctx.femea.nome}
- Raça: ${ctx.femea.raca}
- Peso: ${ctx.femea.pesagens?.at(-1)?.peso ?? "?"} kg
- Data de nascimento: ${ctx.femea.dataNascimento}
`.trim();
  }

  return `Contexto adicional:\n${JSON.stringify(ctx, null, 2)}`;
}
