import { describe, it, expect, vi } from 'vitest';
import { sleep } from './sleep';

describe('sleep', () => {
    it('should wait for the specified amount of time', async () => {
        const start = Date.now();
        const duration = 100;

        await sleep(duration);

        const end = Date.now();
        const elapsed = end - start;

        // setTimeout is not 100% precise, but it should be at least >= duration
        // We add a small tolerance for some environments, but usually it's >= duration
        expect(elapsed).toBeGreaterThanOrEqual(duration - 5);
    });

    it('should resolve as a Promise', async () => {
        const promise = sleep(10);
        expect(promise).toBeInstanceOf(Promise);
        await promise;
    });

    it('should work with different durations', async () => {
        const start = Date.now();
        await sleep(50);
        const end = Date.now();
        expect(end - start).toBeGreaterThanOrEqual(45);
    });
});
