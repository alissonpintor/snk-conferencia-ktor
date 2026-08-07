# Tarefa 2.0: Camada de Serviço de Recontagem (`RecontagemServiceInterface` & `RecontagemService`)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar a interface `RecontagemServiceInterface` e a classe concreta `RecontagemService` para gerenciar a lógica de negócio do módulo de Recontagem. O serviço orquestra a comunicação com o gateway Sankhya WMS (`MgeWmsSP.recontagemDoca`, `proximaRecontagem`, `buscaInfoProduto`, `envioRecontagem`, `rejeitaTarefa`, `buscaInfoRecontagem`) via `SankhyaClient`, tratando os casos de erro e finalizações.

<requirements>
- Definir `RecontagemServiceInterface` com métodos assíncronos (`suspend`) para os 6 endpoints.
- Implementar `RecontagemService` recebendo a dependência de `SankhyaClient`.
- Formatar payloads JSON e codificar o ID do usuário em Base64 (`idusu`).
- Tratar o código de erro Sankhya `WMS_E00299` em `buscarProximaRecontagem` para retornar `null` (finalização graciosa de recontagem).
- Validar retorno da mensagem em `enviarRecontagem` (se `MENSAGEM != 'OK'`, lançar `SankhyaBusinessException`).
- Criar testes unitários completos em `RecontagemServiceTest` simulando respostas Sankhya via mock.
</requirements>

## Subtarefas

- [ ] 2.1 Criar a interface `RecontagemServiceInterface` no pacote `com.snk.conferencia.features.recontagem`.
- [ ] 2.2 Criar a classe `RecontagemService` implementando a interface.
- [ ] 2.3 Implementar a chamada ao serviço `MgeWmsSP.recontagemDoca` no método `iniciarRecontagem`.
- [ ] 2.4 Implementar a chamada ao serviço `MgeWmsSP.proximaRecontagem` com captura de `WMS_E00299` no método `buscarProximaRecontagem`.
- [ ] 2.5 Implementar `obterInfoProduto` (`MgeWmsSP.buscaInfoProduto`) e `obterInfoRecontagem` (`MgeWmsSP.buscaInfoRecontagem`).
- [ ] 2.6 Implementar `enviarRecontagem` (`MgeWmsSP.envioRecontagem`) com validação da mensagem contida na resposta.
- [ ] 2.7 Implementar `cancelarRecontagem` (`MgeWmsSP.rejeitaTarefa`).
- [ ] 2.8 Criar a suíte de testes unitários `RecontagemServiceTest.kt` cobrindo cenários de sucesso, erro de negócio e fim de itens (`WMS_E00299`).

## Detalhes de Implementação

Consulte as seções "Interfaces Principais", "Design de Implementação" e "Pontos de Integração" no [techspec.md](file:///c:/Projetos/snk-conferencia-ktor/tasks/prd-migracao-recontagem-ktor/techspec.md).

## Critérios de Sucesso

- O serviço executa as requisições assíncronas no gateway Sankhya formatando corretamente os parâmetros WMS.
- O código `WMS_E00299` retorna `null` sem lançar erro.
- Respostas divergentes ou inválidas lançam `SankhyaBusinessException`.
- 100% dos testes unitários em `RecontagemServiceTest` passam com êxito.

## Testes da Tarefa

- [ ] Testes de unidade (`RecontagemServiceTest.kt` cobrindo todos os 6 métodos do serviço)
- [ ] Testes de integração (N/A nesta fase isolada de serviço)

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `backend/src/main/kotlin/com/snk/conferencia/features/recontagem/RecontagemService.kt`
- `backend/src/test/kotlin/com/snk/conferencia/features/recontagem/RecontagemServiceTest.kt`
- `backend/src/main/kotlin/com/snk/conferencia/shared/sankhya/SankhyaClient.kt`
