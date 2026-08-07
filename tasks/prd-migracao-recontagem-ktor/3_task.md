# Tarefa 3.0: Endpoints Ktor e Registro de Rotas (`RecontagemRoutes.kt` & `Routing.kt`)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar a camada de rotas Ktor (`RecontagemRoutes.kt`) definindo os 6 endpoints HTTP sob o prefixo `/api/v1/recontagem` (`iniciar`, `proxima`, `info-produto`, `enviar`, `cancelar`, `info`), validar os parâmetros de requisição, realizar a extração da sessão Sankhya com `call.extractSankhyaSession(jwtProvider)` e registrar a função em `Routing.kt` e `Application.kt`.

<requirements>
- Criar a função de extensão `Route.recontagemRoutes(recontagemService: RecontagemServiceInterface, jwtProvider: JwtProvider? = null)`.
- Implementar as rotas HTTP sob `/api/v1/recontagem`:
  - `POST /iniciar`
  - `POST /proxima`
  - `POST /info-produto`
  - `POST /enviar`
  - `POST /cancelar`
  - `POST /info`
- Exigir autenticação JWT extraindo `session.baseUrl`, `session.jsessionid` e `session.userId`.
- Atualizar o arquivo `Routing.kt` e `Application.kt` instanciando `RecontagemService` e registrando as rotas.
- Criar testes de integração usando o Ktor Test Application Engine (`RecontagemRoutesTest.kt`).
</requirements>

## Subtarefas

- [ ] 3.1 Criar o arquivo `RecontagemRoutes.kt` no pacote `com.snk.conferencia.features.recontagem`.
- [ ] 3.2 Implementar os handlers para os 6 endpoints da API extraindo a sessão Sankhya.
- [ ] 3.3 Atualizar `Routing.kt` registrando `recontagemRoutes`.
- [ ] 3.4 Instanciar `RecontagemService` e atualizar o método de configuração em `Application.kt`.
- [ ] 3.5 Criar o arquivo de teste de integração `RecontagemRoutesTest.kt`.
- [ ] 3.6 Implementar cenários de testes validando autenticação JWT, respostas HTTP 200 OK e tratamento de erros 400/500 via `StatusPages`.

## Detalhes de Implementação

Consulte as seções "Endpoints de API" e "Arquitetura do Sistema" no [techspec.md](file:///c:/Projetos/snk-conferencia-ktor/tasks/prd-migracao-recontagem-ktor/techspec.md).

## Critérios de Sucesso

- Os 6 endpoints respondem corretamente sob o prefixo `/api/v1/recontagem/*`.
- Requisições sem Token JWT válido ou sem credenciais Sankhya são rejeitadas com HTTP 401 Unauthorized.
- 100% dos testes de integração de rotas em `RecontagemRoutesTest` executam com sucesso.

## Testes da Tarefa

- [ ] Testes de unidade (N/A)
- [ ] Testes de integração (`RecontagemRoutesTest.kt` utilizando Ktor HttpClient Test Engine)

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `backend/src/main/kotlin/com/snk/conferencia/features/recontagem/RecontagemRoutes.kt`
- `backend/src/main/kotlin/com/snk/conferencia/plugins/Routing.kt`
- `backend/src/main/kotlin/com/snk/conferencia/Application.kt`
- `backend/src/test/kotlin/com/snk/conferencia/features/recontagem/RecontagemRoutesTest.kt`
