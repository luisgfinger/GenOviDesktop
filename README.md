# GenOvi Desktop

Aplicação frontend em React + TypeScript para gerenciamento de rebanho ovino: cadastro e listagem de ovinos, gestações, partos, reproduções, medicamentos, compras, e demais recursos do domínio.

Este README foi escrito com foco em desenvolvedores (nível pleno): contém visão geral, comandos práticos, decisões arquiteturais e orientações para contribuição e troubleshooting.

---

## Índice

- Visão geral
- Stack
- Estrutura do repositório
- Requisitos e versão recomendada
- Setup de desenvolvimento
- Scripts úteis
- Arquitetura e decisões de design
- Padrões e convenções
- Debugging e problemas comuns
- Como contribuir
- Checklist de PR
- Contato

---

## Visão geral

GenOviDesktop é a interface de administração para um sistema de manejo de ovinos. O frontend consome uma API REST (endereços em `/user/*`) e exibe painéis de gerenciamento, formulários e relatórios.

O objetivo principal aqui é manter uma UI rápida e previsível, com atenção à tipagem (TypeScript), UX minimamente acessível e separação clara entre camada de rede (services), lógica de apresentação (hooks) e componentes visuais.

## Stack

- React 19 + TypeScript
- Vite (dev server e build)
- Axios (HTTP)
- React Router (v7)
- react-toastify (notificações)
- framer-motion (animações)
- ESLint + Prettier

## Estrutura do repositório

- `src/`
  - `api/` — services (axios), dtos, mappers e hooks (useX)
  - `components/` — componentes agrupados por domínio
  - `pages/` — páginas/rotas
  - `routes/` — roteamento e rotas protegidas
  - `styles/` — estilos globais
  - `utils/` — utilitários reutilizáveis
- `public/` — assets estáticos

Arquivos de configuração principais: `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `package.json`.

## Requisitos e versão recomendada

- Node.js 18+ (LTS)
- npm (ou yarn/pnpm)
- VS Code (recomendado) com extensões TypeScript, ESLint

## Setup de desenvolvimento

1. Clone:

```bash
git clone <repo-url>
cd genovidesktop
```

2. Instalar dependências:

```bash
npm install
```

3. Variáveis de ambiente:

- Verifique `src/api/services/Api.ts` para saber a base URL usada. Se houver `.env.example`, copie para `.env` e ajuste.

4. Rodar em modo dev:

```bash
npm run dev
```

5. Build produção:

```bash
npm run build
npm run preview
```

## Scripts úteis (no `package.json`)

- `dev` — inicia Vite dev server
- `build` — compila TypeScript (`tsc -b`) e empacota com Vite
- `preview` — preview local do build
- `lint` — executa ESLint

## Arquitetura e decisões de design

- Repositório organizado por domínio para facilitar manutenção: cada área (ovinos, partos, gestacoes...) tem seus componentes, hooks e mappers.
- `api/services/*` abstrai chamadas HTTP e mapeia a resposta bruta para DTOs usados pelo frontend.
- `api/hooks/*` expõe hooks que encapsulam loading/error e retornam os dados prontos para consumo.
- Uso de mappers (frontend) para normalizar respostas irregulares do backend — adotado quando o contrato do backend não é estável.

Decisão importante: por questões práticas, há normalizadores em `PartoService`/`ReproducaoService` que aceitam aliases (carneiroId, ovelhaPaiId, etc.) — idealmente o backend deve ser padronizado, mas no curto prazo o frontend protege contra pequenas inconsistências.

## Padrões e convenções

- Tipagem explícita em todos os DTOs e modelos (`src/api/dtos`, `src/api/models`)
- Hooks de dados seguem convenção `useX` e retornam `{ data, loading, error }` quando aplicável
- Componentes funcionais (Hooks + FC), evitar React.FC para props com children implicitos
- Estilos: CSS simples por componente; considere migrar para CSS Modules em componentes compartilhados

## Debugging e problemas comuns

- Dados faltando (pai/mãe etc.): verifique o Network tab para o payload bruto. Se o backend usar aliases (ex.: `ovelhaMaeId`), o frontend tem normalizadores temporários em `src/api/services/*`.
- Erros TS: rode `npm run build` para ver erros de compilação.
- Lint/format: rode `npm run lint` e corrija violações antes de abrir PR.

## Como contribuir

1. Abra uma issue descrevendo o problema/feature com passos para reproduzir
2. Crie branch `feature/<descrição>` ou `fix/<descrição>`
3. Faça commits atômicos e escritos em inglês/português claro
4. Execute `npm run lint` e `npm run build` localmente
5. Abra PR com descrição das mudanças e instruções de teste

## Checklist de PR (sugestão)

- [ ] Build passa (`npm run build`)
- [ ] Lint OK
- [ ] Testes (se aplicáveis) verdes
- [ ] Documentação atualizada (se aplicável)

## Contato

Se precisar de contexto ou histórico de decisões, abra uma issue ou mande uma mensagem no canal do time.

---

Quer que eu gere também `CONTRIBUTING.md`, templates de issue/PR, e um `docs/` com diagrama ER simples? Posso gerar tudo isso automaticamente.
