# Especificação Técnica: Refatoração de Autenticação e Autorização

## Resumo Executivo

Esta especificação técnica detalha a refatoração do módulo de autenticação do `snk-conferencia`, migrando a página de login para **Svelte 5 (Runes)**, implementando validação robusta com **Zod**, e centralizando a lógica de autenticação em um novo `AuthService`. A arquitetura visa desacoplar a interface de usuário da lógica de integração com o ERP Sankhya, garantindo manutenibilidade e testabilidade. A rota de login será movida para `/login` (com redirecionamento na raiz), e a proteção de rotas será padronizada no middleware (`hooks.server.ts`).

## Arquitetura do Sistema

### Visão Geral dos Componentes

- **`AuthService` (`src/lib/services/auth.service.ts`)**: Novo serviço responsável pela comunicação com o endpoint `MobileLoginSP.login` do Sankhya. Ele gerencia a decodificação de resposta (legacy encoding), tratamento de erros de API e formatação dos dados de sessão.
- **`LoginPage` (`src/routes/login/+page.svelte`)**: Interface de usuário refatorada usando Svelte 5 Runes. Utilizará `sveltekit-superforms` (ou `enhance` nativo com validação manual via Zod) para feedback visual imediato e acessibilidade.
- **`LoginAction` (`src/routes/login/+page.server.ts`)**: Action do SvelteKit que orquestra a validação dos dados de entrada (Zod), chama o `AuthService` e gerencia a persistência da sessão via Cookies (`SessionID`, `Usuario`, `servidor`).
- **`Hooks` (`src/hooks.server.ts`)**: Middleware simplificado para interceptar requisições. Redirecionará acessos não autenticados para `/login` e impedirá acesso à página de login se o usuário já estiver logado.

## Design de Implementação

### Interfaces Principais

```typescript
// src/lib/types/auth.ts

export interface AuthCredentials {
    username: string;
    password?: string; // Opcional apenas para log interna, obrigatório no form
    server: string;
}

export interface UserSession {
    jsessionid: string;
    idusu: string;
    nomeusu: string;
}

export interface AuthError {
    message: string;
    code?: string;
}

// Interface do Serviço
export interface IAuthService {
    login(credentials: AuthCredentials): Promise<UserSession>;
}
```

### Modelos de Dados

**Schema de Validação (Zod)**

```typescript
// src/lib/schemas/auth.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(1, "O usuário é obrigatório"),
    password: z.string().min(1, "A senha é obrigatória"),
    server: z.enum(['producao', 'teste'], {
        required_error: "Selecione um servidor válido"
    })
});

export type LoginSchema = z.infer<typeof loginSchema>;
```

### Endpoints de API

**SvelteKit Form Actions**

- **POST `/login` (default action)**
    - **Entrada:** `FormData` contendo `username`, `password`, `server`.
    - **Processamento:**
        1. Validação com `loginSchema`.
        2. Chamada para `AuthService.login`.
        3. Configuração de Cookies (`SessionID` com `HttpOnly`, `Secure` em prod).
    - **Saída Sucesso:** Redirect 303 para `/expedicao` (ou URL original).
    - **Saída Erro:** 400 Bad Request com mensagens de erro (campos ou global).

## Pontos de Integração

### Integração Sankhya

- **Serviço:** `MobileLoginSP.login`
- **Protocolo:** POST
- **Payload:**
    ```json
    {
        "serviceName": "MobileLoginSP.login",
        "requestBody": {
            "NOMUSU": { "$": "username" },
            "INTERNO": { "$": "password" },
            "KEEPCONNECTED": { "$": "S" }
        }
    }
    ```
- **Tratamento de Legado:** A resposta utiliza encoding `windows-1252`. O `AuthService` deve utilizar `TextDecoder('windows-1252')` para processar o buffer da resposta corretamente antes do parse JSON.

## Abordagem de Testes

### Testes Unidade

- **`AuthService`**:
    - Mockar `fetch` global.
    - Testar sucesso no login (retorno de `jsessionid`).
    - Testar falha de credenciais (status 0 no response body).
    - Testar erro de conexão (network error).
    - Testar parsing de caracteres especiais (acento) na resposta legado.

### Testes de Integração

- Não aplicável (foco em Unidade e E2E).

### Testes de E2E

- **Cenários (Playwright)**:
    1. **Login com Sucesso**: Preencher credenciais corretas -> Verificar redirecionamento para `/expedicao`.
    2. **Validação de Campos**: Submeter formulário vazio -> Verificar mensagens de erro inline.
    3. **Login Inválido**: Credenciais erradas -> Verificar toast/alerta de erro.
    4. **Persistência de Seleção**: Selecionar servidor 'Teste', recarregar página -> Verificar se 'Teste' continua selecionado (via localStorage/Cookie auxiliar).

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1.  **`AuthService` e Schemas**: Implementar a lógica de negócios isolada e schemas Zod. (Teste unitário aqui).
2.  **Refatoração de Rotas**: Mover `src/routes/+page.svelte` para `src/routes/login/+page.svelte` e criar `src/routes/+page.server.ts` (redirect).
3.  **UI de Login (Svelte 5)**: Reimplementar o componente de login usando Runes e Zod.
4.  **Integração `+page.server.ts`**: Conectar a UI ao `AuthService` via Form Actions.
5.  **Middleware (`hooks.server.ts`)**: Atualizar regras de proteção de rota.
6.  **Testes E2E**: Criar e rodar bateria de testes.

### Dependências Técnicas

- Instalação de bibliotecas: `zod`, `sveltekit-superforms` (opcional, recomendado), `lucide-svelte`.
- Acesso aos ambientes de Produção e Teste do Sankhya para validação real.

## Considerações Técnicas

### Decisões Principais

- **Uso de AuthService dedicado**: Ao invés de estender o `SankhyaHttpClient` existente (que exige sessão), criaremos um serviço focado apenas na aquisição de sessão. Isso evita circularidade e complexidade desnecessária no client principal.
- **Svelte 5 Runes**: Adoção antecipada para garantir longevidade do código e melhor performance de reatividade.
- **Validação no Server**: Zod garante segurança contra requisições maliciosas diretas, além da validação no cliente.

### Riscos Conhecidos

- **Encoding**: O Sankhya retorna JSON com encoding `windows-1252`. Esquecer o decoder resultará em caracteres corrompidos nas mensagens de erro.
- **Mudança de URL**: Mover o login para `/login` pode afetar bookmarks de usuários (mitigado pelo redirect na raiz).

### Conformidade com Padrões

- **@.agent/rules/backend-code-style.md**: Uso de práticas robustas de API e validação.
- **@.agent/rules/frontend-code-style.md**: Uso de Svelte 5 Runes, TypeScript estrito.
- **@.agent/rules/sankhya-api.md**: Conformidade com o protocolo `service.sbr`.

### Arquivos relevantes e dependentes

- `src/lib/services/auth.service.ts` (Novo)
- `src/lib/schemas/auth.schema.ts` (Novo)
- `src/routes/login/+page.svelte` (Movido/Refatorado)
- `src/routes/login/+page.server.ts` (Novo)
- `src/routes/+page.server.ts` (Refatorado para Redirect)
- `src/hooks.server.ts` (Modificado)
- `src/lib/types/usuario.ts` (Pode precisar de ajustes)
