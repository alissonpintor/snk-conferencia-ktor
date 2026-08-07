# Especificação de UI/UX: Filtros Avançados de Coluna

## Visão Geral Visual

A funcionalidade introduzirá controles de filtragem discretos mas poderosos nos cabeçalhos das tabelas. O design seguirá a identidade visual existente (DaisyUI/Tailwind), utilizando ícones familiares e interações padrão de dropdown para não obstruir a visão dos dados. O foco é na clareza e facilidade de uso rápida para conferentes.

## Estrutura e Layout

- **Localização**: Dentro do cabeçalho de cada coluna (`TableHeader`).
- **Trigger**: Ícone de filtro (`Funnel` do Lucide) ao lado do título da coluna.
- **Container**: Dropdown/Popover posicionado abaixo do cabeçalho, com largura suficiente para os inputs (min. 250px).

## Fluxo de Navegação

1.  Usuário clica no ícone de filtro no cabeçalho da coluna desejada.
2.  Dropdown se abre com os campos de filtro específicos para o tipo de dado da coluna.
3.  Usuário preenche/seleciona os critérios.
4.  Usuário clica em "Aplicar" (ou pressiona Enter) -> O filtro é aplicado, o dropdown fecha, e o ícone do filtro muda de estado.
5.  Usuário clica em "Limpar" -> O filtro é removido, o dropdown fecha (ou mantém aberto para nova seleção), e o ícone volta ao estado original.

## Especificações de Componentes

### Ícone de Filtro (Trigger)

- **Default**: `Funnel` (outline), cor text-base-content/50 (cinza claro/médio).
- **Hover**: Cor `primary`.
- **Ativo (Com Filtro)**: `Funnel` (filled) ou `FilterX`, cor `primary` ou `accent`, indicando visualmente que a coluna está filtrada.

### Dropdown de Filtro

- **Background**: `base-100` (branco/escuro, conforme tema).
- **Shadow**: `shadow-lg` ou `shadow-xl`.
- **Border**: `border border-base-200` (sutil).
- **Padding**: `p-2` ou `p-3`.
- **Gap**: `gap-2` entre elementos.

### Tipos de Input

#### Filtro de Texto
- Input único `type="text"`.
- Placeholder: "Pesquisar..."
- Ícone de busca `Search` opcional.

#### Filtro Numérico
- Dois inputs `type="number"`.
- Labels/Placeholders: "Mín" e "Máx".
- Layout: Lado a lado (flex-row).

#### Filtro de Data
- Dois inputs `type="date"`.
- Labels: "De:" e "Até:".
- Layout: Stack vertical ou lado a lado se couber.

#### Filtro de Seleção (Lista)
- Lista de checkboxes com scroll se exceder ~5 itens (`max-h-48 overflow-y-auto`).
- Label do checkbox com o texto da opção.
- Opção "Selecionar Todos" no topo (desejável).

### Botões de Ação (Rodapé do Dropdown)

- **Aplicar**: Botão `btn btn-primary btn-sm`.
- **Limpar**: Botão `btn btn-ghost btn-sm text-error` (vermelho).

## Comportamento Responsivo

- **Mobile**: O dropdown deve se ajustar para não ultrapassar a largura da tela. Se necessário, centralizar ou usar `dropdown-end` vs `dropdown-start` dependendo da posição da coluna.

## Interações e Animações

- **Transição**: Fade-in rápido (100-150ms) ao abrir o dropdown.
- **Feedback**: Ao aplicar, a tabela pode mostrar um loading state rápido se o processamento for perceptível (improvável com poucos dados, mas boa prática).

## Acessibilidade (A11y)

- **Teclado**: O dropdown deve ser acessível via Tab. Enter no input deve submeter o formulário (aplicar filtro). Esc deve fechar o dropdown.
- **Leitores de Tela**: O ícone deve ter `aria-label="Filtrar por [Nome da Coluna]"`. O estado ativo deve ser comunicado (`aria-pressed="true"` ou similar).
