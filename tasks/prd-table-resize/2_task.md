# Tarefa 2.0: Integração e Persistência nas Tabelas de Expedição

## Descrição
Habilitar o redimensionamento nas tabelas de listagem de separações e itens, garantindo que as larguras ajustadas sejam salvas no `localStorage`.

## Objetivos
- Configurar TanStack Table para habilitar resizing em `table-separacoes` e `table-separacoes-itens`.
- Implementar lógica de carregamento inicial do `localStorage`.
- Implementar lógica de salvamento automático ao redimensionar.
- Garantir rolagem horizontal nos contêineres das tabelas.

## Subtarefas
- [x] Modificar `src/routes/expedicao/components/separacoes/panel/table-separacoes/panel.svelte`.
    - [x] Adicionar rune `$state` para `columnSizing`.
    - [x] Inicializar a partir do `localStorage` (chave `columnSizing-expedicao`).
    - [x] Adicionar `onColumnSizingChange` para atualizar o estado e salvar no `localStorage`.
    - [x] Passar `enableColumnResizing: true` e `columnResizeMode: 'onChange'`.
- [x] Modificar `src/routes/expedicao/components/separacoes/panel/table-separacoes-itens/panel.svelte`.
    - [x] Repetir a mesma lógica com chave `columnSizing-expedicao-itens`.
- [x] Ajustar os contêineres CSS para `overflow-x: auto` e garantir que a tabela tenha largura total suficiente (via `table.getTotalSize()`).

## Critérios de Aceite
- O redimensionamento funciona em ambas as tabelas (separações e itens).
- Ao atualizar a página, as larguras configuradas são restauradas.
- A barra de rolagem horizontal aparece quando as colunas são maiores que a largura da tela.

## Casos de Teste
- [ ] Redimensionar coluna na tabela de separações, atualizar a página e verificar se manteve.
- [ ] Redimensionar coluna na tabela de itens, atualizar a página e verificar se manteve.
- [ ] Verificar se as chaves no `localStorage` estão sendo criadas corretamente.
