# Tarefa 3.0: Serviço de Bipagem, Saldo e Recontagem (`features/conferencia/ConferenciaService.kt` - Parte 2)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar em `ConferenciaServiceImpl.kt` os métodos de registro de item conferido (bipagem pelo coletor), atualização de saldo/sequências e remoção/recontagem de itens.

<requirements>
- Implementar o método `registrarItemConferido` invocando `MgeWmsSP.insereItemConferidoColetor`.
- Implementar o método `atualizarSaldoItem` invocando `MgeWmsSP.itensConferencia` filtrando saldo por produto/código de barras.
- Implementar o método `removerItens` invocando `MgeWmsSP.limpaConferenciaColetor` ou `removePeloIdExclusao`.
- Tratar cenários de erro do coletor (código de barras não pertence à nota, quantidade ultrapassada, etc.) disparando `SankhyaBusinessException`.
</requirements>

## Subtarefas

- [x] 3.1 Implementar `registrarItemConferido` montando o payload exigido por `MgeWmsSP.insereItemConferidoColetor`.
- [x] 3.2 Implementar `atualizarSaldoItem` processando sequências conferidas e avarias.
- [x] 3.3 Implementar `removerItens` enviando os IDs de sequência ou número de conferência.
- [x] 3.4 Criar suíte de testes unitários em `ConferenciaServicePart2Test.kt` validando bipagem, atualização de saldo e recontagem.

## Detalhes de Implementação

Consulte os requisitos `RF-05`, `RF-07` e `RF-08` do PRD e o contrato de DTOs na `techspec.md`. Tratar a conversão de base64 no parâmetro `idusu` conforme especificação dos serviços `MgeWmsSP`.

## Critérios de Sucesso

- Bipagem de item constrói payload correto e executa `insereItemConferidoColetor`.
- Saldo é calculado e retornado com sequências atualizadas.
- Remoção/recontagem limpa as sequências no Sankhya.
- Testes unitários cobrem cenários com sucesso e de erro no coletor.

## Testes da Tarefa

- [ ] Testes de unidade em `ConferenciaServicePart2Test.kt` testando bipagem e recontagem com mocks.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `backend/src/main/kotlin/com/snk/conferencia/features/conferencia/ConferenciaService.kt`
- `backend/src/test/kotlin/com/snk/conferencia/features/conferencia/ConferenciaServicePart2Test.kt`
- `tasks/prd-migracao-backend-conferencia/techspec.md`
