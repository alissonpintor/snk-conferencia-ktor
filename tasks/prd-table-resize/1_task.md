# Tarefa 1.0: Implementação do Suporte a Redimensionamento no Componente Base Table

## Descrição
Modificar o componente reutilizável de tabela para suportar a funcionalidade de redimensionamento de colunas, utilizando as APIs do `@tanstack/table-core`.

## Objetivos
- Adicionar área interativa (handle) para redimensionamento nos cabeçalhos.
- Implementar feedback visual (hover/active) no handle.
- Garantir que a tabela suporte `table-layout: fixed` quando necessário.
- Vincular os handlers de evento do TanStack Table.

## Subtarefas
- [x] Localizar e abrir `src/components/display/data-grid/table/table.svelte`.
- [x] Adicionar o elemento `div` para o handle de redimensionamento dentro do loop de headers.
- [x] Aplicar classes CSS para posicionamento absoluto à direita e cursor `col-resize`.
- [x] Implementar visibilidade no hover do `th` (group focus).
- [x] Vincular `onmousedown` e `ontouchstart` com `header.getResizeHandler()`.
- [x] Aplicar largura fixa no `th` e `td` baseada em `header.getSize()`.
- [x] Adicionar suporte a `table-layout: fixed` condicional ou fixo conforme necessidade.

## Critérios de Aceite
- O cursor muda para `col-resize` na borda da coluna.
- Uma barra visual aparece quando o mouse está sobre a borda da coluna.
- A largura da coluna muda visualmente ao arrastar.
- Não há seleção de texto indesejada durante o arraste.

## Casos de Teste
- [ ] Verificar se o handle aparece no hover do cabeçalho.
- [ ] Verificar se o arraste altera a largura da coluna em tempo real.
- [ ] Verificar se a largura das outras colunas se mantém estável (devido ao layout fixo).
