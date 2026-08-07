# PRD: Migração da API de Recontagem para Ktor Backend

## Visão Geral

Este documento define os requisitos para a migração da API do módulo de **Recontagem** (atualmente implementada nas rotas do SvelteKit em `src/routes/api/recontagem`) para o backend em Kotlin com **Ktor Framework** (`backend/`).

A migração visa centralizar a comunicação com o ERP Sankhya (serviço WMS `mgewms/service.sbr`) no backend Ktor, garantindo maior desempenho, tipagem forte, padronização de segurança (JWT), tratamento centralizado de erros e consistência com a arquitetura já adotada nas features de Conferência e Separação.

## Objetivos

- **Objetivos Primários:**
  - Migrar os 6 endpoints da API de Recontagem do frontend SvelteKit para o backend Ktor (`/api/v1/recontagem`).
  - Encapsular a comunicação com o gateway Sankhya WMS (`MgeWmsSP.recontagemDoca`, `MgeWmsSP.proximaRecontagem`, `MgeWmsSP.buscaInfoProduto`, `MgeWmsSP.envioRecontagem`, `MgeWmsSP.rejeitaTarefa`, `MgeWmsSP.buscaInfoRecontagem`) na camada de serviço Kotlin (`RecontagemService`).
  - Padronizar autenticação e extração de sessão Sankhya usando o mecanismo JWT e `extractSankhyaSession` já implementados na aplicação Ktor.
  - Implementar o tratamento gracioso da regra de negócio `WMS_E00299` (fim dos itens de recontagem) no backend Ktor.

- **Métricas Principais / Critérios de Sucesso:**
  - 100% dos 6 endpoints de recontagem migrados para Ktor com cobertura de testes unitários e de integração (mínimo de 80%).
  - Zero dependência de endpoints SvelteKit da pasta `src/routes/api/recontagem` após a migração.
  - Documentação OpenAPI/Swagger atualizada cobrindo todas as rotas do novo módulo de recontagem.

## Histórias de Usuário

- **HU-01 (Conferente/Operador WMS):** Como conferente WMS no checkout, eu quero iniciar o processo de recontagem informando o identificador do checkout para carregar a tarefa de recontagem vinculada.
- **HU-02 (Conferente/Operador WMS):** Como conferente WMS, eu quero consultar sequencialmente o próximo item pendente de recontagem para poder bipar o produto correto na doca/checkout.
- **HU-03 (Conferente/Operador WMS):** Como conferente WMS, eu quero bipar o código de barras e informar a quantidade conferida para validar as informações do produto e registrar o envio da recontagem.
- **HU-04 (Conferente/Operador WMS):** Como conferente WMS, eu quero cancelar uma tarefa de recontagem em andamento para liberar o checkout ou reiniciar o processo se necessário.
- **HU-05 (Conferente/Operador WMS):** Como conferente WMS, eu quero receber uma sinalização clara quando todos os itens de recontagem forem concluídos (`WMS_E00299`), permitindo avançar para as etapas de etiquetagem/doca.

## Funcionalidades Principais

### 1. Iniciar Recontagem (`POST /api/v1/recontagem/iniciar`)
- **Descrição:** Inicia o processo de recontagem para um checkout/endereço informado.
- **Serviço ERP:** Consome `MgeWmsSP.recontagemDoca`.
- **Importância:** Ponto de entrada para o fluxo de recontagem no terminal móvel.
- **Requisitos Funcionais:**
  - RF-01.1: O endpoint deve validar a presença obrigatória do parâmetro `checkout`.
  - RF-01.2: Deve enviar a requisição ao Sankhya codificando o ID do usuário autenticado em Base64 no nó `<idusu>`.
  - RF-01.3: Deve mapear os campos da resposta Sankhya (`NUCONFERENCIA`, `NUTAREFA`, `NUNOTA`, `NUMNOTA`, `ORDEMCARGA`, `CODEND`, `CODUSU`, `NOMEUSU`, `TIPCONF`) para o DTO `RecontagemResponse`.

### 2. Buscar Próxima Recontagem (`POST /api/v1/recontagem/proxima`)
- **Descrição:** Busca o próximo item pendente para a tarefa de recontagem ativa.
- **Serviço ERP:** Consome `MgeWmsSP.proximaRecontagem`.
- **Importância:** Permite a navegação guiada item a item durante a recontagem.
- **Requisitos Funcionais:**
  - RF-02.1: O endpoint deve exigir `nroConferencia`, `nroTarefa` e `codigoEndereco`.
  - RF-02.2: Deve tratar o código de erro Sankhya `WMS_E00299` (indicação de que não há mais itens pendentes) retornando um payload de sucesso com objeto `data: null`.
  - RF-02.3: Caso existam itens pendentes, deve mapear o retorno em um `ItemRecontagemResponse` contendo os dados do produto, código de barras, controle e tipo de recebimento.

### 3. Buscar Informações do Produto (`POST /api/v1/recontagem/info-produto`)
- **Descrição:** Consulta dados detalhados do produto com base no código de barras e quantidade bipada.
- **Serviço ERP:** Consome `MgeWmsSP.buscaInfoProduto`.
- **Importância:** Valida se o produto bipado corresponde à recontagem solicitada antes da confirmação.
- **Requisitos Funcionais:**
  - RF-03.1: Exigir `nroConferencia`, `codigoBarras` e `quantidade`.
  - RF-03.2: Retornar as informações estruturadas da linha do produto da entidade Sankhya WMS.

### 4. Enviar Recontagem de Item (`POST /api/v1/recontagem/enviar`)
- **Descrição:** Envia e confirma a contagem de um item específico.
- **Serviço ERP:** Consome `MgeWmsSP.envioRecontagem`.
- **Importância:** Registra a contagem efetuada no WMS Sankhya.
- **Requisitos Funcionais:**
  - RF-04.1: Exigir `nroConferencia`, `nroTarefa`, `codigoBarras`, `quantidade` e `sequencia`.
  - RF-04.2: Enviar ao Sankhya com os parâmetros padrão da aplicação (`FUNCAORECPECA: false`, `QTDPECAS: 0`, `TIPOREC: "NORMAL"`, `QTDAVARIA: 0`, `CONTROLE: " "`, `UTILIZAEXPLOTE: false`, `RECRIAVOLPOSREC: false`, `PRIMEIRARECONTAGEM: false`).
  - RF-04.3: Validar a mensagem contida no retorno; se `MENSAGEM != 'OK'`, deve lançar exceção de negócio contendo o texto da divergência.

### 5. Cancelar Recontagem (`POST /api/v1/recontagem/cancelar`)
- **Descrição:** Rejeita/cancela a tarefa de recontagem ativa.
- **Serviço ERP:** Consome `MgeWmsSP.rejeitaTarefa`.
- **Importância:** Permite ao operador desistir ou interromper a tarefa.
- **Requisitos Funcionais:**
  - RF-05.1: Exigir `nroTarefa` e `sequencia`.
  - RF-05.2: Enviar requisição de rejeição para a tarefa no Sankhya e retornar a confirmação do cancelamento.

### 6. Consultar Informações Gerais de Recontagem (`POST /api/v1/recontagem/info`)
- **Descrição:** Busca o status e resumo de recontagem atrelado a um checkout.
- **Serviço ERP:** Consome `MgeWmsSP.buscaInfoRecontagem`.
- **Importância:** Consulta auxiliar do estado do checkout.
- **Requisitos Funcionais:**
  - RF-06.1: Exigir o parâmetro `checkout`.
  - RF-06.2: Retornar o payload de status fornecido pelo Sankhya WMS.

## Experiência do Usuário

- **Transparência na Integração:** A migração para Ktor não altera a interface visual do app Svelte; o frontend apenas passa a chamar o novo serviço Ktor (`/api/v1/recontagem/*`).
- **Feedback de Erro Aprimorado:** Erros retornados pelo Sankhya WMS serão capturados pela `StatusPages` do Ktor e apresentados com mensagens claras no cliente.
- **Fluxo Sequencial Ininterrupto:** O tratamento automático do código `WMS_E00299` garante que a transição entre a recontagem de itens e o registro de volumes ocorra suavemente sem exibir falsos erros na tela.

## Restrições Técnicas de Alto Nível

- **Stack Tecnológica:** Kotlin + Ktor Framework 3.x, Gradle 9.6.1.
- **Padrão Arquitetural:** Seguir a arquitetura Package-by-Feature (`com.snk.conferencia.features.recontagem`), separando `RecontagemRoutes.kt`, `RecontagemService.kt`, `RecontagemServiceInterface.kt` e `RecontagemDTOs.kt`.
- **Segurança:**
  - Rotas protegidas via cabeçalho HTTP Bearer Token (JWT).
  - Recuperação da sessão Sankhya injetada com `call.extractSankhyaSession(jwtProvider)`.
  - Proibição de senhas ou tokens hardcoded no código.
- **Documentação:** Atualização obrigatória do arquivo `openapi/documentation.yaml` (Swagger) com os novos schemas e endpoints do módulo de recontagem.

## Fora de Escopo

- **Alterações de UI no Frontend Svelte:** Ajustes de layout, adição de novas telas ou alteração do fluxo do usuário não fazem parte deste PRD.
- **Endpoints de Separação/Conferência/Volumes:** As APIs `/api/separacao`, `/api/conferencia/volumes` e `/api/conferencia/doca` já possuem/terão tratativas em PRDs dedicados da feature de Conferência/Separação.
- **Alterações em Procedures do ERP Sankhya:** Nenhuma query SQL ou procedimento interno no banco de dados Sankhya será alterado neste escopo.
