# Tarefa 5.0: Endpoints REST (`AuthRouting`) e Testes de Integração Ktor

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Registrar a camada de roteamento HTTP (`AuthRouting`) expondo os endpoints REST `/api/v1/auth/login`, `/api/v1/auth/verify` e `/api/v1/auth/logout`, e validar o contrato de API de ponta a ponta com a suíte de testes de integração do Ktor.

<requirements>
- `POST /api/v1/auth/login`: Receber `AuthCredentialsDto`, invocar o `AuthService` e retornar HTTP 200 OK com `TokenResponseDto` (ou 400 Bad Request / 401 Unauthorized com `ErrorResponseDto`).
- `GET /api/v1/auth/verify`: Extrair o cabeçalho `Authorization: Bearer <token>`, validar via `AuthService` e retornar HTTP 200 OK com `UserSessionDto` (ou 401 Unauthorized).
- `POST /api/v1/auth/logout`: Invalidar a sessão e retornar HTTP 200 OK.
- Desenvolver suíte de testes de integração via `testApplication` do Ktor.
</requirements>

## Subtarefas

- [x] 5.1 Criar a função de extensão de roteamento `Routing.authRoutes(authService: AuthServiceInterface)`.
- [x] 5.2 Implementar a rota `POST /api/v1/auth/login` com validação de payload JSON.
- [x] 5.3 Implementar a rota `GET /api/v1/auth/verify` com extração do token Bearer.
- [x] 5.4 Implementar a rota `POST /api/v1/auth/logout`.
- [x] 5.5 Desenvolver a suíte de testes de integração cobrindo os endpoints com respostas de sucesso e erro.

## Detalhes de Implementação

Consulte a seção **Design de Implementação -> Endpoints de API** e **Abordagem de Testes -> Testes de Integração** em [`techspec.md`](file:///c:/Projetos/snk-conferencia/tasks/prd-migracao-autenticacao-ktor/techspec.md).

## Critérios de Sucesso

- Todos os endpoints respondem rigorosamente nos contratos JSON especificados.
- Requisições enviando dados malformados ou faltantes recebem respostas HTTP 400 tratadas pelo `StatusPages`.
- A suíte de testes de integração roda com 100% de aprovação no ambiente de testes.

## Testes da Tarefa

- [x] Testes de integração (Ktor `testApplication`): Fluxo completo de login chamando `/api/v1/auth/login` e recebendo o token JWT.
- [x] Testes de integração: Chamada a `/api/v1/auth/verify` com o token gerado anteriormente confirmando acesso liberado.
- [x] Testes de integração: Chamada a `/api/v1/auth/verify` sem o cabeçalho `Authorization` confirmando retorno HTTP 401.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `src/main/kotlin/com/snk/conferencia/auth/AuthRouting.kt`
- `src/test/kotlin/com/snk/conferencia/auth/AuthIntegrationTest.kt`
- [`techspec.md`](file:///c:/Projetos/snk-conferencia/tasks/prd-migracao-autenticacao-ktor/techspec.md)
