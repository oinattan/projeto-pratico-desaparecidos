# Desenvolve MT - SPA Pessoas Desaparecidas

## Dados de inscrição
- Nome: Natan Gomes Biazon
- E-mail: nattangg27@gmail.com
- Telefone: (65) 99261-6870
- Cidade / Estado: Várzea Grande, MT
- Projeto inscrito: PROJETO PRÁTICO – IMPLEMENTAÇÃO FRONT-END
- Repositório GitHub: https://github.com/oinattan/projeto-pratico-desaparecidos
- Link da versão (preview): https://desenvolve-mt.vercel.app/

## Configuração da API

1. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env.local
   ```

2. Edite o arquivo `.env.local` com a URL da API:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://abitus-api.geia.vip/v1/
   NEXT_PUBLIC_API_TIMEOUT=30000
   ```

## Notas técnicas

- **API**: ABITUS API REST v1.0 em https://abitus-api.geia.vip/swagger-ui/index.html
- **Cliente API**: Configuração centralizada em `src/lib/api/` e `src/lib/config/api.ts`
- **Componentes principais**:
  - `src/components/features/pessoa/PessoaCard.tsx`
  - `src/components/shared/Pagination.tsx`
  - `src/components/ui/forms/SearchBar.tsx`
- **Páginas**:
  - Listagem: `src/app/pessoa/page.tsx`
# Desenvolve MT — Portal de Pessoas Desaparecidas

Este repositório contém a aplicação frontend (Next.js) usada no projeto Desenvolve MT — um portal para consulta e envio de informações sobre pessoas desaparecidas.

Resumo rápido
- Framework: Next.js 15 (App Router)
- React 19
- Estilização: Tailwind CSS
- Linguagem: TypeScript

Conteúdo deste README
- Pré-requisitos
- Configuração local
- Scripts úteis (npm)
- Docker / Docker Compose
- Deploy (Vercel)
- Ambiente e variáveis (.env)
- Resolução de problemas comuns
- Contribuição

Pré-requisitos
- Node.js 20.x
- npm (ou pnpm/yarn)
- Docker (opcional, para execução em container)

Configuração local (rápida)
1. Clone o repositório:

```bash
git clone <URL_DO_REPO>
cd desenvolve-mt
```

2. Instale dependências:

```bash
npm install
```

3. Crie um arquivo de ambiente (copie o exemplo):

```bash
copy .env.example .env.local          # Windows (cmd)
Copy-Item .env.example .env.local     # PowerShell
cp .env.example .env.local            # Unix / macOS
```

4. Ajuste as variáveis em `.env.local` (ex.: `NEXT_PUBLIC_API_BASE_URL`).

5. Execute em modo desenvolvimento:

```bash
npm run dev
```

Abrir http://localhost:3000 no navegador.

Scripts npm importantes
- `npm run dev` — dev server (Next + Turbopack)
- `npm run build` — build de produção (Next)
- `npm start` — iniciar em produção (após build)
- `npm run lint` — rodar ESLint
- `npm run docker:build:prod` — construir imagem Docker otimizada para produção
- `npm run docker:run` — rodar container local (imagem padrão)
- `npm run docker:compose:up` — subir via docker-compose

Arquitetura e arquivos principais
- `src/app` — rotas e páginas (App Router)
- `src/components` — componentes reutilizáveis
- `src/lib/api` — cliente HTTP e wrappers de API
- `src/lib/config/api.ts` — configuração central da API (endpoints)
- `src/types` — tipos TypeScript

Docker (build e execução)
1. Copie o arquivo de ambiente para Docker e ajuste as variáveis:

```bash
copy .env.docker.example .env.docker   # Windows (cmd)
cp .env.docker.example .env.docker     # Unix / macOS
```

2. Build e subir container (docker-compose):

```bash
docker compose --env-file .env.docker up --build -d
```

3. Ver logs:

```bash
docker compose logs -f
```

4. Parar e remover:

```bash
docker compose down
```

Deploy (Vercel)
- O projeto é compatível com deploy no Vercel.
- Recomendações:
   - Configure as variáveis de ambiente no dashboard da Vercel (não use .env no repositório para produção).
   - Caso use imagens com URLs assinadas (S3), considere usar `unoptimized` ou um proxy server-side para evitar 404 do otimizador de imagem.

Ambiente e variáveis de ambiente
- Arquivos de exemplo:
   - `.env.example` — variáveis para desenvolvimento local
   - `.env.docker.example` — variáveis para execução via Docker
- Variáveis importantes:
   - `NEXT_PUBLIC_API_BASE_URL` ou `NEXT_PUBLIC_API_URL` — URL base da API pública usada pelo frontend
   - `NEXT_PUBLIC_API_TIMEOUT` — timeout (ms)
   - `NEXT_TELEMETRY_DISABLED=1` — desabilita telemetria do Next.js

Problemas comuns e soluções rápidas
- Erro 404 em `/_next/image?url=...` (S3 assinadas):
   - Causa: URL assinada expirada ou Next Image tentando proxyar a URL e falhando.
   - Mitigação rápida: usar `unoptimized` no componente `<Image />` quando detectar uma URL assinada.
   - Solução robusta: gerar a URL assinada no servidor no momento do request (SSR) ou usar uma API route que proxie a imagem.

- Avisos LCP com `next/image`:
   - Marque imagens acima da dobra com `priority` e garanta proporção usando `width`/`height` ou `style`/`className` apropriados.

## Dependências

Dependências (runtime):

- aceternity-ui @ ^0.2.2
- axios @ ^1.5.0
- class-variance-authority @ ^0.7.1
- classnames @ ^2.3.2
- clsx @ ^2.1.1
- framer-motion @ ^12.23.12
- lucide-react @ ^0.542.0
- motion @ ^12.23.12
- next @ 15.5.2
- next-themes @ ^0.4.6
- react @ 19.1.0
- react-dom @ 19.1.0
- react-hook-form @ ^7.45.1
- react-input-mask @ ^2.0.4
- tailwind-merge @ ^3.3.1
- tailwindcss-animate @ ^1.0.7

Dependências de desenvolvimento (devDependencies):

- @babel/core @ ^7.28.4
- @babel/generator @ ^7.28.3
- @babel/parser @ ^7.28.4
- @eslint/eslintrc @ ^3
- @tailwindcss/postcss @ ^4
- @types/node @ ^20
- @types/react @ ^19
- @types/react-dom @ ^19
- eslint @ ^9
- eslint-config-next @ 15.5.2
- fs-extra @ ^11.3.1
- glob @ ^11.0.3
- tailwindcss @ ^4
- typescript @ ^5

Instalação rápida:

```bash
npm install
```

Observação: as versões usam as entradas do `package.json` do projeto; se você usa `pnpm` ou `yarn`, adapte o comando de instalação conforme necessário.

Licença
- Verifique LICENSE no repositório (se aplicável).