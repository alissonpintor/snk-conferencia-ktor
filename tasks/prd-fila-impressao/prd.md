# PRD - Fila de Impressão de Volumes

## Introdução

Este documento descreve a implementação de uma fila de processamento para a impressão de etiquetas de volumes na conferência. O objetivo é resolver um problema de concorrência onde solicitações simultâneas resultam na entrega incorreta de etiquetas (usuários recebendo a etiqueta de outro usuário ou a última gerada).

## Problema

Atualmente, quando dois ou mais usuários solicitam a impressão de etiquetas de volume simultaneamente (ou em um intervalo de tempo muito curto), a API do Sankhya ou o fluxo de integração retorna a mesma etiqueta (geralmente a última gerada) para todos os solicitantes. Isso indica uma condição de corrida (Race Condition) no backend do ERP ou no mecanismo de geração de relatórios.

## Objetivos

- Garantir que cada solicitação de impressão seja processada de forma isolada e sequencial.
- Evitar que usuários recebam etiquetas incorretas devido à concorrência.
- Melhorar a confiabilidade do processo de expedição.

## Escopo

### Funcionalidades

1.  **Fila de Impressão (Backend)**:
    - Interceptar todas as chamadas ao endpoint de impressão de volumes.
    - Adicionar cada solicitação a uma fila de processamento (FIFO - First In, First Out).
    - Processar uma solicitação por vez.
    
2.  **Feedback ao Usuário (Frontend - Opcional/Melhoria)**:
    - O tempo de resposta pode aumentar ligeiramente se houver fila. O frontend deve manter o loading state ativo.

## Requisitos Não Funcionais

- **Confiabilidade**: A fila deve garantir a ordem de chegada.
- **Performance**: O overhead da fila deve ser mínimo quando não houver concorrência.
- **Limitações**: Em ambiente Serverless (Cloudflare Workers), a fila em memória funciona apenas no escopo da instância ativa. Se houver escalabilidade horizontal massiva, uma solução distribuída seria necessária (fora do escopo deste MVP).

## Casos de Uso

1.  **Cenário de Concorrência**:
    - Usuário A solicita impressão (Job 1).
    - Usuário B solicita impressão (Job 2) logo em seguida (milissegundos depois).
    - Sistema processa Job 1.
    - Sistema aguarda conclusão de Job 1.
    - Sistema processa Job 2.
    - Usuário A recebe Etiqueta A.
    - Usuário B recebe Etiqueta B.

## Critérios de Aceitação

- Testes de carga simulando requisições simultâneas devem resultar em etiquetas corretas e distintas para cada requisição.
- O sistema não deve travar se a fila crescer (timeout deve ser tratado).
