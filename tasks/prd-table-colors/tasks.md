# Tasks - Sistema de Cores por Status

## Task 1: Criar State Manager de Cores (row-colors.svelte.ts)
- [x] Criar arquivo `src/lib/states/row-colors.svelte.ts`
- [x] Implementar tipos `StatusColor` e `StatusColorMap`
- [x] Implementar `DEFAULT_COLORS` com os 12 status
- [x] Implementar `createRowColorsState` com Svelte 5 Runes
- [x] Implementar métodos: `setColors`, `setStatusColor`, `toggleEnabled`, `resetToDefaults`, `getRowStyle`, `load`, `save`
- [x] Criar testes unitários em `src/lib/states/row-colors.test.ts`

## Task 2: Modificar Componente Table Genérico
- [x] Adicionar prop `getRowStyle` ao componente `table.svelte`
- [x] Aplicar estilo inline nas linhas do body quando `getRowStyle` é fornecido
- [x] Garantir que hover e seleção tenham prioridade sobre o estilo inline

## Task 3: Criar Modal de Configuração de Cores
- [x] Criar componente `color-config-modal.svelte`
- [x] Implementar layout com lista de 12 status
- [x] Implementar inputs de cor para fundo e texto
- [x] Implementar preview em tempo real
- [x] Implementar botões Salvar, Restaurar Padrão e Cancelar
- [x] Implementar toggle de habilitação
- [x] Implementar acessibilidade (role, aria-labels, focus trap)

## Task 4: Modificar Dropdown da Engrenagem
- [x] Adicionar item "Configurar Cores" no `header-select-columns.svelte`
- [x] Usar ícone `Palette` do Lucide
- [x] Emitir callback para abrir o modal

## Task 5: Integrar no Panel da Tabela de Separações
- [x] Importar `rowColorsState` no `panel.svelte`
- [x] Passar `getRowStyle` para o componente `Table`
- [x] Carregar cores do localStorage no mount
- [x] Conectar modal de configuração
- [x] Adicionar `onConfigureColors` ao `selectColumns`

## Task 6: Testes
- [x] Testes unitários do state manager (17 testes)
- [x] Executar todos os testes e garantir 100% de sucesso (41 testes, 6 arquivos)
