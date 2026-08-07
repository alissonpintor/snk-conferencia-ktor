# Tarefa 6.0: Registro de Rotas, Tratamento Global de Erros e Segurança (`plugins/`)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Registrar centralizadamente todas as novas fatias verticais no `plugins/Routing.kt`, configurar o tratamento global de exceções via `plugins/StatusPages.kt` para retorno de erros HTTP REST semânticos e aplicar sanitização de logs e autenticação JWT/Session.

<requirements>
- Respeitar as diretrizes de segurança de `.agents/rules/kotlin-ktor-security.md`.
- Conectar as extensões de rota (`separacaoRoutes()`, `conferenciaRoutes()`, `lookupRoutes()`) em `plugins/Routing.kt`.
- Mapear exceções em `plugins/StatusPages.kt`:
  - `IllegalArgumentException` / `SeparacaoValidationException` -> `400 Bad Request`
  - `SankhyaBusinessException` -> `400 Bad Request` com mensagem do ERP
  - Exceções não tratadas -> `500 Internal Server Error` (sem expor stack traces no payload)
- Aplicar o filtro de sanitização nos logs para evitar vazamento de credenciais.
</requirements>

## Subtarefas

- [ ] 6.1 Atualizar `backend/src/main/kotlin/com/snk/conferencia/plugins/Routing.kt` registrando as rotas das novas features sob `/api/v1/`.
- [ ] 6.2 Atualizar ou criar `backend/src/main/kotlin/com/snk/conferencia/plugins/StatusPages.kt` mapeando as exceções de domínio e do Sankhya.
- [ ] 6.3 Garantir a integração com a autenticação JWT/Session em `plugins/Security.kt`.
- [ ] 6.4 Criar testes de integração de middleware em `BackendIntegrationTest.kt` validando tratamento global de erros e códigos HTTP.

## Detalhes de Implementação

Consulte as seções **Arquitetura do Sistema** e **Monitoramento e Observabilidade** na `techspec.md`, além das diretrizes da skill `ktor-web-architecture` e da regra `kotlin-ktor-security.md`.

## Critérios de Sucesso

- Todas as rotas Ktor da expedição funcionam sob o prefixo `/api/v1/`.
- Erros de validação e de negócio retornam respostas JSON padronizadas com códigos HTTP semânticos (400, 401, 404, 500).
- Nenhuma stack trace de exceção não tratada é exposta ao cliente HTTP.
- Testes de integração de middleware passam com 100% de sucesso.

## Testes da Tarefa

- [ ] Testes de integração simulando requisição com token inválido (`401 Unauthorized`).
- [ ] Testes de integração simulando erro de validação de parâmetro (`400 Bad Request`).
- [ ] Teste de captura de exceção genérica garantindo que expõe apenas mensagem genérica com status `500`.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `backend/src/main/kotlin/com/snk/conferencia/plugins/Routing.kt`
- `backend/src/main/kotlin/com/snk/conferencia/plugins/StatusPages.kt`
- `backend/src/main/kotlin/com/snk/conferencia/plugins/Security.kt`
- `backend/src/test/kotlin/com/snk/conferencia/plugins/BackendIntegrationTest.kt`
- `tasks/prd-migracao-endpoints-separacao/techspec.md`
