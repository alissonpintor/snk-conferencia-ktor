# Tarefa 1.0: Criar Componente de Diálogo de Confirmação

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Desenvolver o componente `ConfirmationDialog.svelte` que servirá como interface padronizada para solicitações de confirmação do usuário, utilizando o componente `Modal.svelte` base.

<requirements>
- Deve utilizar o componente `src/components/actions/modal/modal.svelte`.
- Deve aceitar props para title, message, confirmText e cancelText.
- Deve emitir um evento ou executar um callback `onConfirm`.
- Design deve seguir a UI/UX Spec (botão de erro para ação destrutiva).
- Utilizar ícone `CircleAlert` do `@lucide/svelte`.
</requirements>

## Subtarefas

- [x] 1.1 Criar o arquivo `src/components/feedback/confirmation-dialog.svelte`.
- [x] 1.2 Implementar a estrutura de props usando Svelte 5 runes (`$props`).
- [x] 1.3 Implementar a lógica de exibição/fechamento vinculada ao `Modal.svelte`.

## Detalhes de Implementação

Referencie a [techspec.md](./techspec.md) para detalhes da interface do componente.

## Critérios de Sucesso

- O componente renderiza corretamente dentro de um modal.
- O clique no botão de confirmar dispara a ação correta.
- O componente é visualmente consistente com o restante da aplicação.

## Testes da Tarefa

- [ ] Teste de unidade: Validar renderização de props e disparo de eventos.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `src/components/actions/modal/modal.svelte`
- `src/components/feedback/confirmation-dialog.svelte`
