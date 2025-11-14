import { iaRouteConfig } from "./IARoutes";

export function getIaConfig(path: string, contextoIA?: any) {
  for (const config of iaRouteConfig) {
    if (config.match(path)) {
      return {
        promptPreDefinido: config.buildPromptHeader?.(path, contextoIA),
        permitirInputUsuario: config.permitirInputUsuario ?? true,
        promptOptions: config.promptOptions ?? [],
      };
    }
  }

  return {
    promptPreDefinido: undefined,
    permitirInputUsuario: true,
    promptOptions: [],
  };
}
