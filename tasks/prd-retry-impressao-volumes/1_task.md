# Tarefa 1.0: Implementar utilitário de delay (sleep) e testes unitários

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar uma função utilitária `sleep` que será usada para pausar a execução entre as tentativas de retry no servidor. Esta função deve ser assíncrona e utilizar `setTimeout` encapsulada em uma `Promise`.

<requirements>
- Criar o arquivo `src/lib/utils/sleep.ts`.
- A função deve aceitar um parâmetro `ms` (milissegundos).
- Criar testes de unidade para garantir que a função aguarda o tempo esperado.
</requirements>

## Subtarefas

- [x] 1.1 Criar o arquivo `src/lib/utils/sleep.ts` com a implementação da função `sleep`.
- [x] 1.2 Criar o arquivo de teste `src/lib/utils/sleep.test.ts`.
- [x] 1.3 Validar que o teste passa usando Vitest.

## Detalhes de Implementação

Referencie a seção de "Design de Implementação" na `techspec.md`. A implementação deve ser simples:
```typescript
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
```

## Critérios de Sucesso

- Função `sleep` exportada e funcional.
- Cobertura de testes de unidade de 100% para este utilitário.
- Nenhuma regressão nos utilitários existentes.

## Testes da Tarefa

- [x] Testes de unidade (Vitest)

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `src/lib/utils/sleep.ts`
- `src/lib/utils/sleep.test.ts`
