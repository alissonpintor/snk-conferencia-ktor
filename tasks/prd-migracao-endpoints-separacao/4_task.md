# Tarefa 4.0: Módulo de Gestão e Geração de Volumes (`features/separacao/` - Parte 2)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Complementar a fatia vertical `features/separacao/` implementando a lógica e endpoints para consulta de quantidade de volumes calculados e disparo do procedimento de geração oficial de volumes de uma separação.

<requirements>
- Implementar os endpoints:
  - `GET /api/v1/separacoes/{nroSeparacao}/volumes/quantidade`: Consulta a quantidade calculada/estimada de volumes.
  - `POST /api/v1/separacoes/{nroSeparacao}/volumes`: Efetiva a geração de volumes no ERP Sankhya.
- Adicionar DTOs `QuantidadeVolumesResponse` e `GerarVolumesResponse` em `SeparacaoDTOs.kt`.
- Retornar status HTTP `200 OK` (consulta) e `201 Created` / `200 OK` (geração de volumes).
</requirements>

## Subtarefas

- [ ] 4.1 Adicionar os DTOs de volumes em `SeparacaoDTOs.kt`.
- [ ] 4.2 Implementar os métodos `obterQuantidadeVolumes` e `gerarVolumes` em `SeparacaoService.kt`.
- [ ] 4.3 Adicionar as rotas correspondentes em `SeparacaoRoutes.kt`.
- [ ] 4.4 Atualizar os testes unitários em `SeparacaoServiceTest.kt` e de integração em `SeparacaoRoutesTest.kt`.

## Detalhes de Implementação

Consulte a seção **Endpoints de API** (Módulo `separacao`) e **Modelos de Dados** no arquivo `techspec.md`. O serviço invocará a rotina de volumes via `SankhyaClient` validando a resposta do ERP e tratando eventuais divergências.

## Critérios de Sucesso

- `GET /api/v1/separacoes/{nroSeparacao}/volumes/quantidade` retorna a contagem de volumes associados.
- `POST /api/v1/separacoes/{nroSeparacao}/volumes` dispara a criação dos volumes no backend e retorna o status do procedimento.
- Testes unitários e de integração validam as respostas e códigos de status HTTP.

## Testes da Tarefa

- [ ] Testes unitários para simulação da geração de volumes com sucesso e erro.
- [ ] Testes de integração de rota no Ktor.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `backend/src/main/kotlin/com/snk/conferencia/features/separacao/SeparacaoDTOs.kt`
- `backend/src/main/kotlin/com/snk/conferencia/features/separacao/SeparacaoService.kt`
- `backend/src/main/kotlin/com/snk/conferencia/features/separacao/SeparacaoRoutes.kt`
- `backend/src/test/kotlin/com/snk/conferencia/features/separacao/SeparacaoServiceTest.kt`
- `backend/src/test/kotlin/com/snk/conferencia/features/separacao/SeparacaoRoutesTest.kt`
- `tasks/prd-migracao-endpoints-separacao/techspec.md`
