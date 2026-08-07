# Tarefa 1.0: Implementação do Core de Autenticação (Backend & Lógica)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical> 

## Visão Geral

Implementação da infraestrutura central de autenticação, focando na integração robusta com o backend Sankhya, validação de dados e segurança da aplicação. Esta tarefa não envolve a interface do usuário (UI), apenas a lógica de servidor e serviços.

<requirements>
- Utilizar `zod` para definição de schemas e validação rigorosa de dados.
- Implementar `AuthService` dedicado em `src/lib/services/auth.service.ts` para isolar a comunicação com a API Sankhya.
- Garantir o tratamento correto do encoding legado (`windows-1252`) nas respostas da API.
- Configurar ações de formulário (Form Actions) no servidor SvelteKit para processar o login.
- Atualizar e simplificar o middleware (`hooks.server.ts`) para proteção de rotas e redirecionamento.
- Tipar corretamente o objeto `event.locals` em `src/app.d.ts`.
- Garantir segurança nos Cookies de sessão (`HttpOnly`, `Secure`, `SameSite`).
</requirements>

## Subtarefas

- [x] 1.1 Criar schemas de validação Zod (`src/lib/schemas/auth.schema.ts`) conforme especificado na Tech Spec.
- [x] 1.2 Implementar `AuthService` (`src/lib/services/auth.service.ts`) incluindo decodificação `windows-1252` e tratamento de erros de API.
- [x] 1.3 Implementar lógica de servidor (`src/routes/login/+page.server.ts`) utilizando Form Actions para processar login, validar com Zod e chamar `AuthService`.
- [x] 1.4 Atualizar `src/hooks.server.ts` para redirecionar usuários não autenticados para `/login` e impedir acesso à tela de login se já autenticado.
- [x] 1.5 Atualizar tipos globais em `src/app.d.ts` para refletir a estrutura de sessão do usuário.
- [x] 1.6 Implementar testes unitários para `AuthService` (mocking `fetch`) e validação de schemas Zod.

## Detalhes de Implementação

Consultar `techspec.md` para detalhes sobre:
- Interfaces `AuthCredentials` e `UserSession`.
- Estrutura do payload JSON para `MobileLoginSP.login`.
- Detalhes do `loginSchema` com Zod.
- Lógica de redirecionamento no middleware.

## Critérios de Sucesso

- [ ] `AuthService` realiza login com sucesso e retorna `jsessionid` válido.
- [ ] Erros de API (ex: senha incorreta) são tratados e retornados de forma estruturada.
- [ ] Schemas Zod validam corretamente entradas inválidas e sanitizam dados.
- [ ] Middleware redireciona corretamente usuários não autenticados da raiz `/` para `/login`.
- [ ] Sessão do usuário é persistida em Cookies seguros via `hooks.server.ts` ou action.

## Testes da Tarefa

- [ ] Testes de unidade para `AuthService`:
    - Login com sucesso (mock response).
    - Login com falha (credenciais inválidas).
    - Erro de conexão/network.
    - Decodificação de caracteres especiais.
- [ ] Testes de unidade para `auth.schema.ts`:
    - Validação de campos obrigatórios.
    - Validação de regras de formato.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `src/lib/schemas/auth.schema.ts`
- `src/lib/services/auth.service.ts`
- `src/routes/login/+page.server.ts`
- `src/hooks.server.ts`
- `src/app.d.ts`
