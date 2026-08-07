# Especificação Técnica - Sistema de Cores por Status

## Resumo Executivo

Esta especificação detalha a implementação de um sistema de cores condicional para as linhas da tabela de separações. A solução envolve: (1) a criação de um state manager reativo para gerenciar o mapeamento status→cores com persistência no `localStorage`, (2) a criação de um modal de configuração acessível pelo dropdown do botão de engrenagem existente, e (3) a modificação do componente `Table` (genérico) para aceitar uma função de estilização de linhas, aplicando as cores configuradas.

## Arquitetura do Sistema

### Visão Geral dos Componentes

- **`src/lib/states/row-colors.svelte.ts`** *(novo)*: State manager reativo (Svelte 5 Runes) que gerencia o mapeamento de status→cores. Responsável por ler/salvar no `localStorage` e fornecer as cores padrão.

- **`src/components/display/data-grid/header/color-config-modal.svelte`** *(novo)*: Modal de configuração de cores. Exibe todos os 12 status com seletores de cor (fundo + texto) e preview em tempo real.

- **`src/components/display/data-grid/header/header-select-columns.svelte`** *(modificado)*: Adição de um novo item "Configurar Cores" no dropdown existente, com ícone `Palette` do Lucide.

- **`src/components/display/data-grid/table/table.svelte`** *(modificado)*: Adição de uma prop opcional `getRowStyle` que recebe os dados da linha e retorna um objeto de estilo CSS inline (`{ backgroundColor, color }`).

- **`src/routes/expedicao/components/separacoes/panel/table-separacoes/panel.svelte`** *(modificado)*: Passa a função `getRowStyle` para o componente `Table`, usando o state de cores para determinar o estilo de cada linha baseado no campo `situacao`.

### Fluxo de Dados

1. O state `rowColorsState` carrega as configurações do `localStorage` ao inicializar (via `onMount` ou `$effect`).
2. O componente `Table` recebe a prop `getRowStyle` e aplica o estilo inline retornado a cada `<Table.Row>`.
3. Para configurar, o usuário acessa o dropdown de engrenagem → clica em "Configurar Cores" → o modal `ColorConfigModal` é aberto.
4. No modal, o usuário altera as cores → ao clicar "Salvar", o `rowColorsState` é atualizado e persiste no `localStorage`.
5. A tabela reage automaticamente à mudança de state, atualizando as cores das linhas.

## Design de Implementação

### Modelos de Dados

```typescript
// src/lib/states/row-colors.svelte.ts

export type StatusColor = {
  backgroundColor: string; // ex: '#e8f5e9' (verde claro)
  textColor: string;       // ex: '#1b5e20' (verde escuro)
};

export type StatusColorMap = Record<string, StatusColor>;

// Mapeamento padrão (12 status)
const DEFAULT_COLORS: StatusColorMap = {
  'Aguardando Separação':              { backgroundColor: '#fff3e0', textColor: '#e65100' },
  'Enviado para Separação':            { backgroundColor: '#e3f2fd', textColor: '#0d47a1' },
  'Em Processo de Separação':          { backgroundColor: '#e8eaf6', textColor: '#1a237e' },
  'Aguardando Conferência':            { backgroundColor: '#fff8e1', textColor: '#f57f17' },
  'Em Processo de Conferência':        { backgroundColor: '#f3e5f5', textColor: '#4a148c' },
  'Conferência com Divergência':       { backgroundColor: '#fce4ec', textColor: '#b71c1c' },
  'Aguardando Recontagem':             { backgroundColor: '#fbe9e7', textColor: '#bf360c' },
  'Aguardando Conferência de Volumes': { backgroundColor: '#e0f2f1', textColor: '#004d40' },
  'Conferência Validada':              { backgroundColor: '#e8f5e9', textColor: '#1b5e20' },
  'Concluído':                         { backgroundColor: '#e0f7fa', textColor: '#006064' },
  'Cancelada':                         { backgroundColor: '#efebe9', textColor: '#3e2723' },
  'Possui Retorno de Mercadoria':      { backgroundColor: '#fce4ec', textColor: '#880e4f' },
};
```

### State Manager (Svelte 5 Runes)

```typescript
// src/lib/states/row-colors.svelte.ts

const STORAGE_KEY = 'row-colors-expedicao';

function createRowColorsState() {
  let colors = $state<StatusColorMap>({ ...DEFAULT_COLORS });
  let isEnabled = $state<boolean>(true);

  return {
    get colors() { return colors; },
    get isEnabled() { return isEnabled; },

    setColors(newColors: StatusColorMap) {
      colors = { ...newColors };
      this.save();
    },

    setStatusColor(status: string, color: StatusColor) {
      colors[status] = color;
      this.save();
    },

    toggleEnabled() {
      isEnabled = !isEnabled;
      this.save();
    },

    resetToDefaults() {
      colors = { ...DEFAULT_COLORS };
      this.save();
    },

    getRowStyle(situacao: string): Record<string, string> | undefined {
      if (!isEnabled) return undefined;
      const color = colors[situacao];
      if (!color) return undefined;
      return {
        backgroundColor: color.backgroundColor,
        color: color.textColor,
      };
    },

    load() {
      if (typeof window === 'undefined') return;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          colors = { ...DEFAULT_COLORS, ...parsed.colors };
          isEnabled = parsed.isEnabled ?? true;
        } catch { /* usa defaults */ }
      }
    },

    save() {
      if (typeof window === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        colors,
        isEnabled,
      }));
    },
  };
}

export const rowColorsState = createRowColorsState();
```

### Modificação do Componente Table

```svelte
<!-- Adição da prop getRowStyle -->
<script lang="ts" generics="Tdata">
  type Props = {
    table: TableTansstack<Tdata>;
    onRowFocus?: (data: Tdata) => void;
    getRowStyle?: (data: Tdata) => Record<string, string> | undefined;
  };

  let { table, onRowFocus, getRowStyle }: Props = $props();
</script>

<!-- Na renderização da linha -->
<Table.Row
  style={getRowStyle ? (() => {
    const styles = getRowStyle(row.original);
    if (!styles) return '';
    return Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ');
  })() : ''}
>
```

### Integração no Panel (table-separacoes)

```svelte
<!-- panel.svelte - passando getRowStyle -->
<Table
  {table}
  onRowFocus={(row) => itensSeparacaoState.buscarItensSeparacao(row)}
  getRowStyle={(row) => rowColorsState.getRowStyle(row.situacao)}
/>
```

### Modificação do HeaderSelectColumns

```svelte
<!-- Adição do item "Configurar Cores" no dropdown -->
<li class="border-t border-gray-200 pt-2 mt-2">
  <button onclick={() => showColorModal = true}>
    <Palette size={16} />
    Configurar Cores
  </button>
</li>
```

## Pontos de Integração

Nenhuma integração externa é necessária. A funcionalidade é inteiramente client-side.

## Abordagem de Testes

### Testes Unitários

- **`row-colors.svelte.ts`**: Testar criação do state, load/save no localStorage (mockado), reset, toggle, getRowStyle para cada status.
- **`color-config-modal.svelte`**: Testar renderização dos 12 status, interação com seletores de cor, botão salvar e restaurar.

### Testes de Integração

- **Tabela com cores**: Verificar que ao passar `getRowStyle`, as linhas recebem o estilo correto.
- **Fluxo completo**: Abrir modal via dropdown → alterar cor → salvar → verificar que a linha reflete a cor.

### Testes E2E

- Abrir a tabela de separações → verificar cores padrão.
- Acessar configuração de cores → alterar uma cor → salvar → verificar que a tabela reflete.
- Recarregar a página → verificar que as cores persistem.

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **State Manager (`row-colors.svelte.ts`)** — Fundação sem dependências visuais.
2. **Modificação do `Table` genérico** — Adicionar suporte a `getRowStyle`.
3. **Integração no `panel.svelte`** — Conectar o state ao componente.
4. **Modal de Configuração** — UI de personalização.
5. **Modificação do dropdown** — Adicionar botão de acesso ao modal.
6. **Testes** — Unitários + integração.

### Dependências Técnicas

- Nenhuma nova dependência de pacotes necessária.
- Ícone `Palette` do `@lucide/svelte` (já instalado no projeto).

## Considerações Técnicas

### Decisões Principais

- **Estilo inline vs CSS classes**: Optamos por estilo inline (`style`) pois as cores são dinâmicas e definidas pelo usuário. Classes CSS exigiriam geração dinâmica ou CSS-in-JS, o que seria mais complexo sem benefício real.
- **State global vs local**: O state é global (`rowColorsState`) pois precisa ser acessado tanto pelo modal de configuração quanto pelo componente Table. Seguimos o padrão já existente no projeto (ex: `separacaoState`).
- **Prop `getRowStyle` genérica**: Em vez de acoplar a lógica de cores diretamente no `Table`, passamos uma função genérica, mantendo o componente reutilizável.
- **Toggle de habilitação**: Adicionamos um toggle `isEnabled` para que o usuário possa desativar as cores sem perder a configuração.

### Riscos Conhecidos

- **Contraste de cores**: Se o usuário escolher cores muito semelhantes para fundo e texto, a legibilidade pode ser comprometida. **Mitigação**: Fornecer cores padrão com bom contraste e mostrar preview no modal.
- **Interação com hover/seleção**: As cores de hover e seleção de linha (definidas via classes CSS) podem conflitar com os estilos inline. **Mitigação**: Garantir que hover e seleção usem `!important` ou que os estilos inline sejam de menor prioridade.

### Conformidade com Padrões

- Seguir as guidelines do **DaisyUI** para consistência visual dos componentes do modal e botões.
- Usar **Svelte 5 Runes** (`$state`, `$derived`, `$effect`) para gerenciamento de estado.
- Seguir o padrão de state management já existente no projeto (ex: `separacaoState`, `itensSeparacaoState`).

### Arquivos relevantes e dependentes

- `src/components/display/data-grid/table/table.svelte` — Componente genérico de tabela (modificar)
- `src/components/display/table/table-row.svelte` — Componente de linha (suporta `style` via restProps)
- `src/components/display/data-grid/header/header-select-columns.svelte` — Dropdown do botão de engrenagem (modificar)
- `src/components/display/data-grid/header/types.ts` — Tipos do header (possivelmente estender)
- `src/routes/expedicao/components/separacoes/panel/table-separacoes/panel.svelte` — Panel da tabela (modificar)
- `src/routes/expedicao/components/separacoes/panel/table-separacoes/columns.ts` — Definição de colunas com status
- `src/lib/types/separacao.ts` — Tipo `Separacao` (campo `situacao`)
- `src/lib/states/separacao.svelte.ts` — Estado existente das separações (referência de padrão)
