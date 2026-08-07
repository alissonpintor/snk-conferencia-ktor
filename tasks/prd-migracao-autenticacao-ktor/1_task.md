# Tarefa 1.0: Configuração Base da Aplicação Ktor, Plugins e Segurança

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Inicializar a estrutura base da aplicação Ktor, incluindo o carregamento de configurações de ambiente, suporte a ContentNegotiation com Kotlinx Serialization, tratamento global de exceções via `StatusPages` e configuração de headers de segurança e CORS.

<requirements>
- Configurar `application.conf` para injetar variáveis `SANKHYA_PROD_URL`, `SANKHYA_TREINA_URL` e `JWT_SECRET`.
- Configurar o plugin `ContentNegotiation` com serializador JSON `kotlinx.serialization`.
- Configurar o plugin `StatusPages` para capturar exceções não tratadas e retornar respostas JSON limpas no formato `ErrorResponseDto` sem expor stack traces.
- Garantir a aplicação das diretrizes de segurança descritas em `.agents/rules/kotlin-ktor-security.md`.
</requirements>

## Subtarefas

- [x] 1.1 Configurar o arquivo `application.conf` com a estrutura HOCON lendo variáveis de ambiente com fallback para desenvolvimento local.
- [x] 1.2 Instalar e configurar o plugin `ContentNegotiation` com JSON estrito.
- [x] 1.3 Instalar e configurar o plugin `StatusPages` tratando `IllegalArgumentException`, `AuthenticationException` e `Throwable` genérico.
- [x] 1.4 Configurar o plugin `CORS` e `DefaultHeaders` seguindo as restrições de segurança do projeto.

## Detalhes de Implementação

Consulte a seção **Arquitetura do Sistema** e **Considerações Técnicas** em [`techspec.md`](file:///c:/Projetos/snk-conferencia/tasks/prd-migracao-autenticacao-ktor/techspec.md).

## Critérios de Sucesso

- Aplicação inicializa corretamente lendo todas as variáveis de ambiente sem erros.
- Qualquer exceção não capturada retorna HTTP Status adequado e um corpo JSON estritamente alinhado a `ErrorResponseDto`.
- Nenhuma stack trace é exposta na resposta HTTP.

## Testes da Tarefa

- [x] Testes de unidade: Testar carregamento de configurações e simulação de exceções no `StatusPages`.
- [x] Testes de integração: Testar rota de healthcheck ou inicialização do servidor com `testApplication`.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `src/main/resources/application.conf`
- `src/main/kotlin/com/snk/conferencia/plugins/StatusPages.kt`
- `src/main/kotlin/com/snk/conferencia/plugins/Serialization.kt`
- `.agents/rules/kotlin-ktor-security.md`
- [`techspec.md`](file:///c:/Projetos/snk-conferencia/tasks/prd-migracao-autenticacao-ktor/techspec.md)
