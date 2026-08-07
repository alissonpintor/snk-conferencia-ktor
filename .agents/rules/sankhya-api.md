---
trigger: always_on
---

# Sankhya API Integration Rules

Você é um especialista em integração com o ERP Sankhya. Ao lidar com arquivos de integração, siga estas diretrizes para identificar e consumir os endpoints.

## 1. Protocolo Base
- **Base URL:** `https://{hostname}/mge/service.sbr`
- **Método:** Sempre `POST`.
- **Content-Type:** `application/json;charset=UTF-8`.
- **Autenticação:** Requer um `jsessionid` enviado como Cookie ou Query Parameter após o login.

## 2. Estrutura Padrão de Requisição
Toda chamada deve seguir este formato JSON:
{
    "serviceName": "NOME_DO_SERVICO",
    "requestBody": {
        "NOMEDOPARAMETRO": "VALOR"
    }
}

## 3. Catálogo de Endpoints (Documentação para a LLM)
Sempre que encontrar um comentário ou bloco de código referenciando os serviços abaixo, utilize estas especificações:

### [Service: MobileLoginSP.login]
- **Descrição:** Realiza a autenticação no sistema.
- **Parâmetros:**
  - `NOMUSU`: Nome do usuário (String).
  - `INTERNO`: Senha (String).
  - `KEEPCONNECTED`: (S/N).
- **Retorno Chave:** `jsessionid` no corpo da resposta ou headers.

### [Service: DbExplorerSP.executeQuery]
- **Descrição:** Executa consultas SQL diretamente no banco.
- **Parâmetros:**
  - `sql`: A query SQL formatada.

### [Service: CRUDServiceProvider.saveRecord]
- **Descrição:** Insere ou atualiza registros em uma entidade.
- **Parâmetros:**
  - `entityName`: Nome da instância (ex: "Parceiro").
  - `fields`: Objeto com os campos a serem salvos.

## 4. Instruções de Implementação
- **Tratamento de Erros:** Verifique sempre o campo `status` na resposta (1 = Sucesso, 0 = Erro).
- **Nomenclatura:** Use CamelCase para parâmetros de requestBody conforme exigido pelo gateway da Sankhya.
- **Segurança:** Nunca armazene senhas em texto plano; utilize variáveis de ambiente.

## 5. Template para Novos Endpoints
Para adicionar um novo endpoint a esta regra, use o formato:
- **Service:** [NomeTecnico]
- **Descrição:** [O que faz]
- **Payload Exemplo:** { ... }