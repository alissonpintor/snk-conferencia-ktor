# PRD: Migração dos Endpoints da Tela de Conferência para Ktor

## Visão Geral

Migração de todos os 13 endpoints REST da funcionalidade de conferência de expedição (`src/routes/expedicao/components/conferencia` e `src/routes/api/conferencia`) da camada BFF em SvelteKit para o serviço backend em Kotlin/Ktor (`backend/`).

Esta migração centraliza as regras de integração com o ERP Sankhya (serviços `MgeWmsSP.*` e views de separação) no backend Ktor, adota contratos REST semânticos com tratamento nativo de status HTTP e eleva o nível de resiliência e segurança operacional (autenticação via JWT/Session Context e sanitização de logs).

## Objetivos

- **Migração Integral**: Transferir 100% das chamadas de backend da conferência (busca de conferência, início de tarefa, bipagem/registro de item, saldo, recontagem/remoção, tarefas pendentes, finalização, volumes, doca e impressão de etiquetas) para a API Ktor sob o prefixo `/api/v1/conferencia/`.
- **Padronização RESTful**: Substituir a estrutura wrapper legada `{ success: boolean, data: ..., error: [...] }` por respostas HTTP REST semânticas (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error) com DTOs JSON fortificados em Kotlin Serialization.
- **Sessão Transparente**: Extrair a sessão do Sankhya (`JSESSIONID`, `baseUrl`, `userId`) a partir das credenciais/JWT recebidas via middleware de segurança Ktor (`call.extractSankhyaSession(jwtProvider)`).
- **Desconectar Negócio Logístico do Frontend**: Isolar a aplicação SvelteKit de regras de comunicação de baixo nível com o Sankhya gateway (como codificação ISO-8859-1/Windows-1252 e payloads XML/JSON legados do `mgewms`).

## Histórias de Usuário

- **Como conferente no checkout**, quero informar o código do checkout (ex: "02.904.258") ou número de conferência para buscar e iniciar a tarefa de conferência de saída atribuída a mim.
- **Como conferente**, quero que o sistema recupere automaticamente conferências pendentes ou em aberto associadas ao meu usuário para continuar o trabalho sem interrupções.
- **Como conferente**, quero bipar os códigos de barras dos produtos para validar se correspondem ao pedido, registrando as quantidades e identificando divergências ou avarias.
- **Como conferente**, quero poder recontar um item específico ou solicitar a limpeza dos lançamentos conferidos em caso de erro de bipagem.
- **Como conferente**, quero finalizar a conferência, registrar a quantidade de volumes gerados e enviar as caixas para a doca de expedição correspondente.
- **Como conferente**, quero solicitar a impressão das etiquetas de volumes diretamente após a conferência para identificar as caixas fisicamente.
- **Como supervisor**, quero poder cancelar uma conferência em andamento para liberar os produtos ou reencaminhar o pedido.

## Funcionalidades Principais

### 1. Busca e Início de Tarefa de Conferência
- **O que faz**: Localiza a conferência de expedição associada ao checkout/número e agenda/inicia a tarefa no WMS Sankhya.
- **Por que é importante**: Valida a disponibilidade da carga e vincula o usuário conferente à tarefa no ERP.
- **Requisitos funcionais**:
  1. `RF-01`: Endpoint HTTP POST (`/api/v1/conferencia/search`) para buscar a separação/conferência informando `checkout` ou `nroConferencia`.
  2. `RF-02`: Endpoint HTTP POST (`/api/v1/conferencia/iniciar`) para invocar o serviço Sankhya `MgeWmsSP.buscaConferenciaPorPedido` vinculando o ID do usuário autenticado.

### 2. Recuperação de Tarefas Pendentes
- **O que faz**: Consulta tarefas de conferência não finalizadas associadas ao usuário logado.
- **Por que é importante**: Evita duplicação de tarefas e permite retoma de trabalho após desconexão.
- **Requisitos funcionais**:
  3. `RF-03`: Endpoint HTTP GET (`/api/v1/conferencia/pendentes`) para listar conferências em aberto chamando `MgeWmsSP.buscarTarefasColetor`.

### 3. Leitura e Bipagem de Produtos (Registro de Item)
- **O que faz**: Processa a validação de código de barras e o registro incremental ou direto de itens conferidos.
- **Por que é importante**: Core operation do processo de conferência física de caixa/embalagem.
- **Requisitos funcionais**:
  4. `RF-04`: Endpoint HTTP POST (`/api/v1/conferencia/info`) para obter detalhes do produto via `MgeWmsSP.obtemDescricaoProduto` a partir do código de barras lido.
  5. `RF-05`: Endpoint HTTP POST (`/api/v1/conferencia/registrar`) para gravar o item conferido no ERP via `MgeWmsSP.insereItemConferidoColetor`.
  6. `RF-06`: Endpoint HTTP POST (`/api/v1/conferencia/itens`) para consultar os itens e quantidades totais exigidas para a conferência.
  7. `RF-07`: Endpoint HTTP POST (`/api/v1/conferencia/itens/saldo`) para atualizar o saldo conferido e sequências atreladas a um produto ou código de barras.

### 4. Recontagem e Remoção de Itens
- **O que faz**: Zera ou remove itens bipados incorretamente.
- **Por que é importante**: Correção de erros humanos durante a conferência física sem necessidade de refazer toda a carga.
- **Requisitos funcionais**:
  8. `RF-08`: Endpoint HTTP POST (`/api/v1/conferencia/remover-itens`) para executar `MgeWmsSP.limpaConferenciaColetor` (para limpeza geral) ou exclusão por sequências.

### 5. Encerramento, Volumes e Envio para Doca
- **O que faz**: Finaliza a validação, gera volumes, envia para a doca de expedição e dispara a impressão de etiquetas.
- **Por que é importante**: Etapa de transição final da mercadoria conferida para o transporte.
- **Requisitos funcionais**:
  9. `RF-09`: Endpoint HTTP POST (`/api/v1/conferencia/finalizar`) para executar `MgeWmsSP.produtosConferidos` e verificar pendências/divergências.
  10. `RF-10`: Endpoint HTTP POST (`/api/v1/conferencia/volumes`) para registrar a quantidade de volumes gerados via `MgeWmsSP.registraEtiquetasVolume`.
  11. `RF-11`: Endpoint HTTP POST (`/api/v1/conferencia/volumes/imprimir`) para retornar o documento HTML ou comando de impressão de etiquetas de volume.
  12. `RF-12`: Endpoint HTTP POST (`/api/v1/conferencia/doca`) para vincular a conferência finalizada à doca de saída via `MgeWmsSP.liberaCheckoutDoca`.

### 6. Cancelamento da Conferência
- **O que faz**: Aborta a tarefa de conferência atual no ERP.
- **Por que é importante**: Permite desfazer o processo de conferência travado ou incorreto.
- **Requisitos funcionais**:
  13. `RF-13`: Endpoint HTTP POST (`/api/v1/conferencia/cancelar`) para invocar `MgeWmsSP.cancelaTarefa`.

## Experiência do Usuário

- **Consistência de Respostas**: O frontend consumirá diretamente retornos padronizados REST do Ktor com códigos de status HTTP claros.
- **Resiliência e Erros**: Mensagens de erro retornadas pelos serviços Sankhya (ex: código de barras inválido, quantidade excedida, conferência travada por outro usuário) serão formatadas no Ktor com título e mensagem detalhada em formato JSON amigável (`{ "title": "...", "message": "..." }`).

## Restrições Técnicas de Alto Nível

- **Stack Ktor**: Desenvolvido no módulo `backend/` usando Kotlin 2.x, Ktor Server 3.x e Kotlinx Serialization.
- **Arquitetura de Código**: Package-by-Feature no pacote `com.snk.conferencia.features.conferencia` (com contatos `ConferenciaRoutes.kt`, `ConferenciaService.kt` e DTOs dedicados).
- **Segurança**:
  - Todas as rotas protegidas por autenticação JWT e extração de `SankhyaSession`.
  - Tratamento seguro de logs evitando exposição de credenciais ou dados sensíveis nos filtros Ktor (segundo regra `kotlin-ktor-security.md`).
- **Codificação de Caracteres**: Decodificação e conversão adequada da codificação de caracteres dos serviços Sankhya WMS (`windows-1252`/`ISO-8859-1` para `UTF-8`).

## Fora de Escopo

- Redesenho visual ou alteração de componentes da interface Svelte (`src/routes/expedicao/components/conferencia/*`).
- Adaptação das chamadas do estado Svelte (`conferenciaState`), que será realizada em uma etapa posterior dedicada ao frontend.
- Modificações em stored procedures ou rotinas internas de banco de dados do ERP Sankhya.
