# Tarefa 1.0: DTOs e Contratos da Feature de Recontagem (`RecontagemDTOs.kt`)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar as data classes serializáveis em Kotlin (`@Serializable`) no pacote `com.snk.conferencia.features.recontagem` para representar os contratos de requisição e resposta de todos os 6 endpoints da API de Recontagem (`iniciar`, `proxima`, `info-produto`, `enviar`, `cancelar`, `info`).

<requirements>
- Criar a classe `RecontagemDTOs.kt` anotada com `@Serializable` em Kotlin.
- Definir os DTOs `IniciarRecontagemRequest`, `IniciarRecontagemResponse`, `ProximaRecontagemRequest`, `ItemRecontagemResponse`, `InfoProdutoRecontagemRequest`, `EnviarRecontagemRequest`, `CancelarRecontagemRequest` e `RecontagemActionResponse`.
- Garantir a nulabilidade e valores padrão apropriados para campos opcionais.
- Criar testes unitários para validar a serialização e desserialização JSON dos DTOs.
</requirements>

## Subtarefas

- [ ] 1.1 Criar o arquivo `RecontagemDTOs.kt` no pacote `com.snk.conferencia.features.recontagem`.
- [ ] 1.2 Declarar os DTOs de Requisição e Resposta para os 6 endpoints conforme especificado no [techspec.md](file:///c:/Projetos/snk-conferencia-ktor/tasks/prd-migracao-recontagem-ktor/techspec.md).
- [ ] 1.3 Criar o arquivo de teste `RecontagemDTOsTest.kt` no pacote de testes.
- [ ] 1.4 Implementar testes de conversão JSON para cada DTO garantindo integridade dos campos.

## Detalhes de Implementação

Consulte a seção "Modelos de Dados" no [techspec.md](file:///c:/Projetos/snk-conferencia-ktor/tasks/prd-migracao-recontagem-ktor/techspec.md) para verificar a definição exata das propriedades e tipos de dados de cada DTO.

## Critérios de Sucesso

- Todos os DTOs compilam e serializam sem erros usando `kotlinx.serialization`.
- 100% dos testes unitários de serialização em `RecontagemDTOsTest` executam com sucesso.

## Testes da Tarefa

- [ ] Testes de unidade (`RecontagemDTOsTest.kt` validando serialização/desserialização JSON)
- [ ] Testes de integração (N/A para esta tarefa de DTOs)

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `backend/src/main/kotlin/com/snk/conferencia/features/recontagem/RecontagemDTOs.kt`
- `backend/src/test/kotlin/com/snk/conferencia/features/recontagem/RecontagemDTOsTest.kt`
