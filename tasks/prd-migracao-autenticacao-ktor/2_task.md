# Tarefa 2.0: Componente de Emissão e Validação de Tokens JWT (`JwtProvider`)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Desenvolver o utilitário de segurança `JwtProvider` responsável por emitir e verificar tokens JWT contendo as informações da sessão do ERP Sankhya (`jsessionid`, `idusu`, `username`, `server`).

<requirements>
- Utilizar algoritmo de assinatura seguro HMAC256 com chave privada injetada via configuração (`JWT_SECRET`).
- Encapsular os claims de sessão Sankhya (`jsessionid`, `idusu`, `username`, `server`) dentro do payload do JWT.
- Definir tempo de expiração do token (ex: 24 horas por padrão).
- Fornecer método de validação capaz de decodificar e validar a assinatura e tempo de expiração do token.
</requirements>

## Subtarefas

- [x] 2.1 Criar a classe `JwtProvider` e declarar a interface do gerador de tokens no pacote `com.snk.conferencia.auth`.
- [x] 2.2 Implementar o método `generateToken(userSession: UserSessionDto): String` injetando os claims necessários.
- [x] 2.3 Implementar o método `verifyToken(token: String): UserSessionDto` validando emissor, audiência e expiração.
- [x] 2.4 Tratar exceções de token adulterado ou expirado retornando exceção de autenticação padronizada.

## Detalhes de Implementação

Consulte a seção **Design de Implementação -> Interfaces Principais** e **Pontos de Integração** em [`techspec.md`](file:///c:/Projetos/snk-conferencia/tasks/prd-migracao-autenticacao-ktor/techspec.md).

## Critérios de Sucesso

- Tokens emitidos podem ser decodificados recuperando com 100% de exatidão os claims `jsessionid`, `idusu`, `username` e `server`.
- Tokens com assinatura alterada ou após o prazo de expiração falham na verificação lançando erro de autenticação.

## Testes da Tarefa

- [x] Testes de unidade: Geração de token com dados válidos e verificação dos claims recuperados.
- [x] Testes de unidade: Tentativa de validação com token expirado ou chave secreta incorreta.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `src/main/kotlin/com/snk/conferencia/auth/JwtProvider.kt`
- `src/test/kotlin/com/snk/conferencia/auth/JwtProviderTest.kt`
- [`techspec.md`](file:///c:/Projetos/snk-conferencia/tasks/prd-migracao-autenticacao-ktor/techspec.md)
