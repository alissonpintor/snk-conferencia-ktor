# Tarefa 1.0: Atualizar os states da conferência e recontagem para passar a quantidade de volumes para a API

<critical>Ler os arquivos de prd.md e techspec.md desta pasta antes de prosseguir</critical>

## Visão Geral

Modificar as classes de estado global `ConferenciaState` (em `src/lib/states/conferencia.svelte.ts`) e `RecontagemState` (em `src/lib/states/recontagem.svelte.ts`) para passar a quantidade de volumes informada pelo usuário no corpo da requisição POST do método `imprimirEtiquetas()`.

## Subtarefas

- [ ] 1.1 Em `src/lib/states/conferencia.svelte.ts`:
  - Modificar o método `registrarVolumes(quantidade: number)` para passar `quantidade` na chamada de `this.imprimirEtiquetas()`.
  - Atualizar a assinatura de `imprimirEtiquetas(quantidade?: number)` para aceitar a quantidade e adicioná-la no corpo do JSON da requisição fetch.
- [ ] 1.2 Em `src/lib/states/recontagem.svelte.ts`:
  - Modificar o método `registrarVolumes = async (quantidade: number)` para passar `quantidade` na chamada de `this.imprimirEtiquetas()`.
  - Atualizar a assinatura de `imprimirEtiquetas(quantidade?: number)` para aceitar a quantidade e adicioná-la no corpo do JSON da requisição fetch.

## Critérios de Sucesso

- O frontend envia com sucesso a propriedade `quantidade` no corpo do POST ao chamar o endpoint `/api/conferencia/volumes/imprimir`.
- A compilação do TypeScript e a sincronização do SvelteKit ocorrem com sucesso.

## Arquivos relevantes
- `src/lib/states/conferencia.svelte.ts`
- `src/lib/states/recontagem.svelte.ts`
