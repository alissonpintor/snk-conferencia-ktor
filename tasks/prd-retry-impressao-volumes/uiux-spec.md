# Especificação de UI/UX: Retry Impressão de Volumes

## Visão Geral Visual

Esta funcionalidade é predominantemente backend. Não há mudanças visuais planejadas no layout existente do componente `registrar-volume.svelte`.

## Fluxo de Navegação

1. [Conferência Finalizada] -> [Usuário informa volumes] -> [Clica em Confirmar]
2. [Sistema processa Registro] -> [Chama Impressão]
3. [Se erro WMS_E00144]:
   - O indicador de carregamento (Loading) do botão/modal permanece ativo.
   - O sistema aguarda internamente e tenta novamente.
4. [Sucesso]: O PDF é retornado e aberto/impresso.
5. [Falha após 3 tentativas]: Um toast/modal de erro é exibido ao usuário com a mensagem final do Sankhya.

## Tratamento de Dados e Erros

- **Feedback de Espera**: Durante o retry, o estado de "Loading" deve ser mantido para indicar que a operação ainda está em curso.
- **Mensagem de Erro**: Se todas as tentativas falharem, exibir: "Não foi possível gerar as etiquetas após várias tentativas. Por favor, tente imprimir manualmente em alguns instantes."

## Assets

Nenhum novo asset visual é necessário.
