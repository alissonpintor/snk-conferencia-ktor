# Especificação Técnica - Filtros Avançados de Coluna

## Resumo Executivo

Esta especificação detalha a implementação de filtros avançados por coluna nas tabelas de conferência (`table-separacoes` e `table-separacoes-itens`). A solução envolverá a evolução do componente `TableHeader` existente para suportar um Dropdown com diferentes tipos de inputs de filtro (texto, data, número, seleção múltipla), integrando-se nativamente com o `@tanstack/table-core` para filtragem client-side. Não haverá alterações no backend ou persistência de estado.

## Arquitetura do Sistema

### Visão Geral dos Componentes

- **`src/components/display/data-grid/table/table-header.svelte`**: Será refatorado para incluir a lógica de filtragem avançada. O dropdown existente será expandido para acomodar os novos tipos de filtro.
- **`src/components/display/data-grid/table/filter/`**: Novo diretório para organizar os componentes de filtro específicos.
    - `filter-popover.svelte`: O container do dropdown de filtro.
    - `filter-text.svelte`: Input para texto.
    - `filter-number.svelte`: Inputs para intervalo numérico (Min/Max).
    - `filter-date.svelte`: Inputs para intervalo de datas (Início/Fim).
    - `filter-select.svelte`: Checkboxes para seleção múltipla de valores.
- **`src/lib/utils/table-filters.ts`**: Funções utilitárias e `filterFns` customizadas para o TanStack Table (ex: `dateRangeFilter`, `multiSelectFilter`).

### Fluxo de Dados

1.  O usuário interage com o cabeçalho da coluna.
2.  O componente `FilterPopover` renderiza o input adequado com base no `meta.filterVariant` da definição da coluna.
3.  O usuário insere/seleciona os valores.
4.  O componente chama `column.setFilterValue(valor)`.
5.  O TanStack Table reprocessa o modelo de linhas (`getFilteredRowModel`) usando a função de filtro configurada na coluna.
6.  A tabela atualiza a exibição.

## Design de Implementação

### Metadados da Coluna (TanStack Table)

Estenderemos a definição de colunas (`ColumnDef`) utilizando a propriedade `meta` para configurar o comportamento do filtro:

```typescript
// Exemplo de extensão de tipo (app.d.ts ou similar)
import '@tanstack/table-core'

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'number' | 'date' | 'select' | 'boolean';
    filterOptions?: { label: string; value: any }[]; // Para 'select'
  }
}
```

### Funções de Filtro Customizadas (`filterFns`)

Precisaremos de funções específicas para lidar com intervalos e arrays, já que o padrão do TanStack muitas vezes espera valores simples ou tem comportamentos padrão que podem não atender totalmente (ex: date range).

- `dateRange`: Verifica se a data da linha está dentro do intervalo `[start, end]`.
- `numberRange`: Verifica se o número da linha está entre `[min, max]`.
- `multiSelect`: Verifica se o valor da linha está incluído no array de valores selecionados.

## Sequenciamento de Desenvolvimento

1.  **Fundação e Utilitários**: Criar as funções de filtro (`filterFns`) e tipos/interfaces necessários.
2.  **Componentes de UI de Filtro**: Criar os componentes (inputs) para cada tipo de filtro (`FilterText`, `FilterDate`, etc.) e o container `FilterPopover`.
3.  **Integração no TableHeader**: Modificar o `TableHeader` para utilizar o `FilterPopover`.
4.  **Configuração das Tabelas**: Atualizar as definições de colunas em `table-separacoes/columns.ts` e `table-separacoes-itens/columns.ts` com os metadados e `filterFn` corretos.
5.  **Testes**: Validar o funcionamento de cada tipo de filtro.

## Considerações Técnicas

### Decisões Principais

- **Uso do `meta`**: Evita a criação de wrappers complexos em volta da definição de colunas, mantendo a API do TanStack Table limpa.
- **Componentização dos Filtros**: Separar cada tipo de input em um componente Svelte facilita a manutenção e reutilização.
- **Client-Side Only**: Conforme requisitado, focaremos em performance de filtragem local. Se o volume de dados crescer muito, futura migração para server-side será necessária, mas a interface (UI) poderá ser reaproveitada.

### Riscos

- **Performance com Muitos Dados**: Filtragem client-side em tabelas muito grandes (> 10k linhas) pode travar a interface. (Mitigação: Paginação server-side já existe? Se sim, a filtragem client-side só filtra a *página atual* ou *todos os dados carregados*? O TanStack table filtra *todos os dados* antes da paginação se configurado corretamente. Confirmar se todos os dados são carregados ou se há paginação server-side. Pelo código atual, parece que `separacaoState.separacoes` carrega tudo ou uma lista significativa).
    - *Nota*: O código atual usa `getPaginationRowModel`, indicando que a paginação é feita no cliente sobre os dados carregados. Se a carga de dados for total, o filtro funcionará sobre o todo.

### Conformidade com Padrões

- Seguir as guidelines do **DaisyUI** para consistência visual.
- Usar **Svelte 5 Runes** para gerenciamento de estado local dos inputs de filtro.
