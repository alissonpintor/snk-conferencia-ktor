import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string({ message: "O usuário é obrigatório" }).min(1, "O usuário é obrigatório"),
    password: z.string({ message: "A senha é obrigatória" }).min(1, "A senha é obrigatória"),
    server: z.enum(['producao', 'teste'], {
        message: "Selecione um servidor válido"
    })
});

export type LoginSchema = z.infer<typeof loginSchema>;
