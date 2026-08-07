---
name: ktor-web-architecture
description: >
  Defines best-practice project structures and code organization for Ktor web applications.
  Optimized for LLM context windows (Gemini/Antigravity), minimizing token consumption by using 
  Package-by-Feature (vertical slicing), modular Ktor plugin initializers, type-safe routing, 
  and strict file size guardrails. Use when designing, creating, refactoring, or navigating 
  Kotlin Ktor backend services.
license: Apache-2.0
metadata:
  author: Antigravity Team
  version: "1.0.0"
---

# Ktor Web Architecture & LLM Context Optimization

Ao desenvolver aplicações Ktor, o custo de tokens e a precisão de LLMs (como o Gemini no Antigravity) dependem diretamente da organização das pastas e arquivos. Arquiteturas tradicionais divididas estritamente por camadas (`controllers/`, `services/`, `models/`, `dto/` em árvores separadas) forçam a LLM a abrir múltiplos arquivos espalhados em diretórios distantes para entender uma única funcionalidade, multiplicando o uso de tokens e a chance de alucinação.

Esta skill estabelece a estrutura de pastas e convenções ideais para **Ktor** que maximizam a eficiência do contexto da LLM e reduzem o consumo de tokens.

---

## 1. Princípio Fundamental: Package-by-Feature (Fatiamento Vertical)

Organize a aplicação por **Funcionalidades (Features)** em vez de **Camadas Técnicas**.

### ❌ Ineficiente para LLMs (Package-by-Layer)
```
com.example/
├── controllers/
│   ├── UserController.kt
│   └── OrderController.kt
├── services/
│   ├── UserService.kt
│   └── OrderService.kt
├── repositories/
│   ├── UserRepository.kt
│   └── OrderRepository.kt
├── dto/
│   ├── UserDTO.kt
│   └── OrderDTO.kt
```
*Problema:* Para alterar ou entender o fluxo de "Usuário", a LLM precisa ler 4 arquivos em 4 pastas totalmente distintas.

### ✅ Otimizado para LLMs (Package-by-Feature)
```
com.example/
├── Application.kt
├── plugins/
│   ├── Routing.kt
│   ├── Security.kt
│   ├── Serialization.kt
│   ├── Databases.kt
│   └── StatusPages.kt
├── features/
│   ├── user/
│   │   ├── UserRoutes.kt
│   │   ├── UserService.kt
│   │   ├── UserRepository.kt
│   │   └── UserDTOs.kt
│   └── order/
│       ├── OrderRoutes.kt
│       ├── OrderService.kt
│       ├── OrderRepository.kt
│       └── OrderDTOs.kt
└── shared/
    ├── database/
    └── errors/
```
*Vantagem:* A LLM precisa abrir apenas a pasta `features/user/` para ter 100% do contexto da funcionalidade. O consumo de tokens cai drasticamente.

---

## 2. Estrutura Padrão de Pastas Otimizada

```
src/main/kotlin/com/example/
├── Application.kt                   # Ponto de entrada leve (apenas inicialização)
├── plugins/                         # Módulos de configuração do Ktor
│   ├── Routing.kt                   # Registro centralizado de rotas
│   ├── Security.kt                  # JWT / Autenticação / Autorização
│   ├── Serialization.kt             # ContentNegotiation / Kotlinx Serialization
│   ├── Databases.kt                 # Conexão Exposed / Hikari / DB migrations
│   └── StatusPages.kt               # Tratamento global de exceções
├── features/                        # Módulos de negócio (Vertical Slicing)
│   └── [feature_name]/
│       ├── [Feature]Routes.kt       # Endpoints e manipuladores de rota Ktor
│       ├── [Feature]Service.kt      # Lógica de negócio e orquestração
│       ├── [Feature]Repository.kt   # Acesso a dados (Exposed/JPA/SQLDelight)
│       └── [Feature]DTOs.kt         # Todos os DTOs do módulo (Request/Response)
└── shared/                          # Código compartilhado transversal
    ├── domain/                      # Value Objects ou utilitários universais
    ├── database/                    # Helpers de banco de dados
    └── errors/                      # Exceções customizadas da aplicação
```

---

## 3. Diretrizes de Código para Economia de Tokens

### 3.1. DTOs Agrupados em Arquivo Único por Funcionalidade (`*DTOs.kt`)
Evite criar 5 a 10 arquivos minúsculos com 10 linhas cada (`CreateUserRequest.kt`, `UserResponse.kt`, `UpdateUserRequest.kt`). Em vez disso, agrupe todos os DTOs da funcionalidade em um único arquivo `UserDTOs.kt`.

```kotlin
// features/user/UserDTOs.kt
package com.example.features.user

import kotlinx.serialization.Serializable

@Serializable
data class CreateUserRequest(
    val name: String,
    val email: String
)

@Serializable
data class UserResponse(
    val id: String,
    val name: String,
    val email: String
)

@Serializable
data class UpdateUserRequest(
    val name: String? = null,
    val email: String? = null
)
```

### 3.2. Configuração de Plugins Leve e Modular (`plugins/`)
O `Application.kt` deve apenas invocar as funções de extensão dos plugins.

```kotlin
// Application.kt
package com.example

import com.example.plugins.*
import io.ktor.server.application.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    configureSerialization()
    configureDatabases()
    configureSecurity()
    configureStatusPages()
    configureRouting()
}
```

### 3.3. Rotas Limpas com Injeção de Serviços (`*Routes.kt`)
Organize as rotas como extensões da interface `Route` do Ktor, mantendo a camada de rota focada em validação HTTP e delegação para o serviço.

```kotlin
// features/user/UserRoutes.kt
package com.example.features.user

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.userRoutes(userService: UserService) {
    route("/api/users") {
        post {
            val request = call.receive<CreateUserRequest>()
            val response = userService.createUser(request)
            call.respond(HttpStatusCode.Created, response)
        }

        get("/{id}") {
            val id = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val user = userService.getUserById(id)
            call.respond(user)
        }
    }
}
```

### 3.4. Registro Centralizado de Rotas (`plugins/Routing.kt`)
Instancie dependências e registre as subrotas em `plugins/Routing.kt`:

```kotlin
// plugins/Routing.kt
package com.example.plugins

import com.example.features.user.*
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    val userRepository = UserRepository()
    val userService = UserService(userRepository)

    routing {
        userRoutes(userService)
        // Outras rotas registradas aqui
    }
}
```

### 3.5. Tratamento de Erros Global com `StatusPages`
Evite blocos ruidosos de `try-catch` em cada endpoint de rota. Centralize a conversão de exceções em respostas HTTP no plugin `StatusPages`.

```kotlin
// plugins/StatusPages.kt
package com.example.plugins

import com.example.shared.errors.NotFoundException
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*

fun Application.configureStatusPages() {
    install(StatusPages) {
        exception<NotFoundException> { call, cause ->
            call.respond(HttpStatusCode.NotFound, mapOf("error" to cause.message))
        }
        exception<IllegalArgumentException> { call, cause ->
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to cause.message))
        }
        exception<Throwable> { call, cause ->
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "Erro interno no servidor"))
        }
    }
}
```

---

## 4. Regras de Guardrail para Manutenção por LLM

- **Tamanho Máximo de Arquivo:** Mantenha os arquivos abaixo de **200 linhas de código**. Se um `[Feature]Service.kt` crescer demais, divida-o em casos de uso (`CreateUserUseCase.kt`, `GetUserUseCase.kt`).
- **Sem Dependências Circulares entre Features:** Cada funcionalidade em `features/` deve ser independente. Se duas funcionalidades precisam compartilhar entidades ou repositórios, coloque o código compartilhado em `shared/`.
- **Nomenclatura Previsível:** Siga sempre o sufixo da camada (`*Routes.kt`, `*Service.kt`, `*Repository.kt`, `*DTOs.kt`). A previsibilidade nos nomes permite que a LLM adivinhe e encontre arquivos instantaneamente via ferramentas de busca do Antigravity sem precisar listar todas as pastas.
- **Evite Estado Global Impuro:** Passe dependências de forma explícita nos construtores dos serviços/repositories ou via injeção leve (ex: Koin), permitindo testes isolados e raciocínio direto da LLM.

---

## 5. Resumo da Economia de Tokens

| Prática | Impacto em Tokens |
| :--- | :--- |
| **Package-by-Feature** | ⬇️ **60-80% menos tokens lidos**, pois todo o contexto da tarefa fica em 1 pasta. |
| **DTOs Agrupados em 1 Arquivo** | ⬇️ Elimina overhead de dezenas de imports, `package` headers e requisições de arquivos. |
| **Tratamento Global via StatusPages** | ⬇️ Remove boilerplate de `try-catch` repetido em dezenas de endpoints. |
| **Nomenclatura Padronizada** | ⬇️ Permite que a LLM use `view_file` direto sem precisar rodar buscas exploratórias de diretório. |
