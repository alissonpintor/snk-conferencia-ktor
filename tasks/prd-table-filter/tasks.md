# Resumo de Tarefas de Implementação de Filtros Avançados de Coluna

## Tarefas

- [x] 1.0 Criar Fundação e Componentes de UI de Filtro
    - Definir tipos estendidos para `ColumnMeta` e interfaces de filtro.
    - Implementar funções de filtro customizadas (`filterFns`) para `dateRange`, `numberRange` e `multiSelect`.
    - Criar componentes `FilterPopover`, `FilterText`, `FilterNumber`, `FilterDate`, `FilterSelect`.
    - Criar testes unitários para os componentes e funções de filtro.

- [x] 2.0 Integrar Filtros ao TableHeader
    - Refatorar `src/components/display/data-grid/table/table-header.svelte` para instanciar o `FilterPopover` correto baseado no `meta.filterVariant` da coluna.
    - Implementar a lógica de aplicar e limpar filtros no `TableHeader`.
    - Garantir que o estado visual do ícone de filtro reflita se a coluna está filtrada ou não.
    - Adicionar testes de integração para o `TableHeader`.
- [x] 3.0 Configurar Filtros na Tabela de Separações (`table-separacoes`)
    - Atualizar `src/routes/expedicao/components/separacoes/panel/table-separacoes/columns.ts`.
    - Adicionar `meta: { filterVariant: '...' }` para colunas relevantes (Nro. Separação, Data, Situação, Parceiro, etc.).
    - Validar o funcionamento de cada tipo de filtro na tabela real.
- [x] 4.0 Configurar Filtros na Tabela de Itens (`table-separacoes-itens`)
    - Atualizar `src/routes/expedicao/components/separacoes/panel/table-separacoes-itens/columns.ts`.
    - Adicionar `meta` de filtro para as colunas de itens.
    - Validar o funcionamento na tabela de itens.

- [x] 5.0 Refinamento de UX e QA
    - Verificar responsividade dos dropdowns em telas menores.
    - Garantir acessibilidade (navegação por teclado no dropdown).
    - Realizar testes exploratórios para garantir que combinações de filtros funcionem.

