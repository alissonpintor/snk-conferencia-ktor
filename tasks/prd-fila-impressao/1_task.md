# Tarefa 1.0: Implementar mecanismo de fila (PrintQueue) e testes unitários

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar uma classe utilitária `PrintQueue` que gerencie a execução sequencial de tarefas assíncronas (closures) para evitar condições de corrida na impressão.

<requirements>
- Implementar a classe `PrintQueue` em `src/lib/server/printQueue.ts`.
- Garantir que a fila processe apenas uma tarefa por vez.
- Exportar uma instância singleton da fila.
- Criar testes unitários para validar o comportamento FIFO e recuperação de erros.
</requirements>

## Subtarefas

- [x] 1.1 Criar o arquivo `src/lib/server/printQueue.ts`.
- [x] 1.2 Implementar a lógica de adição e processamento sequencial.
- [x] 1.3 Criar o arquivo de teste `src/lib/server/printQueue.test.ts`.
- [x] 1.4 Garantir 100% de sucesso nos testes unitários.

## Detalhes de Implementação

Referencie a seção "Arquitetura da Solução" na `techspec.md`. A classe deve manter um array de tarefas e um estado `isProcessing`.

## Critérios de Sucesso

- Tarefas adicionadas simultaneamente são executadas uma após a outra.
- Falhas em uma tarefa não interrompem o processamento das próximas.
- Instância singleton disponível para uso no servidor.

## Testes da Tarefa

- [ ] Testes de unidade (Vitest)

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `src/lib/server/printQueue.ts`
- `src/lib/server/printQueue.test.ts`
