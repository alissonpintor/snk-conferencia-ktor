# Tarefa 4.0: Camada de Negócio e Orquestração de Autenticação (`AuthService`)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Desenvolver o serviço `AuthService` que orquestra as regras de negócio de autenticação, integrando o `SankhyaAuthClient` e o `JwtProvider` para autenticar usuários, gerar tokens JWT e verificar a integridade da sessão.

<requirements>
- Validar os campos de entrada do objeto `AuthCredentialsDto` (`username`, `password`, `server`).
- Chamar o `SankhyaAuthClient` para efetuar a validação das credenciais no ERP.
- Em caso de sucesso no Sankhya, encapsular a resposta em um `UserSessionDto` e gerar o token JWT via `JwtProvider`.
- Fornecer método para validação de token e extração dos dados da sessão ativa.
</requirements>

## Subtarefas

- [x] 4.1 Criar a interface `AuthServiceInterface` e a classe de implementação `AuthService`.
- [x] 4.2 Implementar a função `authenticate(credentials: AuthCredentialsDto): TokenResponseDto`.
- [x] 4.3 Implementar a função `verifyToken(token: String): UserSessionDto`.
- [x] 4.4 Garantir a higienização de qualquer log do serviço (impedir vazamento de senha nos logs de erro).

## Detalhes de Implementação

Consulte a seção **Design de Implementação -> Interfaces Principais** em [`techspec.md`](file:///c:/Projetos/snk-conferencia/tasks/prd-migracao-autenticacao-ktor/techspec.md).

## Critérios de Sucesso

- O método `authenticate` retorna um `TokenResponseDto` completo com token Bearer e objeto de usuário quando as credenciais são válidas.
- O método `verifyToken` retorna os dados do usuário autenticado para tokens válidos e lança exceção para tokens incorretos/expirados.

## Testes da Tarefa

- [x] Testes de unidade: Testar `authenticate` com sucesso orquestrando mocks do `SankhyaAuthClient` e `JwtProvider`.
- [x] Testes de unidade: Testar `authenticate` com falha de credenciais repassando exceção amigável.
- [x] Testes de unidade: Testar `verifyToken` com token válido e inválido.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `src/main/kotlin/com/snk/conferencia/auth/AuthService.kt`
- `src/test/kotlin/com/snk/conferencia/auth/AuthServiceTest.kt`
- [`techspec.md`](file:///c:/Projetos/snk-conferencia/tasks/prd-migracao-autenticacao-ktor/techspec.md)
