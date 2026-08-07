# PRD: Confirmação de Cancelamento de Tarefa

## Visão Geral

Atualmente, quando o usuário clica no botão "Cancelar" durante a execução de uma tarefa de conferência, a ação é disparada imediatamente. Isso pode levar a cancelamentos acidentais de tarefas em progresso, resultando em perda de tempo e retrabalho. Esta funcionalidade visa introduzir uma camada de segurança (modal de confirmação) para evitar ações indesejadas.

## Objetivos

- Reduzir o número de cancelamentos acidentais de tarefas.
- Melhorar a experiência do usuário fornecendo uma confirmação clara antes de uma ação destrutiva/irreversível.
- Padronizar o uso de modais de confirmação na aplicação.

## Histórias de Usuário

- Como **conferente**, eu quero ser questionado se realmente desejo cancelar a tarefa ao clicar no botão "Cancelar", para que eu não perca meu progresso por um clique errado.
- Como **conferente**, eu quero poder desistir do cancelamento e voltar para a tarefa exatamente de onde parei.

## Funcionalidades Principais

1. **Modal de Confirmação Interativo**:
   - Exibe um título claro (ex: "Confirmar Cancelamento").
   - Exibe uma mensagem de advertência (ex: "Tem certeza que deseja cancelar esta tarefa? Todo o progresso não salvo será perdido.").
   - Oferece dois botões: "Sim, Cancelar" (destrutivo) e "Não, Continuar" (cancelar ação).
2. **Prevenção de Execução Imediata**:
   - O clique no botão original apenas abre o modal.
   - A lógica de negócio `cancelarTarefa()` só é executada após o clique em "Confirmar" no modal.

## Experiência do Usuário

- **Fluxo**: Clique em "Cancelar" -> Abre Modal -> Clique em "Sim" -> Executa Cancelamento -> Fecha Modal.
- **Fluxo Alternativo**: Clique em "Cancelar" -> Abre Modal -> Clique em "Não" (ou fora do modal/Esc) -> Fecha Modal -> Mantém estado atual.
- **Acessibilidade**: O modal deve ser fechável via tecla ESC e deve focar o botão de cancelamento (ação segura) por padrão.

## Restrições Técnicas de Alto Nível

- Utilizar o componente `Modal.svelte` base já existente no projeto.
- Garantir que o estado de "cancelando" (spinner) seja exibido corretamente caso o backend demore a processar após a confirmação.

## Fora de Escopo

- Cancelamento automático por timeout.
- Histórico de cancelamentos nesta interface específica.
