# Especificação de UI/UX: Redimensionamento de Colunas

## Visão Geral

Melhorar a experiência do usuário permitindo o ajuste manual da largura das colunas em tabelas de dados densas. O foco é fornecer feedback visual claro e persistência das preferências do usuário.

## Elementos de Interface

### 1. Manipulador de Redimensionamento (Resize Handle)

-   **Área de Interação**:
    -   Uma área de clique de 4px a 8px de largura na borda direita de cada cabeçalho de coluna (`th`).
    -   Posicionada no topo (`top-0`) com altura total (`h-full`).
    -   O cursor deve mudar para `col-resize` ao passar o mouse sobre essa área.

-   **Estados Visuais**:
    -   **Default**: Invisível (opacity: 0). Mantenha a interface limpa.
    -   **Hover (cabeçalho)**: Ao passar o mouse sobre o cabeçalho (`th:hover`), a barra de redimensionamento deve se tornar visível (`bg-base-300` ou similar) com opacidade reduzida.
    -   **Hover (handle)**: Ao passar o mouse diretamente sobre o handle, ele deve se destacar mais (ex: `bg-primary` ou `bg-base-content/20`).
    -   **Active (dragging)**: Enquanto o usuário arrasta, a barra deve permanecer destacada (`bg-primary`).

### 2. Comportamento de Redimensionamento

-   **Feedback em Tempo Real**: A largura da coluna deve ajustar-se imediatamente enquanto o mouse se move (`columnResizeMode: "onChange"`).
-   **Cursor**: O cursor do mouse deve permanecer como `col-resize` ou `ew-resize` durante todo o movimento de arraste, mesmo se o mouse sair da área do cabeçalho.
-   **Texto**: A seleção de texto deve ser prevenida (`user-select: none`) nos cabeçalhos durante o redimensionamento.

### 3. Rolagem Horizontal

-   **Layout**: A tabela deve ter `table-layout: fixed`.
-   **Overflow**: O contêiner pai deve ter `overflow-x: auto`.
-   **Scrollbar**: Se possível, estilizar a barra de rolagem para ser sutil (fina), compatível com o tema (DaisyUI).

## Diretrizes de Acessibilidade

-   O redimensionamento deve ser possível de interagir via mouse.
-   (Opcional/Nice-to-have) Acessibilidade via teclado não é estritamente requerida nesta iteração (foco em mouse para desktop), mas o elemento handle deve ter `role="separator"` ou similar semanticamente se for um elemento interativo.

## Mockups (Descritivo)

### Estado Normal
```
| Coluna A      | Coluna B      |
[             ] [             ]
```
(Nenhuma borda extra visível)

### Estado Hover (mouse sobre cabeçalho Coluna A)
```
| Coluna A      | Coluna B      |
[             |] [             ]
              ^ Barra cinza clara aparece na borda direita
```

### Estado Active (arrastando)
```
| Coluna A           | Coluna B      |
[                   |] [             ]
                    ^ Barra azul (primary) indica ação ativa
```
Cursor: `<->` (ew-resize)
