# Especificação Técnica: Redimensionamento de Colunas

## Visão Geral

Implementação do redimensionamento de colunas nas tabelas `table-separacoes` e `table-separacoes-itens` utilizando a biblioteca `@tanstack/table-core` (já em uso) e funcionalidades nativas do Svelte 5. O estado será persistido no `localStorage`.

## Arquitetura

### Componentes Envolvidos

1.  **`src/components/display/data-grid/table/table.svelte`**:
    -   Componente reutilizável que renderiza a tabela.
    -   Será alterado para incluir o *handle* de redimensionamento e a lógica de interação (eventos).
    -   Responsável por aplicar os estilos de largura nas células (`th` e `td`) definidos pelo estado da tabela.

2.  **`src/routes/expedicao/components/separacoes/panel/table-separacoes/panel.svelte`**:
    -   Componente pai ("Smart Component").
    -   Responsável por gerenciar o estado `columnSizing`.
    -   Responsável pela inicialização (leitura do localesStorage) e persistência (escrita no localStorage).

3.  **`src/routes/expedicao/components/separacoes/panel/table-separacoes-itens/panel.svelte`**:
    -   Idem ao anterior, para a tabela de itens.

### Fluxo de Dados

1.  **Inicialização**:
    -   No `panel.svelte`, ao criar a tabela (`createSvelteTable`), o estado inicial de `columnSizing` será lido do `localStorage`. Se não existir, inicia vazio (automático).
2.  **Interação**:
    -   Usuário interage com o *handle* na coluna.
    -   `@tanstack/table-core` gerencia o cálculo da nova largura.
    -   O estado `columnSizing` é atualizado em memória.
3.  **Visualização**:
    -   O componente `Table` lê o tamanho da coluna (`header.getSize()`) e aplica via estilo inline (`width`).
4.  **Persistência**:
    -   No callback `onColumnSizingChange`, o novo estado é salvo no `localStorage`.

## Detalhes de Implementação

### 1. Modificações no componente `Table` (`table.svelte`)

-   **HTML/CSS**:
    -   Adicionar um elemento `div` ou `button` dentro do `Table.Head` para servir como "pega" (handle).
    -   Estilizar o handle para aparecer no hover (`group-hover:opacity-100`) ou estar sempre visível se a coluna estiver sendo redimensionada.
    -   Posicionamento absoluto à direita, altura 100%, cursor `col-resize`.
    -   Adicionar `user-select-none` ao header para evitar seleção de texto durante o arraste.

-   **Lógica**:
    -   Vincular eventos:
        -   `onmousedown`: `header.getResizeHandler()`
        -   `ontouchstart`: `header.getResizeHandler()`
    -   Aplicar estilo de largura: `style="width: {header.getSize()}px"` no `th`.
    -   **Importante**: Para que o redimensionamento respeite o layout, a tabela deve ter `table-layout: fixed` e largura definida pelo `table.getTotalSize()`.

### 2. Configuração do TanStack Table (`panel.svelte`)

Nos dois arquivos `panel.svelte`, a configuração da tabela deve incluir:

```typescript
enableColumnResizing: true,
columnResizeMode: 'onChange',
onColumnSizingChange: (updater) => {
    // 1. Atualizar state local
    // 2. Salvar no localStorage
},
state: {
    columnSizing: $state_variable // carregar inicial do localStorage
}
```

### 3. Persistência

Chaves de `localStorage` propostas:
-   `columnSizing-expedicao`
-   `columnSizing-expedicao-itens`

## Definição de Estruturas de Dados

```typescript
// Exemplo de estrutura salva no localStorage
{
    "colId1": 150,
    "colId2": 200,
    "colId3": 80
}
```

## Considerações de Segurança e Performance

-   **Performance**: `columnResizeMode: 'onChange'` dispara muitas atualizações. Com Svelte 5 (Runes), a reatividade fina deve lidar bem, mas se houver gargalo, mudar para 'onEnd'. Por enquanto, seguimos com 'onChange' para melhor UX.
-   **Sanitização**: Não necessária, pois os dados são apenas larguras numéricas.

## Plano de Testes

### Testes Manuais
1.  Redimensionar uma coluna e verificar se o visual responde.
2.  Atualizar a página e verificar se a largura se mantém.
3.  Verificar se a rolagem horizontal aparece quando a soma das larguras excede o visual.
4.  Verificar se o redimensionamento de uma coluna não afeta inesperadamente as outras (layout fixo).
