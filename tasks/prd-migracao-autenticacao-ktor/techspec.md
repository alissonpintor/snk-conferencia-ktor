# Especificação Técnica - Migração da API de Autenticação para Ktor

## Resumo Executivo

Esta especificação técnica detalha a implementação da API REST de Autenticação utilizando Kotlin e Ktor Framework. O serviço atuará como um backend desacoplado que gerencia a comunicação com o ERP Sankhya (serviço `MobileLoginSP.login`), autentica credenciais de usuários e gera tokens JWT contendo as informações da sessão Sankhya (`jsessionid`, `idusu`, `nomeusu`, `server`). A arquitetura adota a estrutura Package-by-Feature, injeção de configurações via HOCON (`application.conf`), tratamento global de exceções via `StatusPages` e segurança reforçada contra vazamentos de dados.

## Arquitetura do Sistema

### Visão Geral dos Componentes

Componentes novos e modificados na solução:
- **AuthRouting (`com.snk.conferencia.auth.AuthRouting`):** Define e registra os endpoints HTTP `/api/v1/auth/login`, `/api/v1/auth/verify` e `/api/v1/auth/logout`.
- **AuthService (`com.snk.conferencia.auth.AuthService`):** Executa a lógica de orquestração do login, validação de credenciais e geração/validação de tokens JWT.
- **SankhyaAuthClient (`com.snk.conferencia.auth.SankhyaAuthClient`):** Cliente HTTP assíncrono (Ktor `HttpClient` com suporte a `cio` e `ContentNegotiation`) responsável pela comunicação com o endpoint `MobileLoginSP.login` do ERP Sankhya.
- **JwtProvider (`com.snk.conferencia.auth.JwtProvider`):** Utilitário de emissão e verificação de tokens JWT utilizando a biblioteca `com.auth0:java-jwt`.
- **StatusPagesPlugin (`com.snk.conferencia.plugins.StatusPages`):** Plugin de interceptação global de exceções para converter erros internos em respostas JSON amigáveis e padronizadas.

Visão geral do fluxo de dados:
`Cliente HTTP -> AuthRouting -> AuthService -> SankhyaAuthClient -> ERP Sankhya (MobileLoginSP.login) -> AuthService (Gera JWT) -> AuthRouting (HTTP 200 OK + JWT)`

## Design de Implementação

### Interfaces Principais

```kotlin
package com.snk.conferencia.auth

interface SankhyaAuthClientInterface {
    suspend fun login(credentials: AuthCredentialsDto): SankhyaLoginResponseDto
}

interface AuthServiceInterface {
    suspend fun authenticate(credentials: AuthCredentialsDto): TokenResponseDto
    fun verifyToken(token: String): UserSessionDto
}
```

### Modelos de Dados

```kotlin
package com.snk.conferencia.auth

import kotlinx.serialization.Serializable

@Serializable
data class AuthCredentialsDto(
    val username: String,
    val password: String,
    val server: String // "producao" ou "treinamento"
)

@Serializable
data class TokenResponseDto(
    val token: String,
    val tokenType: String = "Bearer",
    val expiresIn: Long,
    val user: UserSessionDto
)

@Serializable
data class UserSessionDto(
    val idusu: String,
    val username: String,
    val jsessionid: String,
    val server: String
)

@Serializable
data class ErrorResponseDto(
    val title: String,
    val message: String,
    val status: Int
)

@Serializable
data class SankhyaLoginRequestBody(
    val serviceName: String = "MobileLoginSP.login",
    val requestBody: SankhyaLoginParams
)

@Serializable
data class SankhyaLoginParams(
    val NOMUSU: Map<String, String>,
    val INTERNO: Map<String, String>,
    val KEEPCONNECTED: Map<String, String> = mapOf("$" to "S")
)
```

### Endpoints de API

1. `POST /api/v1/auth/login`
   - **Descrição:** Autentica o usuário no ERP Sankhya e retorna token JWT.
   - **Payload Requisição:** `AuthCredentialsDto`
   - **Payload Resposta Sucesso (200 OK):** `TokenResponseDto`
   - **Payload Resposta Erro (400 Bad Request / 401 Unauthorized):** `ErrorResponseDto`

2. `GET /api/v1/auth/verify`
   - **Descrição:** Valida a integridade do token JWT informado no cabeçalho `Authorization: Bearer <token>`.
   - **Payload Resposta Sucesso (200 OK):** `UserSessionDto`
   - **Payload Resposta Erro (401 Unauthorized):** `ErrorResponseDto`

3. `POST /api/v1/auth/logout`
   - **Descrição:** Encerra a sessão informada.
   - **Payload Resposta Sucesso (200 OK):** `{"message": "Sessão encerrada com sucesso"}`

## Pontos de Integração

- **Serviço Externo ERP Sankhya:**
  - Endpoint: `https://{hostname}/mge/service.sbr?serviceName=MobileLoginSP.login&outputType=json`
  - Método: `POST`
  - Encoding: O Ktor `HttpClient` tratará a leitura dos bytes da resposta decodificando `Windows-1252` quando aplicável antes do parse JSON.
  - Autenticação de Requisições Seguintes: O `jsessionid` obtido é injetado nos claims do JWT emitido pelo Ktor.
- **Tratamento de Falhas e Timeouts:**
  - Timeout de conexão configurado para 5000ms e timeout de socket para 10000ms no Ktor `HttpClient`.
  - Captura de exceções de IO (`ConnectException`, `SocketTimeoutException`) convertendo-as em erros de infraestrutura sem expor IP/StackTrace ao cliente.

## Abordagem de Testes

### Testes Unidade

- **Componentes Testados:** `AuthService`, `JwtProvider`, `SankhyaAuthClient`.
- **Mocks:** Uso da biblioteca `mockk` ou Ktor `MockEngine` para simular as respostas HTTP do Sankhya (sucesso com status "1", falha com status "0", JSON malformado e timeout de conexão).
- **Cenários Críticos:**
  - Emissão correta do JWT com claims `jsessionid`, `idusu`, `username` e `server`.
  - Rejeição de tokens expirados ou com assinatura manipulada.
  - Trativa de erro de login com credenciais inválidas.

### Testes de Integração

- **Componentes Testados:** Teste do fluxo REST completo utilizando o `testApplication` do Ktor (`io.ktor.server.testing`).
- **Massa de Teste:** MockEngine interceptando o endpoint do Sankhya e retornando payloads reais sanitizados.

### Testes de E2E

- **Ferramenta:** Não se aplica Playwright para testes de UI nesta etapa (API Headless). Testes de integração de API via coleção de testes HTTP (Ktor `testApplication` / Postman / Newman).

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Configurações e Plugins Iniciais:** Configurar `application.conf`, `StatusPages`, `ContentNegotiation` (Kotlinx Serialization) e suporte a CORS.
2. **Componente de Autenticação JWT (`JwtProvider`):** Implementar utilitário de geração e verificação de tokens JWT.
3. **Cliente Sankhya (`SankhyaAuthClient`):** Implementar o cliente HTTP e integração com `MobileLoginSP.login`.
4. **Serviço de Negócio (`AuthService`):** Orquestrar o fluxo de autenticação e validação de tokens.
5. **Endpoints e Rotas (`AuthRouting`):** Registrar as rotas HTTP e conectar aos serviços.
6. **Testes de Integração e Validação de Segurança:** Executar suite de testes unitários e de integração Ktor.

### Dependências Técnicas

- Variáveis de Ambiente requeridas no runtime:
  - `SANKHYA_PROD_URL`: URL base do ambiente de Produção.
  - `SANKHYA_TREINA_URL`: URL base do ambiente de Treinamento.
  - `JWT_SECRET`: Chave secreta de no mínimo 256 bits para assinatura HMAC256 dos tokens JWT.

## Monitoramento e Observabilidade

- **Métricas:** Exposição de métricas no formato Prometheus (`/metrics`) incluindo:
  - `http_requests_total{endpoint="/api/v1/auth/login", status="200|400|500"}`
  - `sankhya_api_latency_seconds_bucket`
- **Logs:** Logs estruturados em formato JSON utilizando Logback.
  - Sanitização obrigatória dos campos `password`, `authorization` e `token` antes de gravar no log.
  - Níveis de Log: `INFO` para autenticações efetuadas, `WARN` para tentativas inválidas de login, `ERROR` para indisponibilidade do ERP Sankhya.

## Considerações Técnicas

### Decisões Principais

- **Uso de Token JWT:** Escolhido para manter a API stateless e desacoplada, encapsulando a sessão do Sankhya (`jsessionid`) dentro de um token assinado com validade configurável.
- **Estrutura Package-by-Feature:** Agrupamento de todas as classes relacionadas à autenticação sob o pacote `com.snk.conferencia.auth` para reduzir acoplamento e acelerar manutenção.
- **Leitura Segura de Encodings:** Leitura explícita da resposta do Sankhya lidando com caracteres `Windows-1252`.

### Riscos Conhecidos

- **Indisponibilidade ou Lentidão do ERP Sankhya:** Mitigado através de timeouts curtos (5s connection / 10s read) no `HttpClient` e retornos de erro 503/504 apropriados.
- **Exposição acidental de tokens nos logs:** Mitigado com loggers sanitizados e proibições explícitas de print no console.

### Conformidade com Padrões

- **`.agents/rules/kotlin-ktor-security.md`:** Cumprido na íntegra (gestão de segredos via variáveis de ambiente, sanitização de logs, tratamento seguro de exceções via StatusPages, proibição de wildcard CORS com credenciais).
- **`.agents/rules/sankhya-api.md`:** Cumprido na íntegra (respeito aos nomes técnicos de serviço `MobileLoginSP.login`, parâmetros `NOMUSU`, `INTERNO`, `KEEPCONNECTED`).
- **`.agents/rules/project-structure.md`:** Organização de artefatos na pasta `tasks/prd-migracao-autenticacao-ktor/`.

### Arquivos relevantes e dependentes

- [`prd.md`](file:///c:/Projetos/snk-conferencia/tasks/prd-migracao-autenticacao-ktor/prd.md): Documento de requisitos base.
- [`kotlin-ktor-security.md`](file:///c:/Projetos/snk-conferencia/.agents/rules/kotlin-ktor-security.md): Regras obrigatórias de segurança.
- [`sankhya-api.md`](file:///c:/Projetos/snk-conferencia/.agents/rules/sankhya-api.md): Regras de integração com API Sankhya.
- [`auth.service.ts`](file:///c:/Projetos/snk-conferencia/src/lib/services/auth.service.ts): Implementação legada em TypeScript/SvelteKit usada como referência para payloads.
