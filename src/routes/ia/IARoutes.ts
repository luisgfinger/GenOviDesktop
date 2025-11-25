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
      "Quais doenças já teve?",
      "Alguma doença que impeça reprodução?",
      "Alguma doença geneticamente transmissível?",
      "Está em idade reprodutiva?",
    ],
  },

  {
    match: (path) => path === "/dashboard/ovinos/reproducoes/criar",
    permitirInputUsuario: true,
    buildPromptHeader: () => "Pergunta:",
    promptOptions: [
      "Esta combinação é boa para reprrodução?",
      "Existe risco nessa reprodução?",
      "O macho é adequado para cobertura?",
    ],
  },
];
