import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../../src/routes/api/conferencia/volumes/imprimir/+server';

// Mock SvelteKit json function
vi.mock('@sveltejs/kit', () => ({
    json: vi.fn((data) => ({
        status: 200,
        json: async () => data
    }))
}));

// Mock sleep to avoid waiting during tests
vi.mock('$lib/utils/sleep', () => ({
    sleep: vi.fn(() => Promise.resolve())
}));

describe('Concorrência POST /api/conferencia/volumes/imprimir', () => {
    let locals: any;

    beforeEach(() => {
        vi.clearAllMocks();
        locals = {
            sankhyaSessionId: 'SESSION123',
            sankhyaServer: 'http://sankhya.com'
        };
        global.fetch = vi.fn();
    });

    it('deve serializar requisições simultâneas', async () => {
        const createBuffer = (obj: any) => Buffer.from(JSON.stringify(obj), 'latin1');
        const successResponse = {
            status: '1',
            responseBody: { chave: { valor: 'CHAVE' } }
        };

        const timeline: string[] = [];

        // Mock fetch para levar tempo e registrar na timeline
        (global.fetch as any).mockImplementation(async (url: string) => {
            if (url.includes('service.sbr')) {
                timeline.push('start_fetch');
                await new Promise(resolve => setTimeout(resolve, 100));
                timeline.push('end_fetch');
                return { arrayBuffer: async () => createBuffer(successResponse) };
            }
            return {
                ok: true,
                blob: async () => new Blob(['pdf'], { type: 'application/pdf' })
            };
        });

        const req1 = { json: async () => ({ nroUnico: '1', nroSeparacao: '11' }) };
        const req2 = { json: async () => ({ nroUnico: '2', nroSeparacao: '22' }) };

        // Dispara ambos ao mesmo tempo
        const promise1 = POST({ request: req1, locals } as any);
        const promise2 = POST({ request: req2, locals } as any);

        await Promise.all([promise1, promise2]);

        // Se fosse paralelo: ['start_fetch', 'start_fetch', 'end_fetch', 'end_fetch']
        // Como é sequencial: ['start_fetch', 'end_fetch', 'start_fetch', 'end_fetch']
        expect(timeline).toEqual(['start_fetch', 'end_fetch', 'start_fetch', 'end_fetch']);
    });
});
