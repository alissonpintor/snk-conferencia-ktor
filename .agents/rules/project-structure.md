---
trigger: always_on
---

# Estrutura do Projeto

Este documento descreve a organização das pastas e arquivos principais do projeto `snk-conferencia`.

## Raiz
- `eslint.config.js`: Configuração do ESLint.
- `package.json`: Metadados do projeto e dependências.
- `svelte.config.js`: Configuração do Svelte.
- `tsconfig.json`: Configuração do TypeScript.
- `vite.config.ts`: Configuração do Vite.
- `wrangler.jsonc`: Configuração do Cloudflare Wrangler.

## Código Fonte (`src`)
O diretório `src` contém todo o código da aplicação.

### Arquivos Principais
- `app.d.ts`: Declarações de tipos TypeScript globais.
- `app.html`: Template HTML base da aplicação.
- `hooks.client.ts`: Hooks executados no cliente (ex: Sentry).
- `hooks.server.ts`: Hooks executados no servidor (ex: autenticação).

### Componentes (`src/components`)
Organização de componentes reutilizáveis:
- `actions`: Botões e elementos de ação.
- `display`: Exibição de dados (tabelas, cards).
- `feedback`: Modais, toasts e alertas.
- `input`: Campos de formulário e filtros.
- `navigation`: Menu e links de navegação.

### Bibliotecas (`src/lib`)
Utilitários e lógica de negócio compartilhada:
- `error`: Tratamento de erros e exceções personalizadas.
- `infra`: Configurações de infraestrutura (banco de dados, serviços externos).
- `sankhya-client`: Cliente para integração com a API do ERP Sankhya.
- `states`: Gerenciamento de estado global (ex: Svelte 5 runes/stores).
- `types`: Definições de tipos compartilhados.
- `utils`: Funções utilitárias gerais.

### Rotas (`src/routes`)
Estrutura de rotas baseada em sistema de arquivos do SvelteKit:
- `+layout.svelte`: Layout principal aplicado a todas as rotas.
- `+page.svelte`: Página inicial da aplicação.
- `+page.server.ts`: Lógica de servidor (load/actions) da página inicial.
- `api`: Endpoints de API internos.
- `expedicao`: Módulo de expedição/conferência.
- `login`: Componente usado na autenticação.
- `logoff`: Rota para logout do sistema.
- `resize`: Funcionalidade de redimensionamento (possivelmente teste ou utilitário).
- `sentry-example`: Rota de exemplo para testes do Sentry.

## Estáticos (`static`)
Arquivos servidos diretamente:
- `favicon.svg`: Ícone da aplicação.
- `lista.png`: Imagem estática.
