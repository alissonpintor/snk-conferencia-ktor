# Tarefa 2.0: Refatoração da Interface (UI) e Validação E2E

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementação da interface de usuário da página de login, utilizando **Svelte 5 Runes** e **Tailwind CSS** para garantir uma experiência moderna e responsiva. Além disso, validação completa do fluxo de autenticação através de testes End-to-End (E2E) com Playwright.

<requirements>
- **Svelte 5 Runes**: Utilizar a nova sintaxe de reatividade (`$state`, `$derived`, `$props`, `$effect`).
- **Tailwind CSS**: Seguir o design system e utilizar classes utilitárias para estilização.
- **UX Robusta**: Feedback visual claro para estados de carregamento (loading spinner), sucesso e erro (toast/inline text).
- **Integração Backend**: Conectar o formulário à action de servidor criada na Task 1.0, utilizando `use:enhance` ou `superforms`.
- **Validação Client-Side**: Implementar validação imediata nos campos (se possível com Zod schema compartilhado).
- **Testes E2E**: Cobrir fluxos críticos de login (sucesso, falha, validação de campos).
</requirements>

## Subtarefas

- [ ] 2.1 Desenvolver a estrutura HTML e estilos da página de Login (`src/routes/login/+page.svelte`) com Tailwind CSS.
- [ ] 2.2 Implementar lógica de componente com Svelte 5 Runes (gerenciamento de estado local para form).
- [ ] 2.3 Integrar o formulário com a Action do servidor (`use:enhance`), tratando estados de submissão (loading).
- [ ] 2.4 Adicionar feedback visual de erros de validação (inline) e erros de API (toast/alert).
- [ ] 2.5 Criar testes E2E com Playwright (`tests/auth.spec.ts` ou similar) cobrindo:
    - Login com sucesso.
    - Tentativa de login com senha incorreta.
    - Tentativa de login com usuário inexistente.
    - Validação de campos obrigatórios vazios.
    - Verificação de redirecionamento pós-login.

## Detalhes de Implementação

Consultar `uiux-spec.md` para:
- Layout do Card de Login.
- Estados dos campos de input (foco, erro, desabilitado).
- Comportamento responsivo.
- Feedback visual específico (cores, ícones).

## Critérios de Sucesso

- [ ] Interface fiel ao UI Spec (ou o mais próximo possível usando Tailwind).
- [ ] Usuário vê feedback imediato ao esquecer campos obrigatórios.
- [ ] Botão de "Entrar" desabilita e mostra spinner durante a requisição.
- [ ] Em caso de erro de API, mensagem clara é exibida sem recarregar a página.
- [ ] Todos os testes E2E passam em ambiente local.
- [ ] Navegação por teclado funciona corretamente (Tab order).

## Testes da Tarefa

- [ ] Testes E2E (Playwright):
    - Cenário de Sucesso (Login -> Dashboard).
    - Cenário de Erro (Senha incorreta -> Mensagem de erro).
    - Cenário de Validação (Campos vazios -> Mensagem inline).

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `src/routes/login/+page.svelte`
- `tests/auth.spec.ts` (novo arquivo)
- `playwright.config.ts` (verificar configurações)
