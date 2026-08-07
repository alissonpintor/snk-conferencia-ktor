# Documento de Requisitos de Produto (PRD): Refatoração de Autenticação e Autorização

## Visão Geral

Este documento descreve os requisitos para a refatoração do módulo de autenticação e autorização do projeto `snk-conferencia`. O objetivo não é alterar a lógica de integração com o backend (Sankhya), mas sim modernizar a base de código utilizando **Svelte 5 (Runes)**, **TypeScript** robusto e **Tailwind CSS** para estilização, além de melhorar a experiência do usuário (UX) durante o processo de login e feedback de erros.

## Objetivos

- **Modernização do Código**: Migrar componentes e lógica para Svelte 5 (Runes), eliminando sintaxe legada.
- **Melhoria de UX**: Fornecer feedback visual claro (estados de carregamento, mensagens de erro amigáveis) e uma interface polida.
- **Manutenibilidade**: Organizar a lógica de autenticação e validação em serviços reutilizáveis e tipados.
- **Confiabilidade**: Adicionar testes automatizados (E2E) para garantir que o fluxo de login funcione perfeitamente.
- **Padronização**: Garantir que o estilo de código siga as melhores práticas de desenvolvimento definidas.

## Histórias de Usuário

1.  **Como usuário final**, quero fazer login informando meu usuário e senha e recebendo feedback imediato caso erre meus dados, para que eu possa acessar o sistema rapidamente.
2.  **Como usuário final**, quero ver um indicador claro de "carregando" enquanto o sistema processa meu login, para saber que minha ação foi recebida.
3.  **Como desenvolvedor**, quero que a validação dos dados de entrada seja feita de forma robusta (ex: Zod) tanto no cliente quanto no servidor, para evitar erros comuns.
4.  **Como desenvolvedor**, quero que o código de autenticação seja modular e fácil de testar, separando a lógica de UI da lógica de negócios (integração Sankhya).

## Funcionalidades Principais

### 1. Refatoração da Página de Login (`+page.svelte`)
- **Migração para Runes**: Substituir `let` reativos e `export let` por `$state`, `$derived`, `$props` e `$effect`.
- **Formulário Aprimorado**:
    - Utilizar **Superforms** ou gerenciamento de formulário nativo do Svelte 5 com `use:enhance` otimizado.
    - Validação de campos (usuário/senha obrigatórios) com feedback visual inline (bordas vermelhas, mensagens de texto abaixo do campo).
- **Feedback de Carregamento**:
    - Botão de "Entrar" deve mostrar estado de `disabled` e um spinner/texto de "Entrando..." durante a requisição.
- **Estilização**:
    - Utilizar classes utilitárias do Tailwind CSS para layout responsivo.
    - Garantir contraste adequado e acessibilidade (foco nos campos, labels claros).

### 2. Refatoração da Lógica de Servidor (`+page.server.ts`)
- **Validação com Zod**: Implementar schema Zod para validar `username` e `password` antes de enviar para a API.
- **Serviço de Autenticação**: Extrair a lógica de chamada `fetch` para a API do Sankhya (endpoint `MobileLoginSP.login`) para um serviço dedicado em `$lib/services/auth.service.ts` (ou similar).
    - Tratamento de erro de conexão.
    - Parsing da resposta legado (Windows-1252) de forma isolada.
- **Gestão de Cookies**: Manter a lógica de setar `SessionID` e `Usuario`, mas garantir que os cookies tenham configurações seguras (`httpOnly`, `secure` em prod, `sameSite`).

### 3. Melhoria no Middleware (`hooks.server.ts`)
- **Simplificação**: Refatorar `serverSelectedSankhya` e `authGuardSankhya` para serem mais legíveis.
- **Tipagem**: Garantir que `event.locals` esteja devidamente tipado no arquivo `app.d.ts`.
- **Redirecionamento Inteligente**: Garantir que usuários não autenticados sejam redirecionados para login e, após login, voltem para a página que tentaram acessar (se aplicável, ou apenas `/expedicao` como padrão).

### 4. Testes Automatizados (E2E)
- Criar teste E2E com Playwright cobrindo:
    - Login com sucesso (redirecionamento).
    - Login com falha (usuário inválido/senha incorreta).
    - Validação de campos vazios.
    - Feedback visual de erro.

## Experiência do Usuário

- **Estado Inicial**: Formulário limpo, foco no campo "Usuário".
- **Interação**: Ao submeter, o botão é desabilitado e mostra spinner.
- **Sucesso**: Redirecionamento suave para o dashboard.
- **Erro**: Toast ou mensagem de alerta visível sem recarregar a página, campos com erro destacados.

## Restrições Técnicas de Alto Nível

- **Framework**: Svelte 5 (Runes mode).
- **Estilização**: Tailwind CSS.
- **Backend Legacy**: A integração com o endpoint `MobileLoginSP.login` do Sankhya deve ser mantida exatamente como é (mesmos parâmetros, método de decode legado).
- **Bibliotecas**:
    - `zod` para validação.
    - `sveltekit-superforms` (opcional, mas recomendado se simplificar validação).
    - `lucide-svelte` para ícones.

## Fora de Escopo

- Alterações na API do backend (Sankhya).
- Implementação de "Esqueci minha senha" (não suportado pela API atual exposta).
- Implementação de autenticação OAuth ou Social Login.
- Refatoração de outras rotas além da Login e Logoff.
