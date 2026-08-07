# Tech Spec - Fila de Impressão de Volumes

## Resumo Executivo

Implementar uma **Fila de Processamento em Memória (Singleton)** no servidor para gerenciar as requisições de impressão de etiquetas de volume. Esta solução serializa as chamadas ao endpoint de impressão do Sankhya, prevenindo condições de corrida onde múltiplos usuários recebem a mesma etiqueta.

> **Importante**: Em ambientes Serverless (Cloudflare Workers), variáveis globais persistem *apenas* durante a vida da instância do worker (enquanto "quente"). Se houver múltiplas instâncias rodando simultaneamente (altíssima concorrência distribuída), essa solução em memória local não resolverá *completamente* o problema, mas mitigará significativamente a concorrência na mesma região/instância. Para uma solução 100% robusta em serverless distribuído, seria necessário usar Durable Objects ou filas externas (SQS/Redis), o que está fora do escopo atual.

## Arquitetura da Solução

### Componentes Principais

1.  **`src/lib/server/printQueue.ts`**:
    - Classe `PrintQueue` (Singleton).
    - Métodos: `add(task: () => Promise<any>): Promise<any>`.
    - Lógica: Recebe uma função assíncrona (a chamada ao Sankhya), adiciona à fila interna, processa sequencialmente.

2.  **`src/routes/api/conferencia/volumes/imprimir/+server.ts`**:
    - Instancia/importa a fila global.
    - Envolve toda a lógica de impressão (incluindo o loop de retry existente) dentro de uma chamada à fila:
      ```typescript
      return await printQueue.add(async () => {
          // Lógica original de impressão com retry
      });
      ```

### Fluxo de Dados

1.  Requisição POST chega ao endpoint `/imprimir`.
2.  Endpoint cria uma closure com a lógica de negócio.
3.  Closure é passada para `printQueue.add()`.
4.  `printQueue` verifica se está processando.
    - Se não: Executa imediatamente.
    - Se sim: Adiciona à lista de espera e retorna uma Promise que resolverá quando chegar a vez.
5.  Quando a vez chega, a closure é executada.
6.  O resultado (PDF ou Erro) é retornado pela Promise da fila.
7.  Endpoint responde ao cliente.

## Detalhes de Implementação

### Classe `PrintQueue`

```typescript
export class PrintQueue {
    private queue: Array<() => Promise<void>> = [];
    private isProcessing = false;

    async add<T>(task: () => Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const wrappedTask = async () => {
                try {
                    const result = await task();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };

            this.queue.push(wrappedTask);
            this.process();
        });
    }

    private async process() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const task = this.queue.shift();
            if (task) {
                try {
                    await task();
                } catch (error) {
                    console.error('Erro na fila de impressão:', error);
                }
            }
        }

        this.isProcessing = false;
    }
}

// Exportar instância Singleton
export const printQueue = new PrintQueue();
```

## Tratamento de Erros e Timeout

- **Timeout**: Se a fila estiver muito cheia, as requisições podem demorar. O Cloudflare tem timeout padrão (ex: 30s ou 100ms dependendo do plano). Devemos monitorar.
- **Erro na Tarefa**: Se uma tarefa falhar, ela deve liberar a fila para a próxima (garantido pelo `try/catch` no loop `while` e no wrapper).

## Riscos Conhecidos

- **Escalabilidade**: Se o tráfego aumentar muito e houverm múltiplas instâncias do worker, a fila local não sincronizará entre elas. O risco é baixo para o volume atual de conferência.
- **Memória**: Se a fila crescer indefinidamente sem processar, pode estourar a memória. (Risco baixo dado o timeout do request).

## Estratégia de Testes

1.  **Testes Unitários (`printQueue.test.ts`)**:
    - Validar que tarefas são executadas na ordem correta.
    - Validar que tarefas simultâneas são serializadas.
    - Validar tratamento de erro (fila continua processando após erro).

2.  **Testes de Integração (`imprimir.test.ts`)**:
    - Simular concorrência chamando o endpoint múltiplas vezes simultaneamente (`Promise.all`).
    - Verificar se os resultados correspondem às entradas (mockando o Sankhya para retornar dados diferentes baseados na entrada).

## Sequência de Implementação

1.  Implementar `PrintQueue`.
2.  Testar `PrintQueue`.
3.  Integrar `PrintQueue` ao endpoint de impressão.
4.  Atualizar testes de integração para validar concorrência.
