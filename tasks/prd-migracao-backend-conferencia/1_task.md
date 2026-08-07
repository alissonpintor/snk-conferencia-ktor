# Tarefa 1.0: DTOs e Modelos de Dados da Conferência (`features/conferencia/ConferenciaDTOs.kt`)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar e definir todos os data classes em Kotlin anotados com `@Serializable` para requisições e respostas dos 13 endpoints da funcionalidade de conferência no backend Ktor.

<requirements>
- Definir os modelos de dados no pacote `com.snk.conferencia.features.conferencia` dentro do arquivo `ConferenciaDTOs.kt`.
- Garantir a anotação `@Serializable` (Kotlinx Serialization) em todas as estruturas.
- Mapear os campos exigidos pelos contratos REST descritos na `techspec.md` (busca, início, tarefas pendentes, itens, info produto, bipagem/registro, saldo, remoção, finalização, volumes, impressão, doca e cancelamento).
- Fornecer valores padrão adequados para campos opcionais (`val complemento: String? = null`, `val qtdadeAvariada: Double = 0.0`, etc.).
</requirements>

## Subtarefas

- [x] 1.1 Criar o arquivo `ConferenciaDTOs.kt` em `backend/src/main/kotlin/com/snk/conferencia/features/conferencia/`.
- [x] 1.2 Definir DTOs de Busca e Início (`BuscarConferenciaRequest`, `ConferenciaResponse`, `IniciarConferenciaRequest`, `IniciarConferenciaResponse`, `ConferenciaPendenteResponse`).
- [x] 1.3 Definir DTOs de Itens, Bipagem e Saldo (`ItemConferenciaResponse`, `InfoProdutoRequest`, `InfoProdutoResponse`, `RegistrarItemConferidoRequest`, `RegistrarItemResponse`, `AtualizarSaldoRequest`, `SaldoItemResponse`, `RemoverItensRequest`).
- [x] 1.4 Definir DTOs de Finalização, Logística e Impressão (`FinalizarConferenciaRequest`, `FinalizarConferenciaResponse`, `RegistrarVolumesRequest`, `ImprimirVolumesRequest`, `EnviarDocaRequest`, `CancelarConferenciaRequest`).
- [x] 1.5 Criar suíte de testes unitários `ConferenciaDTOsTest.kt` para validar a serialização e desserialização JSON de todos os DTOs.

## Detalhes de Implementação

Consulte a seção **Modelos de Dados** no arquivo `techspec.md`. Garantir o uso estrito de Kotlinx Serialization (`kotlinx.serialization.Serializable` e `kotlinx.serialization.json.Json`).

## Critérios de Sucesso

- Todos os 13 contratos de DTOs descritos na `techspec.md` estão implementados e compilando.
- Testes unitários comprovam a correta codificação e decodificação JSON de todos os DTOs.
- Zero advertências de compilação em relação a anotações de serialização.

## Testes da Tarefa

- [ ] Testes de unidade em `ConferenciaDTOsTest.kt` validando o parser JSON de cada request e response DTO.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `backend/src/main/kotlin/com/snk/conferencia/features/conferencia/ConferenciaDTOs.kt`
- `backend/src/test/kotlin/com/snk/conferencia/features/conferencia/ConferenciaDTOsTest.kt`
- `tasks/prd-migracao-backend-conferencia/techspec.md`
