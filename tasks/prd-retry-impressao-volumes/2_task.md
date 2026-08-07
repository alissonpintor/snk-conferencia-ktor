# Tarefa 2.0: Refatorar endpoint de impressão para suportar loop de retry e detecção de erro Sankhya

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Refatorar o endpoint POST em `/src/routes/api/conferencia/volumes/imprimir/+server.ts` para incluir um loop de retry. O loop deve ser acionado especificamente quando o Sankhya retornar um erro indicando que as etiquetas ainda não foram geradas.

<requirements>
- Identificar o erro `WMS_E00144` ou a mensagem "etiquetas... ainda não impressas" na resposta do Sankhya.
- Implementar um loop de até 3 tentativas adicionais (total 4).
- Utilizar o utilitário `sleep` com backoff linear ($n \times 2$ segundos).
- Garantir que erros fatais ou outros tipos de erro não disparem o retry.
</requirements>

## Subtarefas

- [x] 2.1 Refatorar a lógica de chamada ao fetch para uma função interna ou bloco reutilizável dentro do `POST`.
- [x] 2.2 Implementar a estrutura de loop (ex: `for` ou `while`).
- [x] 2.3 Adicionar lógica de detecção de erro específica do Sankhya (`status: 0` e `tsErrorCode: WMS_E00144`).
- [x] 2.4 Integrar o delay incremental ($2s, 4s, 6s$) entre as tentativas.
- [x] 2.5 Adicionar logs (console.log ou logger do sistema) para monitorar as tentativas.

## Detalhes de Implementação

Consulte a `techspec.md` para a estratégia de backoff. A detecção do erro deve ser robusta, verificando tanto o `status: 0` quanto o código de erro no campo `tsError`.

## Critérios de Sucesso

- O endpoint deve realizar o retry automaticamente em caso de erro `WMS_E00144`.
- O tempo total de espera não deve exceder os limites definidos.
- O endpoint deve retornar o PDF com sucesso se o Sankhya processar o registro durante o período de retry.
- Se as 3 tentativas falharem, o erro final deve ser retornado ao cliente.

## Testes da Tarefa

- [ ] Testes de unidade para a lógica de retry isolada (opcional se for difícil isolar).
- [ ] Testes de integração simulando respostas do Sankhya via mocks de global fetch.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `src/routes/api/conferencia/volumes/imprimir/+server.ts`
- `src/lib/utils/sleep.ts`
