# Tarefa 3.0: Cliente HTTP de Integração com ERP Sankhya (`SankhyaAuthClient`)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar a classe `SankhyaAuthClient` responsável por realizar a requisição HTTP POST para o endpoint `MobileLoginSP.login` do ERP Sankhya, lidando com seleção dinâmica de ambiente (Produção vs Treinamento), parse do JSON retornado e tratamento de exceções de rede.

<requirements>
- Comunicar-se com o endpoint `https://{hostname}/mge/service.sbr?serviceName=MobileLoginSP.login&outputType=json`.
- Enviar payload JSON contendo `NOMUSU`, `INTERNO` e `KEEPCONNECTED: "S"`.
- Tratar a leitura da resposta suportando encoding `Windows-1252` antes do parse JSON.
- Mapear a resposta: extrair `jsessionid`, decodificar `idusu` (Base64 quando presente) e verificar o campo `status` ("1" = Sucesso, "0" = Erro).
- Aplicar timeouts curtos (5s conexão / 10s leitura) para proteger a aplicação contra travamentos.
</requirements>

## Subtarefas

- [x] 3.1 Criar DTOs de requisição e resposta do Sankhya (`SankhyaLoginRequestBody`, `SankhyaLoginResponseDto`).
- [x] 3.2 Implementar a classe `SankhyaAuthClient` utilizando o Ktor `HttpClient`.
- [x] 3.3 Adicionar lógica de seleção da URL do servidor Sankhya com base no parâmetro `server` ("producao" -> `SANKHYA_PROD_URL`, "treinamento" -> `SANKHYA_TREINA_URL`).
- [x] 3.4 Tratar exceções de desconexão, timeout e respostas de erro do Sankhya (`status = "0"`).

## Detalhes de Implementação

Consulte a seção **Design de Implementação -> Modelos de Dados** e **Pontos de Integração** em [`techspec.md`](file:///c:/Projetos/snk-conferencia/tasks/prd-migracao-autenticacao-ktor/techspec.md).

## Critérios de Sucesso

- O cliente envia a estrutura exata exigida pelo Sankhya e realiza o parse correto do `jsessionid` quando a resposta é de sucesso (`status: "1"`).
- Em caso de credenciais incorretas (`status: "0"`), o cliente dispara uma exceção tratada com a mensagem de erro retornada pelo Sankhya.
- Falhas de rede ou timeouts são capturados sem crashar o servidor Ktor.

## Testes da Tarefa

- [x] Testes de unidade: Simulação de resposta com sucesso usando Ktor `MockEngine`.
- [x] Testes de unidade: Simulação de erro de login (credenciais inválidas) com Ktor `MockEngine`.
- [x] Testes de unidade: Simulação de resposta com caractere especial codificado em `Windows-1252`.
- [x] Testes de unidade: Simulação de timeout na chamada HTTP.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `src/main/kotlin/com/snk/conferencia/auth/SankhyaAuthClient.kt`
- `src/main/kotlin/com/snk/conferencia/auth/SankhyaAuthDtos.kt`
- `src/test/kotlin/com/snk/conferencia/auth/SankhyaAuthClientTest.kt`
- `.agents/rules/sankhya-api.md`
- [`techspec.md`](file:///c:/Projetos/snk-conferencia/tasks/prd-migracao-autenticacao-ktor/techspec.md)
