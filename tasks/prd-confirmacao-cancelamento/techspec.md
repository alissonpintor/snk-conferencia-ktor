# Especificação Técnica: Confirmação de Cancelamento

## Resumo Executivo

A implementação consiste em adicionar um passo de confirmação antes de executar o método `cancelarTarefa()` no componente `executar-tarefa.svelte`. Utilizaremos o componente `Modal.svelte` para criar um diálogo de confirmação padronizado.

## Arquitetura do Sistema

### Visão Geral dos Componentes

- **`Modal.svelte` (`src/components/actions/modal/modal.svelte`)**: Componente base que será utilizado como container para o diálogo.
- **`ConfirmationDialog.svelte` (Novo)**: Componente wrapper que abstrai a lógica de botões de confirmar/cancelar e mensagem do modal.
- **`executar-tarefa.svelte`**: Componente que consome o diálogo de confirmação.

## Design de Implementação

### Componente `ConfirmationDialog.svelte`

Este componente deve receber:
- `title`: Título do modal.
- `message`: Texto explicativo.
- `confirmText`: Texto do botão de confirmação.
- `cancelText`: Texto do botão de fechamento.
- `onConfirm`: Callback disparado ao confirmar.

### Alterações em `executar-tarefa.svelte`

1. Adicionar um estado local `$state` para controlar a visibilidade do modal (`showConfirmCancel`).
2. Vincular o clique do botão "Cancelar" original para setar `showConfirmCancel = true`.
3. Renderizar o `ConfirmationDialog` passando `conferenciaState.cancelarTarefa()` como callback de confirmação.

## Abordagem de Testes

### Testes Unidade
- Verificar se o componente `ConfirmationDialog` renderiza os textos passados via props.
- Verificar se o callback `onConfirm` é disparado corretamente.

### Testes de E2E (Playwright)
- Cenário 1: Abrir modal e clicar em "Não" -> Verificar se `conferenciaState.cancelarTarefa` NÃO foi chamado (a tarefa permanece ativa).
- Cenário 2: Abrir modal e clicar em "Sim" -> Verificar se a tarefa é cancelada e o modal fecha.

## Sequenciamento de Desenvolvimento

1. Criar o componente `ConfirmationDialog.svelte`.
2. Integrar o `ConfirmationDialog` no `executar-tarefa.svelte`.
3. Escrever e validar testes Playwright.

## Considerações Técnicas

- **DaisyUI**: Utilizar classes utilitárias do DaisyUI para manter a consistência visual (ex: `modal`, `btn-error`, `btn-outline`).
- **Svelte 5 Runes**: Utilizar `$state` e `$derived` conforme as práticas do projeto.

## Arquivos relevantes e dependentes

- `src/components/actions/modal/modal.svelte`
- `src/routes/expedicao/components/conferencia/painel-conferencia/header/sections/executar-tarefa.svelte`
- `src/lib/states/conferencia.svelte.ts`
