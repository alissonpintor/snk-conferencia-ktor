# Tarefa 3.0: Módulo de Consulta de Separações e Itens (`features/separacao/` - Parte 1)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar a primeira parte da fatia vertical `features/separacao/` no backend Ktor, cobrindo a busca filtrada de tarefas de separação e a consulta detalhada de itens de uma separação.

<requirements>
- Seguir o padrão Package-by-Feature (conforme skill `ktor-web-architecture`).
- Implementar os endpoints:
  - `POST /api/v1/separacoes/search`: Consulta de separações por filtros combinados.
  - `GET /api/v1/separacoes/{nroSeparacao}/itens`: Consulta de itens/produtos de uma separação.
- Exigir pelo menos um parâmetro de filtro na requisição de busca (`RF-03`).
- Aplicar sanitização rigorosa contra SQL Injection na montagem da cláusula `WHERE` da View `ViewAppSeparacao`.
- Agrupar DTOs em `SeparacaoDTOs.kt`.
</requirements>

## Subtarefas

- [ ] 3.1 Criar o pacote `backend/src/main/kotlin/com/snk/conferencia/features/separacao/`.
- [ ] 3.2 Criar `SeparacaoDTOs.kt` contendo `SeparacaoFilterRequest`, `SeparacaoResponse` e `ItemSeparacaoResponse`.
- [ ] 3.3 Implementar em `SeparacaoService.kt` os métodos `buscarSeparacoes` e `buscarItens`.
- [ ] 3.4 Criar `SeparacaoRoutes.kt` expondo os endpoints Ktor sob `/api/v1/separacoes`.
- [ ] 3.5 Criar testes unitários em `SeparacaoServiceTest.kt` e de integração em `SeparacaoRoutesTest.kt`.

## Detalhes de Implementação

Consulte a seção **Design de Implementação** e **Modelos de Dados** no arquivo `techspec.md`. O serviço deve consultar a view `ViewAppSeparacao` através do `SankhyaClient` injetando as expressões de filtro (`CODEMPOC`, `CODPARC`, `DTSEPARACAO`, `NUSEPARACAO`, `NUNOTA`, `NUMNOTA`, `ORDEMCARGA`, `COD_SITUACAO`, `CODPROD`).

## Critérios de Sucesso

- `POST /api/v1/separacoes/search` com filtros válidos retorna `200 OK` e lista de `SeparacaoResponse`.
- Requisição de busca sem nenhum filtro preenchido lança exceção e retorna HTTP `400 Bad Request`.
- `GET /api/v1/separacoes/{nroSeparacao}/itens` retorna os produtos pertencentes à separação.
- Testes unitários e de rotas passam com 100% de sucesso.

## Testes da Tarefa

- [ ] Testes de unidade em `SeparacaoServiceTest.kt` cobrindo montagem de filtros e rejeição de busca vazia.
- [ ] Teste de parsing da resposta de itens.
- [ ] Testes de integração de rota com `testApplication`.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `backend/src/main/kotlin/com/snk/conferencia/features/separacao/SeparacaoDTOs.kt`
- `backend/src/main/kotlin/com/snk/conferencia/features/separacao/SeparacaoService.kt`
- `backend/src/main/kotlin/com/snk/conferencia/features/separacao/SeparacaoRoutes.kt`
- `backend/src/test/kotlin/com/snk/conferencia/features/separacao/SeparacaoServiceTest.kt`
- `backend/src/test/kotlin/com/snk/conferencia/features/separacao/SeparacaoRoutesTest.kt`
- `tasks/prd-migracao-endpoints-separacao/techspec.md`
