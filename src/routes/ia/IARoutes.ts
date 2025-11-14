export interface IARouteConfig {
  match: (path: string) => boolean;
  buildPromptHeader?: (path: string, contextoIA?: any) => string | undefined;
  permitirInputUsuario?: boolean;
  promptOptions?: string[];
}

export const iaRouteConfig: IARouteConfig[] = [
  {
    match: (path) => path === "/dashboard/ovinos/gerenciar",
    permitirInputUsuario: true,
    promptOptions: [
      "Quais raças são melhores para carne?",
      "Principais sinais de doenças?",
      "Como melhorar a produtividade?",
      "Como avaliar a condição corporal?",
      "Cuidados essenciais com cordeiros",
    ],
  },

  {
    match: (path) => path.startsWith("/dashboard/ovinos/fullinfo/"),
    permitirInputUsuario: true,
    buildPromptHeader: () => "Pergunta:",
    promptOptions: [
      "Analise o peso deste ovino",
      "Ele está acima ou abaixo do ideal?",
      "Quais doenças ele já teve?",
      "Avaliação genética",
      "Serve para reprodução?",
    ],
  },

  {
    match: (path) => path === "/dashboard/ovinos/reproducoes/criar",
    permitirInputUsuario: true,
    buildPromptHeader: () => "Pergunta:",
    promptOptions: [
      "Esta combinação genética é boa?",
      "A fêmea pode reproduzir neste momento?",
      "Existe risco nessa reprodução?",
      "O macho é adequado para cobertura?",
      "Previsão de características dos cordeiros",
    ],
  },
];
