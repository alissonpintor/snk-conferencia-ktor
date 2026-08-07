# PRD: Migração dos Endpoints da Tela de Separações para Ktor

## Visão Geral

Migração de todos os endpoints REST consumidos pela interface de busca e gestão de separações da expedição (`src/routes/expedicao/components/separacoes`) da camada BFF (Backend-For-Frontend) em SvelteKit para o serviço backend dedicado em Kotlin/Ktor (`backend/`).

Esta migração centraliza a regra de integração com o ERP Sankhya no Ktor, garante o cumprimento das diretrizes de segurança (prevenção contra SQL Injection, validação de JWT, sanitização de logs) e padroniza os contratos de API no modelo REST.

## Objetivos

- Migrar 100% dos endpoints de busca, consulta de itens, gestão de volumes e ações de expedição (envio para doca, cancelamento) utilizados na tela de separações para o backend Ktor.
- Redefinir as respostas HTTP para os padrões REST nativos no Ktor (status HTTP semânticos 200, 201, 400, 401, 404, 500), descontinuando o formato legado wrapper `{ success: boolean, data: ..., error: [...] }`.
- Garantir segurança na construção de consultas SQL/filtros dinâmicos no Ktor através de parâmetros seguros e prepared statements (Exposed ORM ou Sankhya Gateway seguro).
- Isolar o frontend SvelteKit de integrações diretas e regras de negócio de expedição, mantendo-o estritamente focado em apresentação.

## Histórias de Usuário

- **Como conferente/operador de expedição**, quero filtrar a lista de separações por múltiplos parâmetros (empresa, parceiro, produto, período, número de separação, número único, ordem de carga e situação) para visualizar rapidamente o trabalho pendente ou em andamento.
- **Como conferente**, quero visualizar a lista de itens/produtos vinculados a uma separação específica para conferir a composição do pedido.
- **Como conferente**, quero consultar e gerar a quantidade de volumes de uma separação para viabilizar a identificação das embalagens na expedição.
- **Como conferente**, quero solicitar a impressão de etiquetas de volumes diretamente pela lista para identificação física das caixas.
- **Como conferente**, quero direcionar uma separação conferida para uma doca específica para liberar o carregamento do transporte.
- **Como supervisor de expedição**, quero cancelar uma conferência associada a uma separação para permitir o reprocessamento ou correção de divergências.

## Funcionalidades Principais

### 1. Consulta Filtrada de Separações
- **O que faz**: Permite consultar separações de expedição aplicando múltiplos filtros combinados.
- **Por que é importante**: É o ponto central de entrada da expedição para localização e acompanhamento de cargas.
- **Como funciona em alto nível**: Recebe os parâmetros de filtro e consulta o ERP via Ktor, retornando a lista paginada/filtrada de separações.
- **Requisitos funcionais**:
  1. `RF-01`: O sistema deve disponibilizar endpoint HTTP POST/GET no Ktor para buscar separações (`/api/v1/separacoes/search` ou `/api/v1/separacoes`).
  2. `RF-02`: O endpoint deve aceitar e aplicar de forma combinada os filtros: código da empresa (`empresa`), código do parceiro (`parceiro`), data inicial (`dataInicio`), data final (`dataFim`), número da separação (`nroSeparacao`), número único da nota (`nroUnico`), número do pedido (`nroPedido`), ordem de carga (`ordemCarga`), código do produto (`produto`) e lista de situações (`situacao`).
  3. `RF-03`: Exigir pelo menos um parâmetro de filtro preenchido na requisição para evitar varredura total desnecessária na base de dados.

### 2. Detalhamento dos Itens da Separação
- **O que faz**: Retorna os produtos pertencentes a uma tarefa de separação.
- **Por que é importante**: Permite ao usuário inspecionar o detalhamento dos produtos a serem expedidos.
- **Como funciona em alto nível**: Dado o identificador da separação, busca as linhas de produtos correspondentes no ERP.
- **Requisitos funcionais**:
  4. `RF-04`: O sistema deve disponibilizar endpoint HTTP GET (`/api/v1/separacoes/{nroSeparacao}/itens`) para listar os itens da separação.
  5. `RF-05`: O retorno deve incluir código do produto, descrição, unidade de medida, quantidade separada/pedida e referência do produto.

### 3. Gestão e Geração de Volumes
- **O que faz**: Permite consultar a quantidade calculada de volumes e disparar a geração oficial de volumes da separação.
- **Por que é importante**: Necessário para a correta cubagem e etiquetagem dos volumes expedidos.
- **Como funciona em alto nível**: Consulta os parâmetros de volumes da separação e executa o procedimento de criação de volumes no Sankhya.
- **Requisitos funcionais**:
  6. `RF-06`: O sistema deve disponibilizar endpoint HTTP GET (`/api/v1/separacoes/{nroSeparacao}/volumes/quantidade`) para obter a quantidade estimada/calculada de volumes.
  7. `RF-07`: O sistema deve disponibilizar endpoint HTTP POST (`/api/v1/separacoes/{nroSeparacao}/volumes`) para efetivar a geração dos volumes no backend.

### 4. Impressão de Etiquetas de Volumes
- **O que faz**: Envia comando para geração/impressão de etiquetas de volumes da conferência/separação.
- **Por que é importante**: Garante a identificação física das caixas/paletes durante o despacho.
- **Como funciona em alto nível**: Recebe o número único e número da separação e dispara a rotina de impressão no backend Ktor.
- **Requisitos funcionais**:
  8. `RF-08`: O sistema deve disponibilizar endpoint HTTP POST (`/api/v1/conferencia/volumes/imprimir`) para solicitar a impressão de etiquetas de volumes.

### 5. Envio de Separação/Conferência para a Doca
- **O que faz**: Associa a conferência/separação a uma doca de embarque.
- **Por que é importante**: Transiciona o processo logístico para a fase de carregamento.
- **Como funciona em alto nível**: Atualiza o status e a doca de destino da separação no ERP Sankhya.
- **Requisitos funcionais**:
  9. `RF-09`: O sistema deve disponibilizar endpoint HTTP POST (`/api/v1/conferencia/doca`) para vincular a separação à doca de expedição informada.

### 6. Cancelamento de Conferência
- **O que faz**: Aborta e limpa os registros de conferência associados à separação.
- **Por que é importante**: Permite ao operador/supervisor estornar uma conferência iniciada incorretamente.
- **Como funciona em alto nível**: Valida as permissões do usuário e altera o status da conferência no Sankhya para cancelada.
- **Requisitos funcionais**:
  10. `RF-10`: O sistema deve disponibilizar endpoint HTTP POST (`/api/v1/conferencia/cancelar`) para cancelar a conferência da separação.

### 7. Endpoints Auxiliares de Filtro (Autocomplete)
- **O que faz**: Fornece dados para a seleção de Empresa, Parceiro e Produto nas telas de busca.
- **Por que é importante**: Permite busca rápida via autocompletar na interface visual.
- **Como funciona em alto nível**: Pesquisa registros correspondentes no ERP com base em um termo de busca (`q`).
- **Requisitos funcionais**:
  11. `RF-11`: Endpoint HTTP GET (`/api/v1/empresas`) para listagem de empresas ativas.
  12. `RF-12`: Endpoint HTTP GET (`/api/v1/parceiros?q={busca}`) para autocompletar parceiros por código ou nome.
  13. `RF-13`: Endpoint HTTP GET (`/api/v1/produtos?q={busca}`) para autocompletar produtos por código, referência ou descrição.

## Experiência do Usuário

- **Fluxo da Interface**:
  1. O usuário acessa a tela de expedição e utiliza o painel de filtros laterais/superiores.
  2. O autocompletar de empresas, parceiros e produtos consulta os novos endpoints Ktor em tempo real.
  3. Ao clicar em "Aplicar", a tabela principal faz a requisição REST para o Ktor e exibe o estado de carregamento (*skeleton/spinner*).
  4. Na tabela de separações, o usuário pode expandir os itens da linha selecionada ou executar ações via menu de contexto (Gerar Volumes, Imprimir Volumes, Enviar para Doca, Cancelar Conferência).
- **Tratamento de Erros de UI**:
  - Respostas HTTP 4xx (como 400 Bad Request ou 404 Not Found) e 5xx (Internal Server Error) emitirão mensagens claras de erro via sistema de notificações/toasts do Svelte.
- **Requisitos de Acessibilidade**:
  - As mensagens de erro e estados de carregamento das chamadas REST devem ser comunicadas a leitores de tela via atributos ARIA (`aria-busy`, `aria-live`).

## Restrições Técnicas de Alto Nível

- **Framework Backend**: Implementação em Kotlin 2.x com Ktor Framework 3.x no diretório `backend/`.
- **Arquitetura Web**: Adoção da arquitetura Vertical Slicing / Package-by-Feature (conforme regra `ktor-web-architecture.md`).
- **Segurança e Autenticação**:
  - Proteção de todas as rotas com o plugin `install(Authentication)` e validação de JWT/Session no Ktor.
  - Sanitização obrigatória de parâmetros de consulta contra SQL Injection (uso de Prepared Statements com Exposed ORM ou queries parametrizadas).
- **Contratos HTTP REST**:
  - Retorno utilizando status HTTP padrão REST (200, 201, 400, 401, 404, 500) com DTOs JSON estruturados.
  - O SvelteKit deverá atualizar sua camada de estado e serviços (`$lib/states/separacao.svelte.ts`) para tratar as respostas conforme os status HTTP REST nativos do Ktor.
- **Desempenho**:
  - Latência de resposta da API de busca de separações inferior a 1,5 segundos para consultas com período delimitado.

## Fora de Escopo

- Redesenho visual das telas ou alteração do layout de componentes Svelte existentes em `src/routes/expedicao/components/separacoes`.
- Endpoints de conciliação de divergências e recontagem de estoque (serão tratados em PRDs dedicados).
- Alterações em regras de faturamento, emissão de nota fiscal ou rotinas de separação fora do escopo da conferência de expedição.
