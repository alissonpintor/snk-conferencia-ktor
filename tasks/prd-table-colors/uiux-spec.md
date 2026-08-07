# Especificação de UI/UX: Sistema de Cores por Status

## Visão Geral Visual

A funcionalidade introduzirá coloração condicional nas linhas da tabela de separações, onde cada linha recebe uma cor de fundo suave e uma cor de texto escura baseada no status da separação. A configuração será acessível por um novo item no dropdown do botão de engrenagem (⚙️) já existente. O design segue os padrões DaisyUI/Tailwind, prioriza legibilidade e acessibilidade, e oferece uma experiência de configuração intuitiva via modal.

## Estrutura e Layout

- **Tabela**: As cores são aplicadas inline em cada `<tr>` da tabela de separações.
- **Botão de Acesso**: Item "Configurar Cores" no dropdown da engrenagem (⚙️) no header da tabela.
- **Modal de Configuração**: Modal centralizado, largura `max-w-lg` (512px), altura máxima `max-h-[80vh]` com scroll interno.

## Fluxo de Navegação

1. Usuário acessa a tela de Expedição → tabela de separações é exibida com cores aplicadas por status.
2. Usuário clica no ícone de engrenagem (⚙️) no header → dropdown abre com opções existentes + nova opção "Configurar Cores".
3. Usuário clica em "Configurar Cores" → modal abre.
4. Usuário ajusta as cores (fundo e texto) para cada status → preview é atualizado em tempo real.
5. Usuário clica em "Salvar" → cores são salvas no localStorage, modal fecha, tabela atualiza.
6. Alternativa: Usuário clica em "Restaurar Padrão" → cores voltam ao default.
7. Alternativa: Usuário clica fora do modal ou em "Cancelar" → alterações são descartadas.

## Especificações de Componentes

### Item "Configurar Cores" no Dropdown

- **Posição**: Após a lista de colunas, separado por uma borda (`border-t border-gray-200`).
- **Ícone**: `Palette` do Lucide, tamanho 16px.
- **Texto**: "Configurar Cores".
- **Estados**:
    - **Default**: Texto e ícone em `base-content`.
    - **Hover**: Background `primary`, texto `primary-content` (seguindo padrão dos demais itens do dropdown).

### Modal de Configuração de Cores

- **Anatomia**:
    - Título: "Configurar Cores por Status" — `text-lg font-bold`.
    - Subtítulo opcional: "Defina as cores de fundo e de texto para cada status da tabela" — `text-sm text-base-content/60`.
    - Toggle "Habilitar cores": Checkbox/Toggle DaisyUI para ativar/desativar o sistema de cores sem perder a configuração.
    - Lista de status: Cada item em um card ou row, com:
        - Nome do status (label)
        - Input de cor para background (`type="color"`)
        - Input de cor para texto (`type="color"`)
        - Preview: Pequena célula com o texto do status renderizado nas cores selecionadas.
    - Rodapé com botões de ação.

- **Cores (Design Tokens)**:
    - Background do modal: `bg-base-100`
    - Borda: `border border-base-200`
    - Overlay: `bg-black/50` (backdrop)

- **Estados**:
    - **Aberto**: Fade-in 200ms
    - **Fechado**: Fade-out 150ms

### Card de Status (dentro do modal)

- **Layout**: Flex row, `items-center`, `gap-3`, `p-2`.
- **Border-bottom**: `border-b border-base-200` (separador entre itens).
- **Elementos por linha**:
    1. **Label do status**: `flex-1`, `text-sm font-medium`.
    2. **Input cor fundo**: `type="color"`, tamanho `w-8 h-8`, `rounded`, `border border-base-300`, label "Fundo" acima em `text-xs text-base-content/50`.
    3. **Input cor texto**: `type="color"`, tamanho `w-8 h-8`, `rounded`, `border border-base-300`, label "Texto" acima em `text-xs text-base-content/50`.
    4. **Preview**: Container `px-3 py-1 rounded text-sm`, com `style="background-color: {bg}; color: {text};"`, conteúdo = nome do status.

### Botões de Ação (Rodapé do Modal)

- **Salvar**: `btn btn-primary btn-sm` — Salva as configurações e fecha o modal.
- **Restaurar Padrão**: `btn btn-ghost btn-sm` — Reseta todas as cores para os valores padrão.
- **Cancelar**: `btn btn-ghost btn-sm` — Fecha o modal sem salvar.
- **Layout**: `flex justify-end gap-2`.

### Linhas da Tabela (com cores aplicadas)

- **Estilo**: `style="background-color: {bg}; color: {text};"` aplicado no `<tr>`.
- **Hover**: O hover existente (`hover:bg-primary hover:cursor-pointer`) deve ter prioridade sobre a cor de fundo do status. Isso pode ser feito com CSS `!important` ou ajustando a classe hover no componente `Table`.
- **Seleção**: A linha selecionada (`bg-primary text-primary-content`) deve ter prioridade sobre a cor do status.
- **Sem cor**: Se o sistema de cores estiver desabilitado ou o status não tiver cor configurada, a linha fica com a aparência padrão (sem estilo inline).

## Comportamento Responsivo

- **Desktop**: Modal centralizado com largura fixa (`max-w-lg`). Lista de status com scroll interno se necessário.
- **Mobile**: Modal ocupa largura quase total (`max-w-[95vw]`). Inputs de cor podem ser menores (`w-6 h-6`). Preview pode ser omitido ou simplificado. A lista de status é scrollável verticalmente.

## Interações e Animações

- **Abertura do modal**: `transition: opacity 200ms ease-out, transform 200ms ease-out` — slide-up sutil + fade-in.
- **Fechamento do modal**: `transition: opacity 150ms ease-in` — fade-out.
- **Input de cor**: Ao alterar a cor via seletor nativo, o preview atualiza em tempo real (binding reativo do Svelte).
- **Feedback ao salvar**: Toast ou apenas o fechamento do modal (sem toast, para simplicidade).

## Acessibilidade (A11y)

- **Contraste**: As cores padrão devem atender ao mínimo WCAG AA (ratio ≥ 4.5:1 para texto normal).
- **Navegação por Teclado**: O modal deve ser navegável via Tab. Os inputs de cor devem ser focáveis. Enter no botão "Salvar" confirma. Esc fecha o modal.
- **Leitores de Tela**:
    - Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="color-config-title"`.
    - Inputs de cor: `aria-label="Cor de fundo para {status}"` e `aria-label="Cor do texto para {status}"`.
    - Toggle de habilitação: `aria-label="Habilitar cores por status"`.
- **Focus Trap**: Ao abrir o modal, o foco deve ser preso dentro dele. Ao fechar, o foco retorna ao botão que o abriu.

## Tratamento de Dados e Erros

- **Dados ausentes**: Se o `localStorage` não contiver configuração de cores, usar cores padrão silenciosamente.
- **Dados corrompidos**: Se o JSON no `localStorage` estiver corrompido, ignorar e usar cores padrão.
- **Status desconhecido**: Se um registro tiver um status não mapeado, a linha fica sem cor (estilo padrão).

## Paleta de Cores Padrão

| Status | Fundo (bg) | Texto |
|--------|-----------|-------|
| Aguardando Separação | `#fff3e0` (laranja claro) | `#e65100` (laranja escuro) |
| Enviado para Separação | `#e3f2fd` (azul claro) | `#0d47a1` (azul escuro) |
| Em Processo de Separação | `#e8eaf6` (índigo claro) | `#1a237e` (índigo escuro) |
| Aguardando Conferência | `#fff8e1` (âmbar claro) | `#f57f17` (âmbar escuro) |
| Em Processo de Conferência | `#f3e5f5` (roxo claro) | `#4a148c` (roxo escuro) |
| Conferência com Divergência | `#fce4ec` (rosa claro) | `#b71c1c` (vermelho escuro) |
| Aguardando Recontagem | `#fbe9e7` (deep orange claro) | `#bf360c` (deep orange escuro) |
| Aguardando Conferência de Volumes | `#e0f2f1` (teal claro) | `#004d40` (teal escuro) |
| Conferência Validada | `#e8f5e9` (verde claro) | `#1b5e20` (verde escuro) |
| Concluído | `#e0f7fa` (ciano claro) | `#006064` (ciano escuro) |
| Cancelada | `#efebe9` (marrom claro) | `#3e2723` (marrom escuro) |
| Possui Retorno de Mercadoria | `#fce4ec` (pink claro) | `#880e4f` (pink escuro) |

## Assets

- **Ícones**:
    - `Palette` (Lucide) — Botão "Configurar Cores" no dropdown.
    - `RotateCcw` (Lucide) — Botão "Restaurar Padrão" (já utilizado no projeto).
- **Fontes**: Nenhuma fonte adicional necessária.
- **Imagens**: Nenhuma imagem adicional necessária.
