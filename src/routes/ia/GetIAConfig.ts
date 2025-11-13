import { iaRouteConfig } from "./IARoutes";

export function getIaConfig(path: string) {
  for (const config of iaRouteConfig) {
    if (config.match(path)) {
      return {
        promptPreDefinido:
          typeof config.promptPreDefinido === "function"
            ? config.promptPreDefinido(path)
            : config.promptPreDefinido,
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
