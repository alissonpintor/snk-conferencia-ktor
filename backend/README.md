# Backend SNK Conferência - API REST Ktor

Serviço backend desacoplado desenvolvido em **Kotlin** com o framework **Ktor**, responsável por centralizar as regras de negócio de autenticação, expedição, separação de mercadorias, conferência e integração direta com o ERP Sankhya.

---

## 🚀 Tecnologias Utilizadas

- **Linguagem:** Kotlin 2.0 (JVM 17)
- **Framework Web:** Ktor 2.3.12 (Netty Engine)
- **Documentação de API:** Swagger UI / OpenAPI 3.0 (`/swagger`)
- **Segurança & Tokens:** JWT (`com.auth0:java-jwt`)
- **Serialização:** `kotlinx.serialization` (JSON)
- **Cliente HTTP:** Ktor HttpClient (Engine CIO)
- **Logging:** Logback com SLF4J
- **Testes:** JUnit 5, Ktor TestHost, MockK, Ktor Client MockEngine

---

## 📂 Estrutura do Projeto (Package-by-Feature)

```text
backend/
├── src/
│   ├── main/
│   │   ├── kotlin/com/snk/conferencia/
│   │   │   ├── Application.kt           # Classe principal e inicialização do módulo Ktor
│   │   │   ├── auth/                    # Módulo de Autenticação
│   │   │   │   ├── AuthDtos.kt          # DTOs de login e sessão
│   │   │   │   ├── AuthRouting.kt       # Endpoints REST (/api/v1/auth)
│   │   │   │   ├── AuthService.kt       # Negócio e orquestração de sessão
│   │   │   │   ├── JwtProvider.kt       # Emissão e validação de tokens JWT
│   │   │   │   └── SankhyaAuthClient.kt # Cliente HTTP de autenticação Sankhya
│   │   │   ├── features/                # Fatias Verticais de Funcionalidades (Package-by-Feature)
│   │   │   │   ├── lookup/              # Autocompletar de Empresas, Parceiros e Produtos
│   │   │   │   │   ├── LookupDTOs.kt
│   │   │   │   │   ├── LookupService.kt
│   │   │   │   │   └── LookupRoutes.kt  # Endpoints (/api/v1/empresas, /parceiros, /produtos)
│   │   │   │   ├── separacao/           # Consulta de Separações, Itens e Volumes
│   │   │   │   │   ├── SeparacaoDTOs.kt
│   │   │   │   │   ├── SeparacaoService.kt
│   │   │   │   │   └── SeparacaoRoutes.kt# Endpoints (/api/v1/separacoes/...)
│   │   │   │   └── conferencia/         # Ações de Conferência e Expedição
│   │   │   │       ├── ConferenciaDTOs.kt
│   │   │   │       ├── ConferenciaService.kt
│   │   │   │       └── ConferenciaRoutes.kt # Endpoints (/api/v1/conferencia/...)
│   │   │   ├── shared/                  # Componentes Compartilhados de Infraestrutura
│   │   │   │   └── sankhya/             # Cliente HTTP Sankhya Gateway Generico
│   │   │   │       ├── SankhyaClient.kt
│   │   │   │       └── SankhyaBusinessException.kt
│   │   │   └── plugins/                 # Plugins e Configurações Globais Ktor
│   │   │       ├── Routing.kt           # Registro centralizado de rotas
│   │   │       ├── Security.kt          # Headers HTTP e politicas CORS
│   │   │       ├── Serialization.kt     # ContentNegotiation JSON
│   │   │       └── StatusPages.kt       # Tratamento global de erros HTTP REST
│   │   └── resources/
│   │       ├── application.conf         # Configurações HOCON e variáveis de ambiente
│   │       ├── logback.xml              # Configuração de logs estruturados
│   │       └── openapi/
│   │           └── documentation.yaml   # Especificação OpenAPI 3.0 do Swagger
│   └── test/                            # Suíte completa de testes unitários e de rotas
│       └── kotlin/com/snk/conferencia/
│           ├── auth/                    # Testes do módulo Auth
│           ├── features/                # Testes dos módulos Lookup, Separação e Conferência
│           ├── shared/                  # Testes do SankhyaClient
│           └── plugins/                 # Testes de integração de middleware e StatusPages
├── build.gradle.kts                     # Configuração de dependências e build Gradle
├── settings.gradle.kts                  # Configuração do projeto Gradle
└── README.md
```

---

## ⚙️ Variáveis de Ambiente

As configurações são injetadas a partir de variáveis de ambiente no arquivo [`application.conf`](file:///c:/Projetos/snk-conferencia/backend/src/main/resources/application.conf) ou via arquivo `.env` na raiz do projeto:

| Variável | Descrição | Valor Padrão / Exemplo |
| :--- | :--- | :--- |
| `PORT` | Porta de execução do servidor HTTP | `8080` |
| `SANKHYA_PROD_URL` / `PROD_URL` | URL base do ambiente Sankhya de Produção | `https://sankhya.stoky.com.br` |
| `SANKHYA_TREINA_URL` / `TREINA_URL` | URL base do ambiente Sankhya de Treinamento | `https://teste.stoky.com.br` |
| `JWT_SECRET` | Chave secreta para assinatura dos tokens JWT | *Segredo interno configurável* |

---

## 🛠️ Como Executar a Aplicação

### Pré-requisitos
- **Java Development Kit (JDK) 17** ou superior instalado.
- Gradle instalado ou executável da ferramenta (`./gradlew`).

### 1. Iniciar o Servidor Ktor
No terminal, dentro da pasta `backend/`, execute:

```bash
./gradlew run
```

O servidor será iniciado na porta **8080** (ou na porta definida na variável `PORT`).

### 2. Acessar a Documentação Swagger UI
Com o servidor rodando, abra o navegador e acesse:
👉 **`http://localhost:8080/swagger`**

---

## 🧪 Como Executar os Testes

Para rodar toda a suíte de testes unitários e de integração de rotas (29+ testes):

```bash
./gradlew test
```

Para rodar forçando a re-execução de todas as tarefas de teste:

```bash
./gradlew test --rerun-tasks
```

Os relatórios HTML detalhados serão gerados em `backend/build/reports/tests/test/index.html`.

---

## 📌 Catálogo de Endpoints da API (`/api/v1`)

### 🔐 Autenticação (`/api/v1/auth`)
- `POST /api/v1/auth/login`: Realiza a autenticação no ERP Sankhya e gera token JWT.
- `GET /api/v1/auth/verify`: Revalida o token JWT ativo no header `Authorization`.
- `POST /api/v1/auth/logout`: Encerra a sessão do usuário.

### 🔍 Lookups / Autocompletar (`/api/v1`)
- `GET /api/v1/empresas`: Retorna a lista de empresas ativas (`TSIEMP`).
- `GET /api/v1/parceiros?q={termo}`: Autocompletar de parceiros de negócio (`TGFPAR`).
- `GET /api/v1/produtos?q={termo}`: Autocompletar de produtos (`TGFPRO`).

### 📦 Separação de Mercadorias (`/api/v1/separacoes`)
- `POST /api/v1/separacoes/search`: Consulta filtrada de tarefas de separação na View `APP_SEPARACAO` (exige ao menos 1 filtro).
- `GET /api/v1/separacoes/{nroSeparacao}/itens`: Lista os produtos e itens pertencentes à separação (`APP_ITENS_SEPARACAO`).
- `GET /api/v1/separacoes/{nroSeparacao}/volumes/quantidade`: Consulta a quantidade de volumes gerados (`TGWREV`).
- `POST /api/v1/separacoes/{nroSeparacao}/volumes`: Dispara o procedimento oficial de geração de etiquetas de volume (`MgeWmsSP.gerarEtiquetasVolume`).

### 🚢 Conferência e Expedição (`/api/v1/conferencia`)
- `POST /api/v1/conferencia/search`: Consulta tarefas de conferência por checkout ou número (`APP_SEPARACAO`).
- `POST /api/v1/conferencia/iniciar`: Inicia o processo de conferência no WMS por checkout (`MgeWmsSP.buscaConferenciaPorPedido`).
- `GET /api/v1/conferencia/pendentes`: Lista as tarefas de conferência em andamento do conferente (`APP_SEPARACAO`).
- `POST /api/v1/conferencia/itens`: Lista os produtos pertencentes a uma conferência (`APP_CONFERENCIA_ITENS`).
- `POST /api/v1/conferencia/info`: Obtém descrição e complementos do produto bipado (`MgeWmsSP.buscaInfoProduto`).
- `POST /api/v1/conferencia/registrar`: Registra a bipagem e contagem do item (`MgeWmsSP.insereItemConferidoColetor`).
- `POST /api/v1/conferencia/itens/saldo`: Consulta o saldo conferido e sequências gravadas (`APP_CONFERENCIA_ITENS_SALDO`).
- `POST /api/v1/conferencia/remover-itens`: Remove sequências conferidas para recontagem (`MgeWmsSP.removeItensConferidosColetor`).
- `POST /api/v1/conferencia/finalizar`: Encerra o processo de conferência validando divergências (`MgeWmsSP.produtosConferidos`).
- `POST /api/v1/conferencia/volumes`: Registra a quantidade de volumes gerados na conferência (`MgeWmsSP.registraEtiquetasVolume`).
- `POST /api/v1/conferencia/volumes/imprimir`: Gera documento HTML com cartões de etiquetas de volume (`TGWREV`).
- `POST /api/v1/conferencia/doca`: Libera o checkout e direciona a conferência para a doca (`MgeWmsSP.liberaCheckoutDoca`).
- `POST /api/v1/conferencia/cancelar`: Cancela a tarefa de conferência ativa (`MgeWmsSP.cancelaTarefa`).
