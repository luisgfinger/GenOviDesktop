export interface IARouteConfig {
  match: (path: string) => boolean;
  promptPreDefinido?: string | ((path: string) => string);
  permitirInputUsuario?: boolean;
  promptOptions?: string[];
}

export const iaRouteConfig: IARouteConfig[] = [
  {
    match: (path) => path === "/dashboard/ovinos/gerenciar",
    permitirInputUsuario: true,
    promptOptions: [
      "Quais raças são melhores para produção de carne?",
      "Quais são os principais sinais de doenças em ovinos?",
      "Como melhorar a produtividade do rebanho?",
      "Como avaliar a condição corporal de ovinos?",
      "Quais são os cuidados essenciais com cordeiros?",
    ],
  },

  {
    match: (path) => path.startsWith("/dashboard/ovinos/fullinfo/"),

    permitirInputUsuario: true,

    promptPreDefinido: (path, perguntaUsuario?: string) => {
      const rfid = path.split("/").pop();
      const pergunta = perguntaUsuario ?? "";
      return `Para o ovino de RFID ${rfid}: ${pergunta}`;
    },

    promptOptions: [
      "Analise o peso deste ovino",
      "Este ovino está acima ou abaixo do ideal?",
      "Quais doenças ele já teve?",
      "Avaliação genética e pureza",
      "Este ovino serve para reprodução?",
      "Quais cuidados esse ovino precisa?",
      "O estado corporal está adequado?",
      "Historico de saúde",
      "Nutrição recomendada",
    ],
  },
];
