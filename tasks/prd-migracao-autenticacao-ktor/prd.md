# Documento de Requisitos de Produto (PRD) - Migração da API de Autenticação para Ktor

## Visão Geral

Este documento especifica os requisitos para a migração da camada de API de Autenticação, atualmente integrada no SvelteKit, para um backend independente e desacoplado desenvolvido em Kotlin com o framework Ktor.

A nova API REST em Ktor será responsável por centralizar a regra de negócio de autenticação e a comunicação com o ERP Sankhya (serviço `MobileLoginSP.login`), atendendo às necessidades do sistema de conferência de expedição (`snk-conferencia`) e permitindo o consumo desacoplado por interfaces frontend futuras (web ou mobile).

## Objetivos

- **Centralização da Regra de Negócio:** Unificar os fluxos de login, logout e validação de sessão em um serviço backend robusto em Kotlin/Ktor.
- **Desacoplamento de Arquitetura:** Separar as responsabilidades do frontend (apresentação) do backend (integrações de infraestrutura e ERP).
- **Segurança e Conformidade:** Aplicar diretrizes rigorosas de segurança (tratamento seguro de erros via `StatusPages`, sanitização de logs, headers de segurança HTTP).
- **Métricas Principais de Sucesso:**
  - Tempo médio de resposta do endpoint de login $\le 500\text{ms}$ (desconsiderando a latência do gateway externo Sankhya).
  - 100% de cobertura de tratamento de exceções de conexão e respostas malformadas do Sankhya.

## Histórias de Usuário

- **Como operador de expedição**, eu quero me autenticar informando meu nome de usuário, senha e servidor (Produção ou Treinamento), para que eu possa acessar com segurança os módulos do sistema.
- **Como sistema cliente (Frontend)**, eu quero consultar o endpoint de validação de sessão enviando as credenciais de acesso, para determinar se o usuário continua autenticado e pode acessar rotas protegidas.
- **Como usuário do sistema**, eu quero poder encerrar minha sessão a qualquer momento (Logout), para garantir que minhas credenciais e acesso sejam invalidados com segurança.

## Funcionalidades Principais

### 1. Autenticação de Usuário (Login)
- **O que faz:** Recebe as credenciais do usuário e o servidor de destino, repassando a autenticação para o ERP Sankhya via serviço `MobileLoginSP.login`.
- **Por que é importante:** É o ponto de entrada principal do sistema, validando se o usuário possui acesso válido ao ERP.
- **Como funciona em alto nível:** O endpoint REST recebe um payload JSON com usuário, senha e ambiente (`producao` ou `treinamento`). O Ktor dispara uma requisição HTTP POST para o Sankhya, decodifica a resposta (tratando encoding Windows-1252), e gera a estrutura de sessão contendo `jsessionid`, `idusu`, `nomeusu` e servidor.
- **Requisitos Funcionais:**
  1. **RF-01:** A API deve disponibilizar um endpoint REST POST para autenticação.
  2. **RF-02:** A API deve aceitar os parâmetros obrigatórios: `username` (String), `password` (String) e `server` (`producao` ou `treinamento`).
  3. **RF-03:** A API deve direcionar a requisição ao ambiente Sankhya correto com base no parâmetro `server` informado.
  4. **RF-04:** A API deve realizar a chamada ao serviço `MobileLoginSP.login` do Sankhya enviando o payload no formato esperado pelo ERP.
  5. **RF-05:** A API deve tratar adequadamente o encoding da resposta do Sankhya (Windows-1252) ao efetuar o parse do JSON.
  6. **RF-06:** Caso o Sankhya retorne status de erro (`status = "0"`), a API deve retornar HTTP 400/401 acompanhado de uma mensagem de erro tratada para o cliente.
  7. **RF-07:** Em caso de sucesso (`status = "1"`), a API deve retornar as informações necessárias da sessão (`jsessionid`, `idusu`, `nomeusu`, `server`).

### 2. Validação de Sessão (Check Session)
- **O que faz:** Revalida se o identificador de sessão informado permanece válido e ativo.
- **Por que é importante:** Permite que aplicações frontend determinem o estado de autenticação antes de renderizar páginas ou realizar chamadas protegidas.
- **Como funciona em alto nível:** O cliente envia os dados da sessão (via Cookie ou Header Authorization) e o Ktor valida a presença e validade dos dados.
- **Requisitos Funcionais:**
  8. **RF-08:** A API deve fornecer um endpoint GET/POST para checagem de integridade da sessão.
  9. **RF-09:** Se a sessão for válida, a API deve retornar HTTP 200 com os dados do usuário autenticado.
  10. **RF-10:** Se a sessão for inexistente ou inválida, a API deve retornar HTTP 401 (Não Autorizado).

### 3. Encerramento de Sessão (Logout)
- **O que faz:** Invalida a sessão ativa do usuário no backend.
- **Por que é importante:** Garante a revogação intencional de acessos.
- **Como funciona em alto nível:** O endpoint limpa os dados de sessão associados e retorna a confirmação de encerramento.
- **Requisitos Funcionais:**
  11. **RF-11:** A API deve disponibilizar um endpoint POST para encerramento de sessão (Logout).
  12. **RF-12:** A API deve responder com HTTP 200 e confirmação de logout efetuado com sucesso.

## Experiência do Usuário

- **Personas de Usuário:**
  - *Operador de Expedição:* Necessita de login rápido e mensagens de erro claras caso a senha esteja errada ou o servidor Sankhya esteja fora do ar.
  - *Desenvolvedor Frontend:* Necessita de respostas JSON padronizadas com códigos HTTP semânticos (200, 400, 401, 500).
- **Fluxos e Interações:**
  - A API opera em modo Headless (sem interface visual nesta etapa).
- **Requisitos de UI/UX:**
  - N/A para esta fase (construção exclusiva da API REST).
- **Requisitos de Acessibilidade:**
  - Mensagens de erro de validação e autenticação estruturadas em formato JSON limpo, facilitando a interpretação e exibição por leitores de tela em futuras interfaces web/mobile.

## Restrições Técnicas de Alto Nível

- **Linguagem e Framework:** Desenvolvimento obrigatório em **Kotlin** com **Ktor Framework**.
- **Segurança:**
  - Obras de código devem seguir as diretrizes estabelecidas em `.agents/rules/kotlin-ktor-security.md`.
  - Proibição de exposição de segredos ou senhas hardcoded no código ou logs.
  - Obras de log devem sanitizar informações sensíveis (headers de autorização, senhas).
  - Respostas de erro não devem expor stack traces ou detalhes internos da infraestrutura (uso de `StatusPages`).
- **Integrações Externas:**
  - Interface obrigatória com a API do ERP Sankhya no endpoint `https://{hostname}/mge/service.sbr?serviceName=MobileLoginSP.login`.
- **Protocolos e Formatos:**
  - Comunicação via HTTPS com payloads JSON (Content-Type: `application/json;charset=UTF-8`).

## Fora de Escopo

- Criação ou alteração de componentes visuais, telas de login ou layouts HTML/CSS/Svelte.
- Gestão de cadastro de usuários, recuperação de senha ou edição de perfis.
- Gestão granular de permissões e controle de acesso a tabelas específicas do ERP Sankhya.
- Alteração ou customização nos serviços nativos do ERP Sankhya.
