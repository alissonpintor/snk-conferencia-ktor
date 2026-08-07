# Tarefa 2.0: Módulo de Lookups/Autocompletar de Filtros (`features/lookup/`)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar a fatia vertical `features/lookup/` no backend Ktor fornecendo os endpoints de autocompletar para Empresa, Parceiro e Produto, consumidos pelos seletores do painel de filtros da expedição.

<requirements>
- Seguir o padrão Package-by-Feature (conforme skill `ktor-web-architecture`).
- Implementar os endpoints:
  - `GET /api/v1/empresas`: Lista de empresas ativas.
  - `GET /api/v1/parceiros?q={termo}`: Autocompletar de parceiros.
  - `GET /api/v1/produtos?q={termo}`: Autocompletar de produtos.
- Agrupar DTOs no arquivo `LookupDTOs.kt`.
- Retornar status HTTP REST semânticos (`200 OK`, `400 Bad Request`).
</requirements>

## Subtarefas

- [ ] 2.1 Criar o pacote `backend/src/main/kotlin/com/snk/conferencia/features/lookup/`.
- [ ] 2.2 Criar `LookupDTOs.kt` contendo `EmpresaResponse`, `ParceiroResponse` e `ProdutoResponse`.
- [ ] 2.3 Criar `LookupService.kt` integrando com o `SankhyaClient` para consultar tabelas do ERP.
- [ ] 2.4 Criar `LookupRoutes.kt` expondo os endpoints Ktor sob `/api/v1/`.
- [ ] 2.5 Criar os testes unitários `LookupServiceTest.kt` e de integração `LookupRoutesTest.kt`.

## Detalhes de Implementação

Consulte a seção **Endpoints de API** (Módulo `lookup`) e **Modelos de Dados** no arquivo `techspec.md`. Utilize o `SankhyaClient` para consultar as entidades no ERP Sankhya sanitizando o termo de busca `q`.

## Critérios de Sucesso

- As requisições `GET` para `/api/v1/empresas`, `/api/v1/parceiros` e `/api/v1/produtos` retornam código `200 OK` e listas formatadas em JSON.
- Busca por autocompletar com parâmetro `q` filtra os dados corretamente.
- Testes unitários e de rotas passam com 100% de sucesso.

## Testes da Tarefa

- [ ] Testes de unidade em `LookupServiceTest.kt` validando parsing e tratamento de busca vazia.
- [ ] Testes de integração em `LookupRoutesTest.kt` utilizando `testApplication` do Ktor.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `backend/src/main/kotlin/com/snk/conferencia/features/lookup/LookupDTOs.kt`
- `backend/src/main/kotlin/com/snk/conferencia/features/lookup/LookupService.kt`
- `backend/src/main/kotlin/com/snk/conferencia/features/lookup/LookupRoutes.kt`
- `backend/src/test/kotlin/com/snk/conferencia/features/lookup/LookupServiceTest.kt`
- `backend/src/test/kotlin/com/snk/conferencia/features/lookup/LookupRoutesTest.kt`
- `tasks/prd-migracao-endpoints-separacao/techspec.md`
