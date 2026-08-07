---
trigger: always_on
---

# Regras de Segurança para Desenvolvimento Web com Kotlin e Ktor

Este documento define as diretrizes obrigatórias de segurança para o desenvolvimento de aplicações web e APIs REST utilizando Kotlin e Ktor Framework.

## 1. Gestão de Segredos e Credenciais
- **Nunca expor segredos no código:** Chaves privadas, tokens JWT, senhas, certificados e chaves de API jamais devem ser inseridos hardcoded no código ou commitados no Git.
- **Variáveis de Ambiente / Configuração:** Utilize `System.getenv(...)` ou o sistema de configuração HOCON/YAML do Ktor (`application.conf` / `application.yaml`) injetando variáveis de ambiente (ex: `jwt.secret = ${JWT_SECRET}`).
- **Sanitização de Logs:** Adicione filtros no mecanismo de logging (ex: Logback) para que dados sensíveis (headers `Authorization`, campos `password`, dados de cartão) não sejam gravados em logs.

## 2. Prevenção contra SQL Injection
- **Uso de Prepared Statements / ORM:** Nunca concatene strings para construir queries SQL dinâmicas. Utilize frameworks como **Exposed** (DSL ou DAO), **jOOQ** ou **Ktorm** que utilizam Prepared Statements nativamente.
  - *Exemplo Incorreto:* `exec("SELECT * FROM usuarios WHERE email = '" + input + "'")`
  - *Exemplo Correto (Exposed):* `UsuariosTable.select { UsuariosTable.email eq input }`
- **Queries Nativas/Parâmetros:** Ao executar SQL nativo, utilize bind parameters (`?` ou `:param`).
- **Validação de Inputs Dinâmicos:** Se for necessário ordenar ou filtrar colunas dinamicamente, valide o nome do campo contra uma lista estática de colunas permitidas (*whitelist*).

## 3. Prevenção contra Cross-Site Scripting (XSS)
- **Escape de Saídas:** Todo dado inserido dinamicamente no HTML deve ser devidamente escapado. O HTML DSL do Ktor escapa strings por padrão, mas evite usar construtores raw não sanitizados.
- **Headers HTTP de Segurança:** Configure headers de proteção globalmente na aplicação via Ktor (usando `DefaultHeaders` ou interceptores):
  - `Content-Security-Policy` (CSP estrito restringindo origens de scripts e recursos).
  - `X-Content-Type-Options: nosniff`.
  - `X-Frame-Options: DENY` (evita Clickjacking).
  - `Referrer-Policy: strict-origin-when-cross-origin`.
- **Sanitização de Input:** Sanitizar e validar entradas de texto de usuários antes de persistir ou reexibir.

## 4. Autenticação e Autorização Seguras
- **Ktor Authentication Plugin:** Utilize o plugin `install(Authentication)` com provedores validados (JWT, OAuth, Sessions).
- **Hash Seguro de Senhas:** Utilize algoritmos robustos de hash com sal como **Argon2id** ou **BCrypt**. Nunca utilize MD5, SHA-1 ou SHA-256 sem sal.
- **Proteção de Tokens JWT:**
  - Valide a assinatura do token, tempo de expiração (`exp`), emissor (`iss`) e audiência (`aud`).
  - Rejeite explicitamente tokens com algoritmo `none`.
  - Use chaves criptográficas fortes (mínimo de 256 bits para HMAC SHA-256).

## 5. Segurança de Sessões e Cookies
- **Flags de Cookies Obrigatórias:**
  - `httpOnly = true`: Impede acesso ao cookie via JavaScript no cliente (proteção contra XSS).
  - `secure = true`: Garante que o cookie só seja transmitido via HTTPS.
  - `extensions["SameSite"] = "Strict"` (ou `"Lax"`): Protege contra ataques CSRF.
- **Assinatura e Criptografia de Sessão:** Caso utilize cookies de sessão no Ktor, configure a assinatura/criptografia de sessão (`SessionTransportTransformerMessageAuthentication` / `SessionTransportTransformerEncrypt`).

## 6. Prevenção contra Cross-Site Request Forgery (CSRF)
- **Tokens Anti-CSRF:** Para endpoints que alteram estado (POST, PUT, DELETE, PATCH) autenticados por cookie, utilize tokens anti-CSRF validados no backend.
- **Verificação de Origem:** Valide os headers `Origin` e `Referer` em requisições de alteração de estado.

## 7. Configuração Segura de CORS (Cross-Origin Resource Sharing)
- **Restrição de Origens:** NUNCA utilize `anyHost()` ou wildcard `*` em ambientes de produção caso a aplicação utilize credenciais/cookies (`allowCredentials = true`).
- **Whitelist Explícita:** Declare explicitamente os domínios permitidos via `allowHost("app.meudominio.com", schemes = listOf("https"))`.
- **Princípio do Menor Privilégio:** Permita apenas os métodos HTTP (`allowMethod`) e headers (`allowHeader`) estritamente necessários.

## 8. Rate Limiting e Proteção contra Negação de Serviço (DoS)
- **Plugin Rate Limit:** Instale o plugin `install(RateLimit)` do Ktor para proteger endpoints sensíveis (login, reset de senha, APIs públicas) contra força bruta e DoS.
- **Limite no Tamanho do Payload:** Defina limites para o tamanho máximo das requisições (ex: `Content-Length`) e uploads para evitar esgotamento de memória (OOM).

## 9. Tratamento Seguro de Erros e Logs (StatusPages)
- **Mascaramento de Detalhes Internos:** Utilize o plugin `install(StatusPages)` do Ktor para capturar exceções não tratadas.
- **Não Expor Stack Traces:** NUNCA retorne stack traces de exceções, queries de banco de dados ou detalhes da infraestrutura no corpo de respostas de erro enviadas ao cliente.
- **Respostas de Erro Padronizadas:** Retorne respostas JSON limpas e padronizadas com códigos de status HTTP apropriados (400, 401, 403, 404, 500).

## 10. Criptografia em Trânsito (HTTPS / TLS)
- **HTTPS Obrigatório:** Garanta o uso exclusivo de HTTPS em produção.
- **HSTS (HTTP Strict Transport Security):** Configure o header `Strict-Transport-Security: max-age=31536000; includeSubDomains` para forçar navegadores a usarem apenas HTTPS.
