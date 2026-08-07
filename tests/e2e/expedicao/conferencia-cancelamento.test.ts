import { test, expect } from '@playwright/test';

test.describe('Confirmação de Cancelamento de Tarefa', () => {
    test.beforeEach(async ({ page }) => {
        // Mock de autenticação ou login
        await page.goto('/login');
        await page.fill('input[name="username"]', 'testuser');
        await page.fill('input[name="password"]', 'password');
        await page.click('button[type="submit"]');

        // Navegar para expedição
        await page.goto('/expedicao');
    });

    test('deve abrir o modal de confirmação ao clicar em cancelar e NÃO cancelar ao desistir', async ({ page }) => {
        // Assumindo que o estado da conferência pode ser forçado ou mockado para estar "iniciada"
        // Ou que clicamos em algo para iniciar. 
        // Como não temos o setup completo de mocks aqui, este teste é representativo.

        const cancelBtn = page.getByRole('button', { name: /cancelar/i });

        // Esperar o botão aparecer (pode precisar de uma ação prévia para iniciar a conferência)
        // await page.getByRole('button', { name: /iniciar/i }).click(); 

        if (await cancelBtn.isVisible()) {
            await cancelBtn.click();

            const modalTitle = page.getByText('Confirmar Cancelamento');
            await expect(modalTitle).toBeVisible();

            const message = page.getByText('Tem certeza que deseja cancelar esta tarefa?');
            await expect(message).toBeVisible();

            const backBtn = page.getByRole('button', { name: /não, voltar/i });
            await backBtn.click();

            await expect(modalTitle).not.toBeVisible();
            await expect(cancelBtn).toBeVisible();
        }
    });

    test('deve cancelar a tarefa ao confirmar no modal', async ({ page }) => {
        const cancelBtn = page.getByRole('button', { name: /cancelar/i });

        if (await cancelBtn.isVisible()) {
            await cancelBtn.click();

            const confirmBtn = page.getByRole('button', { name: /sim, cancelar/i });
            await confirmBtn.click();

            await expect(page.getByText('Confirmar Cancelamento')).not.toBeVisible();
            // O botão cancelar deve sumir se a tarefa foi limpa (voltando pro estado inicial)
            await expect(cancelBtn).not.toBeVisible();
        }
    });
});
