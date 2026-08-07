# Tarefa 2.0: Integrar Confirmação no Componente Executar Tarefa

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Modificar o componente `executar-tarefa.svelte` para interceptar a ação de cancelamento e exibir o diálogo de confirmação criado na tarefa anterior.

<requirements>
- Adicionar estado `showConfirmCancel` (booleano).
- Alterar o `onclick` do botão de cancelar para abrir o modal em vez de chamar a API diretamente.
- Integrar o `ConfirmationDialog` passando `conferenciaState.cancelarTarefa()` como ação de confirmação.
</requirements>

## Subtarefas

- [x] 2.1 Importar o novo componente `ConfirmationDialog` em `executar-tarefa.svelte`.
- [x] 2.2 Adicionar lógica de estado para controle do modal.
- [x] 2.3 Ajustar o template HTML para incluir o modal e vincular as ações.

## Detalhes de Implementação

Referencie a [techspec.md](./techspec.md) e o arquivo `src/routes/expedicao/components/conferencia/painel-conferencia/header/sections/executar-tarefa.svelte`.

## Critérios de Sucesso

- O clique no botão "Cancelar" abre o modal.
- A tarefa só é efetivamente cancelada após confirmação no modal.
- O spinner de carregamento continua funcionando corretamente se o processo de cancelamento demorar.

## Testes da Tarefa

- [ ] Teste manual de fluxo: Validar cancelamento e desistência.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `src/routes/expedicao/components/conferencia/painel-conferencia/header/sections/executar-tarefa.svelte`
- `src/lib/states/conferencia.svelte.ts`
