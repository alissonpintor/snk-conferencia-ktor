# Tarefa 3.0: Implementar testes de integração e E2E para validar o fluxo de retry

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Garantir que a funcionalidade de retry funcione como esperado através de testes automatizados que simulem falhas temporárias e recuperação.

<requirements>
- Criar testes de integração para o endpoint de API.
- Criar/Atualizar testes E2E usando Playwright se aplicável.
- Validar o comportamento de sucesso após retry e o comportamento de falha definitiva.
</requirements>

## Subtarefas

- [x] 3.1 Criar arquivo de teste de integração `tests/api/conferencia/volumes/imprimir.test.ts`.
- [x] 3.2 Simular cenário onde o primeiro fetch falha com `WMS_E00144` e o segundo tem sucesso.
- [x] 3.3 Simular cenário onde todas as tentativas falham.
- [ ] 3.4 (Opcional) Adicionar teste Playwright se houver ambiente para mockar a API Sankhya no E2E.

## Detalhes de Implementação

Utilizar mocks de rede (como `msw` ou sobrescrever o `fetch` global nos testes) para controlar as respostas da API Sankhya.

## Critérios de Sucesso

- Testes de integração cobrindo os caminhos de sucesso, retry-sucesso e falha.
- Todos os testes passando no ambiente de CI/Local.
- Validação visual de que o "Loading" no frontend permanece ativo durante o retry (observação manual ou teste E2E).

## Testes da Tarefa

- [ ] Testes de integração (Vitest)
- [ ] Testes E2E (Playwright)

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `src/routes/api/conferencia/volumes/imprimir/+server.ts`
- `tests/api/conferencia/volumes/imprimir.test.ts`
