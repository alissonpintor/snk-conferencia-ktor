# Tarefa 2.0: Integrar Fila ao Endpoint de Impressão e validar concorrência

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Modificar o endpoint de impressão de volumes para que toda a lógica de chamada ao Sankhya seja encapsulada na `PrintQueue`.

<requirements>
- Importar `printQueue` em `src/routes/api/conferencia/volumes/imprimir/+server.ts`.
- Envolver a lógica do loop de retry atual dentro de `printQueue.add()`.
- Criar/Atualizar testes de integração para simular concorrência (múltiplos requests simultâneos).
</requirements>

## Subtarefas

- [x] 2.1 Refatorar o endpoint POST para utilizar `printQueue.add()`.
- [x] 2.2 Garantir que o tratamento de erros (inclusive o retry WMS_E00144) continue funcionando dentro da fila.
- [x] 2.3 Criar teste de concorrência em `tests/api/conferencia/volumes/imprimir-concorrencia.test.ts`.
- [x] 2.4 Validar que todos os testes passam.

## Detalhes de Implementação

Consulte a `techspec.md`. Lembre-se que a fila deve envolver o bloco `try/catch` e o loop de retry para garantir que o "tempo de ocupação" da fila inclua as tentativas extras se necessário.

## Critérios de Sucesso

- O endpoint responde corretamente sob concorrência.
- Dois requests simultâneos são serializados (segundo aguarda o primeiro).
- Nenhuma regressão na lógica de retry.

## Testes da Tarefa

- [ ] Testes de integração (Vitest)
- [ ] Testes de carga/concorrência simulados

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `src/routes/api/conferencia/volumes/imprimir/+server.ts`
- `tests/api/conferencia/volumes/imprimir-concorrencia.test.ts`
