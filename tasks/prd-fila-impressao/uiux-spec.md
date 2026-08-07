# UI/UX Spec - Fila de Impressão de Volumes

## Visão Geral

A implementação da fila de impressão no backend deve ser transparente para o usuário, mas pode aumentar o tempo de resposta em momentos de pico (múltiplas solicitações). O frontend deve garantir uma boa experiência de espera.

## Componentes Envolvidos

- **Tela de Registro de Volumes (`pages/expedicao`)**: Botão "Imprimir Etiquetas" ou similar.
- **Componentes de Feedback (`toasts`, `modais`, `loading states`)**.

## Comportamento Esperado

### 1. Estado de Carregamento (Loading)

- **Ação**: Usuário clica em "Imprimir".
- **Feedback**:
    - O botão deve ficar desabilitado e mostrar um indicador de processamento (spinner/loading).
    - **Texto**: Opcionalmente alterar para "Processando..." ou "Aguardando Fila..." (se o backend retornar status de fila - fora do escopo MVP, manter "Imprimindo...").

### 2. Tempo de Espera Estendido

- **Cenário**: Se houver muitas requisições na fila, o tempo de espera pode exceder os habituais 2-5 segundos.
- **Feedback**: O loading deve persistir até a resposta final (sucesso ou erro).
- **Timeout**: Se o servidor demorar muito (ex: > 30s), o frontend deve tratar o erro de timeout gracefuly ("O servidor demorou muito para responder. Tente novamente.").

### 3. Falha na Impressão

- **Cenário**: Erro na API ou timeout.
- **Feedback**: Mostrar toast de erro claro ("Não foi possível imprimir. Tente novamente.").
- **Ação**: Reabilitar botão de impressão.

## Protótipo Visual (Conceitual)

- **Botão Normal**: `[ Imprimir Volumes ]` (Primary Color)
- **Botão Loading**: `[ (Spinner) Processando... ]` (Disabled, Opacity 0.7)

## Requisitos de Implementação

- Garantir que o `await fetch(...)` no frontend bloqueie a UI corretamente até a Promise resolver, independente do tempo que levar na fila do servidor.
- Não permitir múltiplos cliques no botão de impressão enquanto uma requisição está pendente.

## Métricas de UX (Opcional)

- Monitorar tempo médio de resposta do endpoint de impressão para identificar gargalos na fila.
