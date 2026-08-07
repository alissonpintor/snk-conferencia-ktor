# SNK Conferência

Sistema de conferência e expedição de mercadorias integrado ao ERP Sankhya, construído com foco em alta performance, usabilidade móvel e arquitetura serverless.

---

## 🚀 Tecnologias Utilizadas

Este projeto utiliza um conjunto de tecnologias modernas para web e serverless:

*   **Framework:** [Svelte 5](https://svelte.dev/) & [SvelteKit](https://svelte.dev/docs/kit/introduction) (utilizando o novo sistema de reatividade baseado em **Runes** e **Snippets**).
*   **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) & [DaisyUI 5](https://daisyui.com/) para criação de uma interface moderna, responsiva e com suporte a temas.
*   **Controle de Tipos:** [TypeScript](https://www.typescriptlang.org/) para maior segurança em tempo de desenvolvimento.
*   **Gerenciamento de Estado:** Estados reativos globais/locais baseados em arquivos `.svelte.ts`.
*   **Monitoramento:** [Sentry SvelteKit SDK](https://sentry.io/) para rastreamento de erros e monitoramento de performance.
*   **Ambiente Serverless:** [Cloudflare Workers & Pages](https://workers.cloudflare.com/) via `@sveltejs/adapter-cloudflare` e [Wrangler](https://developers.cloudflare.com/workers/wrangler/).
*   **Gerenciador de Pacotes:** [pnpm](https://pnpm.io/) para gerenciamento ágil e eficiente de dependências.

---

## 📋 Funcionalidades Principais

O sistema é dividido em abas principais destinadas ao controle logístico:

1.  **Conferência:** Interface interativa para conferir as mercadorias que estão saindo, garantindo integridade com os pedidos registrados.
2.  **Recontagem:** Permite iniciar e acompanhar processos de recontagem para itens com divergências apontadas.
3.  **Divergências:** Módulo de conciliação para tratar inconsistências na conferência (com suporte a ações como Recontar, Cortar e Salvar tratativas diretamente no Sankhya).
4.  **Expedição de Mercadoria:** Listagem de separações de mercadoria, com geração de volumes de embalagem e reprinting de etiquetas de volumes em formato HTML personalizado.
5.  **Integração com ERP Sankhya:** Consumo direto das APIs de login, execução de queries (`DbExplorerSP.executeQuery`), carregamento de views (`CRUDServiceProvider.loadView`) e persistência de dados.

---

## 📂 Estrutura do Projeto

O código-fonte está estruturado seguindo os padrões do SvelteKit e regras organizacionais específicas do projeto:

```text
├── .agent/                  # Configurações de agentes de desenvolvimento
├── src/
│   ├── app.css              # Estilos globais
│   ├── app.d.ts             # Tipagens TypeScript globais (incluindo Locals e TanStack Table Meta)
│   ├── app.html             # Template HTML base
│   ├── hooks.client.ts      # Hooks de cliente (inicialização do Sentry)
│   ├── hooks.server.ts      # Hooks do servidor (Autenticação do Sankhya e Inicialização do Sentry)
│   ├── components/          # Componentes reutilizáveis compartilhados
│   │   ├── actions/         # Botões e ações de interface
│   │   ├── display/         # Exibição de dados (tabelas, grids)
│   │   ├── feedback/        # Modais, toasts e alertas
│   │   ├── input/           # Inputs e seletores de formulário
│   │   └── navigation/      # Menus e abas de navegação
│   ├── lib/                 # Lógica de negócio e utilitários
│   │   ├── error/           # Tratamento de exceções personalizadas
│   │   ├── infra/           # Clientes HTTP e infraestrutura
│   │   ├── sankhya-client/  # Cliente e serviços de integração da API Sankhya
│   │   ├── schemas/         # Validação de dados (Zod)
│   │   ├── states/          # Gerenciamento de estado reativo (Svelte 5 Runes)
│   │   └── types/           # Definições de tipos TypeScript compartilhados
│   └── routes/              # Roteamento baseado em arquivos (SvelteKit)
│       ├── api/             # Endpoints internos da aplicação
│       ├── expedicao/       # Módulo principal de conferência e expedição
│       ├── login/           # Tela e fluxo de login com seleção de servidor
│       └── logoff/          # Rota para encerramento de sessão
├── static/                  # Arquivos estáticos servidos diretamente
├── wrangler.jsonc           # Arquivo de configuração do Cloudflare Wrangler
├── package.json             # Dependências e scripts npm/pnpm
└── tsconfig.json            # Configuração do TypeScript
```

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente (`.env`)

Crie um arquivo `.env` na raiz do projeto (copiado do seu ambiente local ou baseado no modelo a seguir) para configurar as variáveis de desenvolvimento:

```env
# URLs de integração do ERP Sankhya
PROD_URL="https://sankhya.stoky.com.br"
TREINA_URL="https://teste.stoky.com.br"

# Chave de Autenticação do Sentry para upload de Source Maps durante o build
SENTRY_AUTH_TOKEN="sntrys_sua_chave_aqui"

# Credenciais Sankhya (opcional para testes/configuração local de scripts)
USUARIO_SANKHYA="seu_usuario"
PASSWORD_SANKHYA="sua_senha"
```

---

## 💻 Desenvolvimento Local

### Pré-requisitos

*   **Node.js** (versão 18 ou superior, recomendada LTS)
*   **pnpm** (versão 9 ou superior)

### Passo a Passo

1.  **Instale as dependências:**
    ```bash
    pnpm install
    ```

2.  **Inicie o servidor de desenvolvimento:**
    ```bash
    pnpm dev
    ```
    O servidor iniciará localmente e ficará acessível, por padrão, em `http://localhost:5173`. A flag `--host` configurada no script permite também acesso na rede local.

3.  **Verifique a tipagem com TypeScript (Svelte Check):**
    ```bash
    pnpm check
    ```

4.  **Verifique o Linting e Formatação:**
    ```bash
    pnpm lint
    pnpm format
    ```

### Scripts Disponíveis no `package.json`

*   `pnpm dev`: Inicia o servidor Vite local.
*   `pnpm build`: Cria a compilação de produção compatível com o Cloudflare Workers/Pages.
*   `pnpm preview`: Constrói o app e inicia um servidor local simulando o Cloudflare Wrangler (`wrangler dev`).
*   `pnpm check`: Executa a checagem estática de tipos do TypeScript e Svelte.
*   `pnpm deploy`: Constrói a aplicação e realiza o deploy no Cloudflare Workers.
*   `pnpm cf-typegen`: Gera definições TypeScript baseadas nas configurações do Wrangler.

---

## ☁️ Deploy no Cloudflare Workers

O projeto está configurado para deploy no **Cloudflare Workers** com suporte a ativos estáticos (**Workers Assets**) utilizando o `@sveltejs/adapter-cloudflare`.

### Arquivo de Configuração (`wrangler.jsonc`)

O arquivo [wrangler.jsonc](file:///c:/Projetos/snk-conferencia/wrangler.jsonc) contém os metadados do deploy:

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "snk-conferencia",
  "main": ".svelte-kit/cloudflare/_worker.js",
  "compatibility_date": "2025-10-26",
  "compatibility_flags": [
    "nodejs_als"
  ],
  "assets": {
    "binding": "ASSETS",
    "directory": ".svelte-kit/cloudflare"
  },
  "routes": [
    {
      "pattern": "conferencia.stoky.dev.br",
      "custom_domain": true
    }
  ],
  "version_metadata": {
    "binding": "CF_VERSION_METADATA"
  },
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1
  },
  "vars": {
    "PROD_URL": "https://sankhya.stoky.com.br",
    "TREINA_URL": "https://teste.stoky.com.br",
    "SENTRY_AUTH_TOKEN": "..."
  }
}
```

### Passo a Passo para Deploy

1.  **Autenticar no Cloudflare CLI:**
    Se você ainda não estiver logado no Wrangler, autentique-se no seu terminal:
    ```bash
    pnpm wrangler login
    ```

2.  **Compilar e Publicar a Aplicação:**
    Para executar o build de produção e enviar diretamente ao Cloudflare, execute:
    ```bash
    pnpm deploy
    ```
    Esse comando executa internamente `vite build` (que prepara a pasta `.svelte-kit/cloudflare` por meio do `@sveltejs/adapter-cloudflare`) seguido por `wrangler deploy`.

3.  **Verificar Logs e Roteamento:**
    Após o deploy bem-sucedido, o Wrangler gerará um link público do Worker (ex: `snk-conferencia.username.workers.dev`) ou apontará para o domínio customizado configurado (`conferencia.stoky.dev.br`).

### Configurando Segredos no Cloudflare (Secrets)

Para variáveis de ambiente sensíveis (como chaves de API secretas ou tokens que não devem constar no código fonte nem no `wrangler.jsonc`), utilize o comando `wrangler secret put`:

```bash
pnpm wrangler secret put NOME_DA_VARIAVEL
```

Por exemplo:
```bash
pnpm wrangler secret put SENTRY_AUTH_TOKEN
```
Isso solicitará o valor do segredo e o salvará de forma segura no ambiente do Cloudflare Worker.
