import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../../src/routes/api/conferencia/volumes/imprimir/+server';
import { json } from '@sveltejs/kit';

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

describe('POST /api/conferencia/volumes/imprimir', () => {
    let locals: any;
    let request: any;

    beforeEach(() => {
        vi.clearAllMocks();
        locals = {
            sankhyaSessionId: 'SESSION123',
            sankhyaServer: 'http://sankhya.com'
        };
        request = {
            json: vi.fn().mockResolvedValue({
                nroUnico: '123',
                nroSeparacao: '456'
            })
        };
        global.fetch = vi.fn();
    });

    it('should retry when WMS_E00144 error is returned', async () => {
        const errorResponse = {
            status: '0',
            tsError: { tsErrorCode: 'WMS_E00144' },
            statusMessage: 'Etiquetas ainda não impressas'
        };

        const successResponse = {
            status: '1',
            responseBody: {
                chave: { valor: 'CHAVE_PDF_123' }
            }
        };

        const createBuffer = (obj: any) => Buffer.from(JSON.stringify(obj), 'latin1');

        // Mock 1st call: Error WMS_E00144
        // Mock 2nd call: Success
        (global.fetch as any)
            .mockResolvedValueOnce({
                arrayBuffer: async () => createBuffer(errorResponse)
            })
            .mockResolvedValueOnce({
                arrayBuffer: async () => createBuffer(successResponse)
            })
            // Mock PDF download
            .mockResolvedValueOnce({
                ok: true,
                blob: async () => new Blob(['pdf content'], { type: 'application/pdf' })
            });

        const response = await POST({ request, locals } as any);

        expect(global.fetch).toHaveBeenCalledTimes(3);
        // 1. First attempt to visualize
        // 2. Second attempt to visualize (retry)
        // 3. PDF download

        expect(response).toBeDefined();
        if (response) {
            expect(response).toBeInstanceOf(Response);
            expect(response.headers.get('Content-Type')).toBe('application/pdf');
        }
    });

    it('should fail after maximum retries', async () => {
        const errorResponse = {
            status: '0',
            tsError: { tsErrorCode: 'WMS_E00144' },
            statusMessage: 'Etiquetas ainda não impressas'
        };

        const createBuffer = (obj: any) => Buffer.from(JSON.stringify(obj), 'latin1');

        // Mock all 4 attempts with error
        (global.fetch as any).mockResolvedValue({
            arrayBuffer: async () => createBuffer(errorResponse)
        });

        const response: any = await POST({ request, locals } as any);
        const data = await response.json();

        expect(global.fetch).toHaveBeenCalledTimes(4); // 1 original + 3 retries
        expect(data.success).toBe(false);
        expect(data.error[0].message).toBe('Etiquetas ainda não impressas');
    });

    it('should not retry on other errors', async () => {
        const otherErrorResponse = {
            status: '0',
            statusMessage: 'Outro erro fatal'
        };

        const createBuffer = (obj: any) => Buffer.from(JSON.stringify(obj), 'latin1');

        (global.fetch as any).mockResolvedValue({
            arrayBuffer: async () => createBuffer(otherErrorResponse)
        });

        const response: any = await POST({ request, locals } as any);
        const data = await response.json();

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(data.success).toBe(false);
        expect(data.error[0].message).toBe('Outro erro fatal');
    });
});
