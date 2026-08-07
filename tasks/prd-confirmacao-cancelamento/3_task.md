# Tarefa 3.0: Validar com Testes E2E (Playwright)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar testes automatizados de ponta a ponta para garantir que a proteção de cancelamento funcione conforme o esperado e não quebre o fluxo de expedição.

<requirements>
- Criar script de teste Playwright.
- Testar o fluxo de "Confirmar Cancelamento".
- Testar o fluxo de "Desistir do Cancelamento".
</requirements>

## Subtarefas

- [x] 3.1 Criar/Atualizar arquivos de teste em `tests/e2e/expedicao/conferencia-cancelamento.test.ts`.
- [x] 3.2 Implementar asserções para visibilidade do modal e chamadas de API (mocks se necessário).

## Detalhes de Implementação

Utilizar a suite de testes existente como base. O teste deve simular um usuário com uma conferência iniciada clicando em cancelar.

## Critérios de Sucesso

- Testes passando consistentemente no CI/local.
- Cobertura dos casos de uso principais e alternativos descritos no PRD.

## Testes da Tarefa

- [ ] Execução `npx playwright test`.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `tests/e2e/expedicao/*`
