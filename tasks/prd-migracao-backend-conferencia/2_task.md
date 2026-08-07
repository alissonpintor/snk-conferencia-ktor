# Tarefa 2.0: Serviço de Busca e Leitura de Conferências (`features/conferencia/ConferenciaService.kt` - Parte 1)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar em `ConferenciaService.kt` a interface e regras de negócio para busca de conferência por checkout/número, início de tarefa, consulta de pendências do operador, busca de itens e consulta de detalhes do produto por código de barras.

<requirements>
- Definir a interface `ConferenciaServiceInterface` e sua implementação `ConferenciaServiceImpl.kt`.
- Reutilizar `SankhyaClient` para disparar as chamadas `DbExplorerSP.executeQuery` (para `ViewAppSeparacao`), `MgeWmsSP.buscaConferenciaPorPedido`, `MgeWmsSP.buscarTarefasColetor`, `MgeWmsSP.itensConferencia` e `MgeWmsSP.obtemDescricaoProduto`.
- Garantir a passagem do `jsessionid` e `userId` extraídos da sessão Ktor.
- Lançar `SankhyaBusinessException` em caso de erros retornados pelos serviços do ERP (`status != "1"`).
</requirements>

## Subtarefas

- [x] 2.1 Criar a interface `ConferenciaServiceInterface` e classe `ConferenciaServiceImpl` em `backend/src/main/kotlin/com/snk/conferencia/features/conferencia/`.
- [x] 2.2 Implementar método `buscarConferencia` consultando a view `ViewAppSeparacao` via `SankhyaClient.executeQuery`.
- [x] 2.3 Implementar método `iniciarConferencia` chamando `MgeWmsSP.buscaConferenciaPorPedido`.
- [x] 2.4 Implementar método `buscarTarefasPendentes` chamando `MgeWmsSP.buscarTarefasColetor`.
- [x] 2.5 Implementar método `buscarItensConferencia` chamando `MgeWmsSP.itensConferencia`.
- [x] 2.6 Implementar método `obterInfoProduto` chamando `MgeWmsSP.obtemDescricaoProduto`.
- [x] 2.7 Criar testes unitários em `ConferenciaServicePart1Test.kt` mocando `SankhyaClient` para cobrir os métodos de busca e leitura.

## Detalhes de Implementação

Consulte as seções **Design de Implementação (Interfaces)** e **Pontos de Integração** no arquivo `techspec.md`. Tratar a codificação `windows-1252` e garantir o mapeamento de exceções.

## Critérios de Sucesso

- Métodos de busca e leitura consultam os serviços Sankhya corretos e retornam listas/DTOs serializados.
- Falhas retornadas pelo gateway resultam em `SankhyaBusinessException`.
- Suíte de testes unitários com mock do `SankhyaClient` atinge 100% de aprovação.

## Testes da Tarefa

- [ ] Testes de unidade em `ConferenciaServicePart1Test.kt` cobrindo requisições com dados válidos e com falhas retornadas pelo ERP.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `backend/src/main/kotlin/com/snk/conferencia/features/conferencia/ConferenciaService.kt`
- `backend/src/test/kotlin/com/snk/conferencia/features/conferencia/ConferenciaServicePart1Test.kt`
- `backend/src/main/kotlin/com/snk/conferencia/shared/sankhya/SankhyaClient.kt`
- `tasks/prd-migracao-backend-conferencia/techspec.md`
