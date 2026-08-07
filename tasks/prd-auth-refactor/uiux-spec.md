# Especificação de UI/UX: Módulo de Autenticação (Login)

## Visão Geral Visual

Interface de login limpa, profissional e direta, utilizando o Design System existente (DaisyUI + TailwindCSS). O foco é fornecer uma experiência de acesso sem atritos, transmitindo segurança e modernidade. A "vibe" deve ser minimalista, com foco no conteúdo principal (o formulário).

## Estrutura e Layout

- **Layout Principal**: Centralizado verticalmente e horizontalmente na tela (Flexbox/Grid center).
- **Container**: Card com sombra suave (`shadow-xl`) e bordas arredondadas (`rounded-box`).
- **Fundo**: Cor de fundo neutra (`bg-base-200`) para destacar o card de login (`bg-base-100`).
- **Breakpoints**:
    - **Desktop (Default/First)**: Card com largura fixa (ex: `w-96` ou `max-w-md`).
    - **Mobile (< 640px)**: Card ocupa 100% da largura, com padding lateral reduzido.

## Fluxo de Navegação

1. **Acesso**: Usuário acessa a rota `/login`.
2. **Interação**: Usuário preenche "E-mail" e "Senha".
3. **Ação**: Clica em "Entrar".
   - **Loading**: Botão entra em estado de carregamento (`loading loading-spinner`).
   - **Sucesso**: Redirecionamento para o Dashboard (`/`).
   - **Erro**: Exibição de mensagem de erro (Toast ou Texto abaixo do input).

## Especificações de Componentes

### Card de Login (Container)
- **Anatomia**:
    - **Background**: `bg-base-100` (Branco/Cinza claro dependendo do tema).
    - **Sombra**: `shadow-xl`.
    - **Padding**: `p-8` (32px).
    - **Borda**: `rounded-xl`.

### Campo de Input (Email e Senha)
- **Componente Base**: `input input-bordered` (DaisyUI).
- **Tipografia**: `text-base`.
- **Estados**:
    - **Default**: Borda cinza suave (`border-base-300`).
    - **Focus**: Borda na cor primária (`input-primary`), outline removido.
    - **Error**: Borda vermelha (`input-error`), ícone de alerta opcional à direita.
    - **Disabled**: Fundo cinza (`bg-base-200`), cursor `not-allowed`.

### Botão "Entrar" (Primary Action)
- **Componente Base**: `btn btn-primary` (DaisyUI).
- **Largura**: `w-full` (100% do container).
- **Estados**:
    - **Default**: Cor primária sólida, texto contrastante.
    - **Hover**: Levemente mais escuro (comportamento padrão DaisyUI).
    - **Active**: Efeito de clique (transform scale leve).
    - **Loading**: Mostra spinner (`loading loading-spinner`) e texto "Entrando...".
    - **Disabled**: Opacidade reduzida, sem interação.

### Links Auxiliares (Esqueci minha senha / Cadastre-se - *Se aplicável futuramente*)
- **Estilo**: `link link-hover text-sm`.
- **Cor**: `text-secondary` ou `text-neutral-content`.

## Comportamento Responsivo

- **Desktop (> 1024px)**:
    - Card centralizado na tela.
    - Fundo com padrão sutil ou cor sólida (`bg-base-200`).
- **Tablet (768px - 1024px)**:
    - Mantém centralização.
- **Mobile (< 640px)**:
    - Card pode ocupar a tela inteira ou ter margens laterais pequenas (`mx-4`).
    - Inputs com altura de toque adequada (> 44px).

## Interações e Animações

- **Transições**:
    - Focus nos inputs: `transition-all duration-200`.
    - Hover no botão: `transition-colors duration-200`.
- **Feedback Visual**:
    - **Erro de validação**: Texto vermelho pequeno (`text-error text-xs mt-1`) abaixo do campo inválido.
    - **Erro de API**: Toast notification no canto superior direito (`alert alert-error`).

## Acessibilidade (A11y) Requirements

- **Labels**: Todos os inputs devem ter `<label>` associado ou `aria-label`.
- **Foco**: Outline de foco visível em todos os elementos interativos.
- **Contraste**: Garantir contraste suficiente entre texto e fundo (automático com temas DaisyUI bem configurados, mas verificar).
- **Navegação por Teclado**: Ordem de tabulação lógica (Email -> Senha -> Botão).
- **Auto-complete**: Atributos `autocomplete="username"` (email) e `autocomplete="current-password"` (senha) devem estar presentes.

## Tratamento de Dados e Erros

- **Validação Local**:
    - Email: Formato válido.
    - Senha: Não vazia.
- **Mensagens de Erro**:
    - "Credenciais inválidas" (Genérico para segurança).
    - "O campo E-mail é obrigatório".
    - "Erro no servidor. Tente novamente mais tarde."

## Assets

- **Ícones**: Utilizar `lucide-svelte` (já instalado).
    - Ícone de "Olho" para mostrar/ocultar senha (opcional, mas recomendado para UX).
    - Ícone de "Alerta" para mensagens de erro.
