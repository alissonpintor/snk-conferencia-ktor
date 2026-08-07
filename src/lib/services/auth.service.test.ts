import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';

// Mock environment variables
vi.mock('$env/static/private', () => ({
    TREINA_URL: 'http://treina.com',
    PROD_URL: 'http://prod.com'
}));

// Mock global fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

// Helper to create buffer
const createBuffer = (obj: any) => Buffer.from(JSON.stringify(obj), 'latin1');

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(() => {
        service = new AuthService();
        fetchMock.mockReset();
    });

    it('should login successfully with valid credentials', async () => {
        const mockResponse = {
            status: "1",
            responseBody: {
                jsessionid: { $: "SESSION123" },
                idusu: { $: btoa("123") } // encoding 123 in base64
            }
        };

        // Mock fetch response
        fetchMock.mockResolvedValue({
            status: 200,
            arrayBuffer: async () => createBuffer(mockResponse)
        });

        const result = await service.login({
            username: 'testuser',
            password: 'password',
            server: 'teste'
        });

        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('http://treina.com'),
            expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining('testuser')
            })
        );

        expect(result).toEqual({
            jsessionid: "SESSION123",
            idusu: "123",
            nomeusu: "testuser",
            server: "teste"
        });
    });

    it('should handle login failure from Sankhya API (status 0)', async () => {
        const mockResponse = {
            status: "0",
            statusMessage: "Usuário ou senha inválidos"
        };

        fetchMock.mockResolvedValue({
            status: 200,
            arrayBuffer: async () => createBuffer(mockResponse)
        });

        await expect(service.login({
            username: 'wronguser',
            password: 'wrongpassword',
            server: 'producao'
        })).rejects.toThrow("Usuário ou senha inválidos");
    });

    it('should handle network error', async () => {
        fetchMock.mockRejectedValue(new Error("Network Error"));

        await expect(service.login({
            username: 'user',
            password: 'pwd',
            server: 'teste'
        })).rejects.toThrow("Erro de conexão com o servidor Sankhya.");
    });

    it('should handle missing jsessionid in response', async () => {
        const mockResponse = {
            status: "1",
            responseBody: {} // Missing jsessionid
        };

        fetchMock.mockResolvedValue({
            status: 200,
            arrayBuffer: async () => createBuffer(mockResponse)
        });

        await expect(service.login({
            username: 'user',
            password: 'pwd',
            server: 'teste'
        })).rejects.toThrow("Resposta do servidor incompleta (jsessionid ausente).");
    });

    it('should correctly target production URL', async () => {
        const mockResponse = {
            status: "1",
            responseBody: {
                jsessionid: { $: "SESSIONPROD" },
                idusu: { $: btoa("999") }
            }
        };

        fetchMock.mockResolvedValue({
            status: 200,
            arrayBuffer: async () => createBuffer(mockResponse)
        });

        await service.login({
            username: 'produser',
            password: 'pwd',
            server: 'producao'
        });

        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('http://prod.com'),
            expect.anything()
        );
    });
});
