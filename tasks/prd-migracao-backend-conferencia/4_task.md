# Tarefa 4.0: Serviço de Finalização, Volumes, Doca e Impressão (`features/conferencia/ConferenciaService.kt` - Parte 3)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar em `ConferenciaServiceImpl.kt` os métodos de encerramento da conferência, geração e impressão de etiquetas de volume, direcionamento para doca de saída e cancelamento de tarefa.

<requirements>
- Implementar `finalizarConferencia` invocando `MgeWmsSP.produtosConferidos`.
- Implementar `registrarVolumes` invocando `MgeWmsSP.registraEtiquetasVolume`.
- Implementar `imprimirVolumes` retornando a representação HTML ou documento de impressão de etiquetas.
- Implementar `enviarParaDoca` invocando `MgeWmsSP.liberaCheckoutDoca`.
- Implementar `cancelarConferencia` invocando `MgeWmsSP.cancelaTarefa`.
</requirements>

## Subtarefas

- [x] 4.1 Implementar `finalizarConferencia` validando respostas com divergência.
- [x] 4.2 Implementar `registrarVolumes` passando quantidade e flag de ignorar geradas (`IGNORARGERADAS: S`).
- [x] 4.3 Implementar `imprimirVolumes` fazendo o dispatch do relatório de etiquetas.
- [x] 4.4 Implementar `enviarParaDoca` e `cancelarConferencia`.
- [x] 4.5 Criar suíte de testes unitários em `ConferenciaServicePart3Test.kt` mocando as chamadas de finalização e logística.

## Detalhes de Implementação

Consulte os requisitos `RF-09` a `RF-13` do PRD e as especificações de integração da `techspec.md`.

## Critérios de Sucesso

- Finalização de conferência valida se há divergências ou pendências antes de concluir.
- Volumes são registrados e comandos de impressão geram o retorno HTML esperado.
- Separações finalizadas são vinculadas com sucesso à doca de embarque.
- Testes unitários com mocks cobrem todas as 5 operações da tarefa.

## Testes da Tarefa

- [ ] Testes de unidade em `ConferenciaServicePart3Test.kt` cobrindo finalização, volumes, doca e cancelamento.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `backend/src/main/kotlin/com/snk/conferencia/features/conferencia/ConferenciaService.kt`
- `backend/src/test/kotlin/com/snk/conferencia/features/conferencia/ConferenciaServicePart3Test.kt`
- `tasks/prd-migracao-backend-conferencia/techspec.md`
