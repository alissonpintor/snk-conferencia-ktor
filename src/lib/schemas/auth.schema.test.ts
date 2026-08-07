import { describe, it, expect } from 'vitest';
import { loginSchema } from './auth.schema';

describe('Auth Schema', () => {
    it('should validate correct input', () => {
        const input = {
            username: 'validuser',
            password: 'validpass',
            server: 'producao'
        };
        const result = loginSchema.safeParse(input);
        expect(result.success).toBe(true);
    });

    it('should fail with missing username', () => {
        const input = {
            password: 'validpass',
            server: 'producao'
        };
        const result = loginSchema.safeParse(input);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.flatten().fieldErrors.username).toContain("O usuário é obrigatório");
        }
    });

    it('should fail with empty username', () => {
        const input = {
            username: '',
            password: 'validpass',
            server: 'producao'
        };
        const result = loginSchema.safeParse(input);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.flatten().fieldErrors.username).toContain("O usuário é obrigatório");
        }
    });

    it('should fail with missing password', () => {
        const input = {
            username: 'validuser',
            server: 'producao'
        };
        const result = loginSchema.safeParse(input);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.flatten().fieldErrors.password).toContain("A senha é obrigatória");
        }
    });

    it('should fail with invalid server', () => {
        const input = {
            username: 'validuser',
            password: 'validpass',
            server: 'invalid'
        };
        const result = loginSchema.safeParse(input);
        expect(result.success).toBe(false);

    });
});
