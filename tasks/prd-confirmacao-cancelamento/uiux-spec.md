# Especificação de UI/UX: Confirmação de Cancelamento

## Visão Geral Visual

O diálogo deve seguir o padrão "Destructive Action Confirmation". Ele deve ser visualmente distinto para alertar o usuário sobre as consequências. Utilizaremos tons de vermelho para a ação de cancelar e tons neutros/suaves para a ação de continuar.

## Fluxo de Navegação

1. [Painel de Conferência] -> Botão [Cancelar] -> [Modal de Confirmação]
2. [Modal de Confirmação] -> Botão [Não, Continuar] -> Fecha Modal [Painel de Conferência] (Mantém Estado)
3. [Modal de Confirmação] -> Botão [Sim, Cancelar] -> Executa Ação -> Fecha Modal -> [Estado Inicial da Conferência]

## Especificações de Componentes

### Modal de Confirmação

- **Anatomia**:
    - **Header**: Ícone de Alerta + Título "Confirmar Cancelamento".
    - **Body**: Texto "Tem certeza que deseja cancelar esta tarefa? Esta ação não pode ser desfeita.".
    - **Footer**: 
        - Botão Secundário (Esquerda): "Não, Voltar" (Outline).
        - Botão Primário (Direita): "Sim, Cancelar" (Variante `error` ou `destructive`).

### Cores (Design Tokens)
- Título/Botão Confirmar: `error` (DaisyUI).
- Fundo do Ícone: `error-content` ou variante suave.

## Interações e Animações

- **Transições**: Fade-in e scale-up suave ao abrir o modal (padrão DaisyUI).
- **Acessibilidade**: 
    - O foco inicial deve estar no botão "Não, Voltar" para evitar cancelamentos acidentais por pressionamento rápido de Enter.
    - Suporte a `ESC` para fechar.

## Assets
- Ícones: `CircleAlert` do Lucide.
