/**
 * Fila de processamento assíncrono para serializar tarefas.
 * Utilizada para evitar condições de corrida em processos que não suportam concorrência,
 * como a geração de etiquetas no ERP.
 */
export class PrintQueue {
    private queue: Array<() => Promise<void>> = [];
    private isProcessing = false;

    /**
     * Adiciona uma tarefa à fila e retorna uma Promise que resolve com o resultado da tarefa.
     * @param task Função assíncrona a ser executada.
     */
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

    /**
     * Processa as tarefas na fila uma por uma.
     */
    private async process() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const task = this.queue.shift();
            if (task) {
                try {
                    await task();
                } catch (error) {
                    console.error('[PrintQueue] Erro ao processar tarefa da fila:', error);
                    // O erro já foi rejeitado na Promise da tarefa individual pelo wrappedTask
                }
            }
        }

        this.isProcessing = false;
    }
}

// Exportar instância Singleton para uso em todo o servidor
export const printQueue = new PrintQueue();
