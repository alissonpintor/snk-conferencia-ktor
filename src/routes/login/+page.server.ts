import { fail, redirect, type Actions } from '@sveltejs/kit';
import { loginSchema } from '$lib/schemas/auth.schema';
import { AuthService } from '$lib/services/auth.service';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        console.log(data);

        // Zod validation
        const result = loginSchema.safeParse(data);
        if (!result.success) {
            // Transform Zod errors to match existing UI expectation (array of title/message)
            // or just use new structure if UI is updated.
            // Since Task 1.0 implies backend change, I'll provide standard structured errors.
            // If reusing old UI, it expects {title, message}.

            const errors = Object.entries(result.error.flatten().fieldErrors).flatMap(([field, msgs]) =>
                (msgs || []).map(msg => ({
                    title: 'Erro de Validação',
                    message: msg
                }))
            );

            return fail(400, {
                username: data.username,
                server: data.server,
                errors
            });
        }

        const { username, password, server } = result.data;
        const authService = new AuthService();

        try {
            const session = await authService.login({ username, password, server });

            // Set session cookie
            cookies.set('SessionID', session.jsessionid, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 // 1 day
            });

            // Legacy Sankhya cookie (Usuario)
            const usuarioCookie = JSON.stringify({
                id: session.idusu, // Assuming compatible with existing logic
                name: session.nomeusu
            });
            cookies.set('Usuario', usuarioCookie, {
                path: '/',
                httpOnly: true, // Enhancing security as per requirements
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 // 1 day
            });

            // Server preference cookie
            cookies.set('servidor', server, {
                path: '/',
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 365 // 1 year
            });

        } catch (error: any) {
            return fail(400, {
                username,
                server,
                errors: [{
                    title: 'Falha na Autenticação',
                    message: error.message || 'Erro desconhecido ao tentar fazer login'
                }]
            });
        }

        throw redirect(303, '/expedicao');
    }
};
