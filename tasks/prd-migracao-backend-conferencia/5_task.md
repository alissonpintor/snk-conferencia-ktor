# Tarefa 5.0: Roteamento Ktor e Testes de Integração (`features/conferencia/ConferenciaRoutes.kt` & `plugins/Routing.kt`)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Expor todos os 13 endpoints REST sob `/api/v1/conferencia/*` no Ktor (`ConferenciaRoutes.kt`), registrar a funcionalidade no plugin central `Routing.kt` e implementar os testes de integração HTTP end-to-end com `testApplication`.

<requirements>
- Mapear as 13 rotas sob o prefixo `/api/v1/conferencia`:
  - `POST /search`
  - `POST /iniciar`
  - `GET /pendentes`
  - `POST /itens`
  - `POST /info`
  - `POST /registrar`
  - `POST /itens/saldo`
  - `POST /remover-itens`
  - `POST /finalizar`
  - `POST /volumes`
  - `POST /volumes/imprimir`
  - `POST /doca`
  - `POST /cancelar`
- Extrair a sessão do usuário com `call.extractSankhyaSession(jwtProvider)`.
- Registrar a rota no arquivo `backend/src/main/kotlin/com/snk/conferencia/plugins/Routing.kt`.
- Criar a suíte de testes de integração em `ConferenciaRoutesTest.kt` utilizando o framework `testApplication`.
</requirements>

## Subtarefas

- [x] 5.1 Atualizar `ConferenciaRoutes.kt` para declarar todos os 13 endpoints REST com recebimento dos DTOs.
- [x] 5.2 Registrar a extensão `conferenciaRoutes` no arquivo `Routing.kt`.
- [x] 5.3 Implementar `ConferenciaRoutesTest.kt` utilizando `testApplication` e `client.post` / `client.get`.
- [x] 5.4 Validar o retorno dos status HTTP semânticos (200 OK, 400 Bad Request, 401 Unauthorized, 500 Internal Server Error).
- [x] 5.5 Executar a suíte completa de testes no Gradle (`./gradlew test`) garantindo que 100% dos testes passem.

## Detalhes de Implementação

Consulte a seção **Endpoints de API** na `techspec.md`. Garantir que o tratamento de exceções seja delegado ao `StatusPages.kt`.

## Critérios de Sucesso

- Todos os 13 endpoints REST estão acessíveis sob `/api/v1/conferencia/*`.
- Autenticação e sessão Sankhya são validadas corretamente em cada rota.
- Testes de integração em `ConferenciaRoutesTest.kt` passam com 100% de sucesso via Gradle.

## Testes da Tarefa

- [ ] Testes de integração em `ConferenciaRoutesTest.kt` cobrindo todas as 13 rotas HTTP em ambiente `testApplication`.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `backend/src/main/kotlin/com/snk/conferencia/features/conferencia/ConferenciaRoutes.kt`
- `backend/src/main/kotlin/com/snk/conferencia/plugins/Routing.kt`
- `backend/src/test/kotlin/com/snk/conferencia/features/conferencia/ConferenciaRoutesTest.kt`
- `tasks/prd-migracao-backend-conferencia/techspec.md`
