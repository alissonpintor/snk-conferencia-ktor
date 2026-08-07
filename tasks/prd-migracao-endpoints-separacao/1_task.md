# Tarefa 1.0: Infraestrutura do Cliente HTTP Sankhya Gateway (`shared/sankhya/`)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar a abstração e implementação do cliente HTTP `SankhyaClient` em Kotlin/Ktor para realizar chamadas ao gateway ERP Sankhya (`POST /mge/service.sbr`), gerenciando autenticação (`jsessionid`), injeção de payloads XML/JSON e tratamento de respostas de erro do gateway.

<requirements>
- Respeitar as diretrizes de integração documentadas em `.agents/rules/sankhya-api.md`.
- Encapsular a comunicação HTTP utilizando o Ktor HttpClient.
- Suportar o envio dos serviços `MobileLoginSP.login`, `DbExplorerSP.executeQuery` e `CRUDServiceProvider.saveRecord`.
- Capturar erros de negócio do gateway Sankhya (`status = 0`) e convertê-los na exceção `SankhyaBusinessException`.
- Garantir a sanitização de logs impedindo a exibição de senhas ou tokens sensíveis nos logs.
</requirements>

## Subtarefas

- [ ] 1.1 Criar a classe `SankhyaClient.kt` em `backend/src/main/kotlin/com/snk/conferencia/shared/sankhya/`.
- [ ] 1.2 Implementar métodos para montagem do payload JSON padrão (`serviceName`, `requestBody`).
- [ ] 1.3 Implementar a passagem do parâmetro `jsessionid` nas requisições autenticadas.
- [ ] 1.4 Criar a exceção de domínio `SankhyaBusinessException.kt`.
- [ ] 1.5 Criar os testes unitários da classe `SankhyaClientTest.kt` utilizando `MockEngine` do Ktor HTTP Client.

## Detalhes de Implementação

Consulte as seções **Resumo Executivo** e **Pontos de Integração** no arquivo `techspec.md`. O cliente deve utilizar o Ktor HTTP Client e Kotlinx Serialization para serializar e desserializar requisições do gateway Sankhya.

## Critérios de Sucesso

- Requisições ao gateway Sankhya serializam e desserializam payloads no formato padronizado.
- Erros retornados pelo ERP (`status = 0`) lançam `SankhyaBusinessException` contendo o `statusMessage`.
- Nenhuma senha ou token é impresso em logs de texto simples.
- Testes unitários com `MockEngine` passam com 100% de sucesso.

## Testes da Tarefa

- [ ] Testes de unidade em `SankhyaClientTest.kt` cobrindo chamadas com sucesso (`status = 1`) e falha (`status = 0`).
- [ ] Teste de injeção e repasse do `jsessionid`.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `backend/src/main/kotlin/com/snk/conferencia/shared/sankhya/SankhyaClient.kt`
- `backend/src/main/kotlin/com/snk/conferencia/shared/sankhya/SankhyaBusinessException.kt`
- `backend/src/test/kotlin/com/snk/conferencia/shared/sankhya/SankhyaClientTest.kt`
- `tasks/prd-migracao-endpoints-separacao/techspec.md`
