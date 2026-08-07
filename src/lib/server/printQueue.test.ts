import { describe, it, expect, vi } from 'vitest';
import { PrintQueue } from './printQueue';

describe('PrintQueue', () => {
    it('deve processar tarefas na ordem correta (FIFO)', async () => {
        const queue = new PrintQueue();
        const results: number[] = [];

        const task1 = async () => {
            await new Promise(resolve => setTimeout(resolve, 50));
            results.push(1);
            return 1;
        };

        const task2 = async () => {
            results.push(2);
            return 2;
        };

        // Adiciona ambos quase simultaneamente
        const p1 = queue.add(task1);
        const p2 = queue.add(task2);

        await Promise.all([p1, p2]);

        expect(results).toEqual([1, 2]);
    });

    it('deve retornar o resultado correto de cada tarefa', async () => {
        const queue = new PrintQueue();

        const r1 = await queue.add(async () => 'resultado 1');
        const r2 = await queue.add(async () => 'resultado 2');

        expect(r1).toBe('resultado 1');
        expect(r2).toBe('resultado 2');
    });

    it('deve continuar processando mesmo se uma tarefa falhar', async () => {
        const queue = new PrintQueue();
        const results: string[] = [];

        const taskFail = async () => {
            throw new Error('Falha catastrófica');
        };

        const taskSuccess = async () => {
            results.push('sucesso');
            return 'ok';
        };

        const p1 = queue.add(taskFail);
        const p2 = queue.add(taskSuccess);

        await expect(p1).rejects.toThrow('Falha catastrófica');
        const r2 = await p2;

        expect(r2).toBe('ok');
        expect(results).toEqual(['sucesso']);
    });

    it('deve serializar tarefas que levam tempos diferentes', async () => {
        const queue = new PrintQueue();
        const start = Date.now();

        const task1 = async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            return 1;
        };

        const task2 = async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            return 2;
        };

        const p1 = queue.add(task1);
        const p2 = queue.add(task2);

        await Promise.all([p1, p2]);
        const duration = Date.now() - start;

        // Se fosse paralelo, duraria ~100ms. Como é sequencial, deve durar >= 200ms.
        expect(duration).toBeGreaterThanOrEqual(200);
    });
});
