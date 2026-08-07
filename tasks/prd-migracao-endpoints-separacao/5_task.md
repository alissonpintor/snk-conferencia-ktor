# Tarefa 5.0: Módulo de Ações de Conferência e Expedição (`features/conferencia/`)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar a fatia vertical `features/conferencia/` no Ktor para processar as ações disparadas a partir da tabela de separações: direcionar para doca, cancelar conferência e solicitar impressão de etiquetas de volumes.

<requirements>
- Seguir o padrão Package-by-Feature (conforme skill `ktor-web-architecture`).
- Implementar os endpoints:
  - `POST /api/v1/conferencia/doca`: Envio da separação/conferência para a doca de expedição.
  - `POST /api/v1/conferencia/cancelar`: Cancelamento da conferência da separação.
  - `POST /api/v1/conferencia/volumes/imprimir`: Solicitação de impressão das etiquetas de volumes.
- Agrupar DTOs em `ConferenciaDTOs.kt`.
- Retornar status HTTP REST semânticos (`200 OK`, `400 Bad Request`).
</requirements>

## Subtarefas

- [ ] 5.1 Criar o pacote `backend/src/main/kotlin/com/snk/conferencia/features/conferencia/`.
- [ ] 5.2 Criar `ConferenciaDTOs.kt` contendo `EnviarDocaRequest`, `CancelarConferenciaRequest` e `ImprimirVolumesRequest`.
- [ ] 5.3 Implementar `ConferenciaService.kt` integrando com o `SankhyaClient` para atualizar os status no ERP.
- [ ] 5.4 Criar `ConferenciaRoutes.kt` expondo os endpoints Ktor sob `/api/v1/conferencia`.
- [ ] 5.5 Criar os testes unitários em `ConferenciaServiceTest.kt` e testes de integração em `ConferenciaRoutesTest.kt`.

## Detalhes de Implementação

Consulte a seção **Design de Implementação** (Módulo `conferencia`) e **Interfaces Principais** no arquivo `techspec.md`. O serviço executará os procedimentos no ERP Sankhya através do `SankhyaClient`.

## Critérios de Sucesso

- Envio para doca (`POST /api/v1/conferencia/doca`) altera o status e responde `200 OK`.
- Cancelamento (`POST /api/v1/conferencia/cancelar`) atualiza a conferência para cancelada e responde `200 OK`.
- Impressão (`POST /api/v1/conferencia/volumes/imprimir`) aceita a solicitação e responde `200 OK`.
- Testes unitários e de integração de rotas passam com 100% de sucesso.

## Testes da Tarefa

- [ ] Testes de unidade em `ConferenciaServiceTest.kt` simulando operações de doca, cancelamento e impressão.
- [ ] Testes de integração em `ConferenciaRoutesTest.kt` via `testApplication`.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `backend/src/main/kotlin/com/snk/conferencia/features/conferencia/ConferenciaDTOs.kt`
- `backend/src/main/kotlin/com/snk/conferencia/features/conferencia/ConferenciaService.kt`
- `backend/src/main/kotlin/com/snk/conferencia/features/conferencia/ConferenciaRoutes.kt`
- `backend/src/test/kotlin/com/snk/conferencia/features/conferencia/ConferenciaServiceTest.kt`
- `backend/src/test/kotlin/com/snk/conferencia/features/conferencia/ConferenciaRoutesTest.kt`
- `tasks/prd-migracao-endpoints-separacao/techspec.md`
