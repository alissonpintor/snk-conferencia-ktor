# Template de Documento de Requisitos de Produto (PRD)

## Visão Geral

Este documento descreve a implementação de um mecanismo de retry para a geração de etiquetas de volume na conferência. Atualmente, a API do Sankhya pode retornar um erro indicando que as etiquetas ainda não foram processadas logo após o registro do volume, causando falhas na impressão automática.

## Objetivos

- Garantir que as etiquetas de volume sejam impressas com sucesso mesmo quando o Sankhya demora a processar o registro.
- Reduzir a necessidade de intervenção manual do usuário para re-imprimir etiquetas.
- Melhorar a confiabilidade do fluxo de conferência/expedição.

## Histórias de Usuário

- Como conferente, eu quero que o sistema tente imprimir as etiquetas automaticamente se houver um atraso no processamento do ERP, para que eu não precise clicar em imprimir novamente ou lidar com erros inesperados.

## Funcionalidades Principais

1. **Mecanismo de Retry Inteligente**:
   - Detectar erros de "etiquetas ainda não impressas" ou outros erros temporários da API Sankhya.
   - Realizar até 3 tentativas adicionais de chamada ao endpoint de impressão.
   - Implementar um intervalo incremental entre as tentativas ($n \times 2$ segundos).

2. **Feedback de Processamento** (Opcional/UI):
   - Informar ao usuário que o processamento está em andamento se o retry estiver ocorrendo (depende do frontend).

## Experiência do Usuário

- O usuário confirma a quantidade de volumes no componente `registrar-volume.svelte`.
- O sistema processa o registro e a impressão.
- Se houver necessidade de retry, o usuário pode perceber um pequeno atraso, mas a etiqueta deve ser gerada sem erro visível (a menos que todas as tentativas falhem).

## Restrições Técnicas de Alto Nível

- O retry deve ocorrer no lado do servidor (SvelteKit Action ou API endpoint).
- O intervalo de retry deve respeitar a fórmula $n \times 2$ segundos.
- Máximo de 3 tentativas extras (total 4 chamadas no pior caso).
- Integração obrigatória com a API `MgeWmsSP.enviaConferenciaPedidosParaDoca` (ou similar conforme `prompt volumes.md`).

## Fora de Escopo

- Alterações no layout da etiqueta.
- Mudanças no fluxo de registro de volume (apenas o fluxo de impressão é afetado pelo retry).
- Implementação de retry para outros serviços não relacionados à impressão de volumes.
