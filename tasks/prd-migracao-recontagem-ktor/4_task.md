# Tarefa 4.0: Documentação OpenAPI / Swagger (`documentation.yaml`)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Documentar os 6 novos endpoints do módulo de Recontagem e seus respectivos DTOs de requisição e resposta na especificação OpenAPI OpenAPI 3.0 em `backend/src/main/resources/openapi/documentation.yaml`, garantindo que a documentação interativa via Swagger UI (`/swagger`) reflita fielmente a nova API.

<requirements>
- Adicionar os schemas dos DTOs de Recontagem (`IniciarRecontagemRequest`, `IniciarRecontagemResponse`, `ProximaRecontagemRequest`, `ItemRecontagemResponse`, `InfoProdutoRecontagemRequest`, `EnviarRecontagemRequest`, `CancelarRecontagemRequest`, `RecontagemActionResponse`) na seção `components/schemas`.
- Mapear os 6 novos endpoints sob a tag `Recontagem`:
  - `POST /api/v1/recontagem/iniciar`
  - `POST /api/v1/recontagem/proxima`
  - `POST /api/v1/recontagem/info-produto`
  - `POST /api/v1/recontagem/enviar`
  - `POST /api/v1/recontagem/cancelar`
  - `POST /api/v1/recontagem/info`
- Declarar o cabeçalho de autenticação Bearer JWT para cada endpoint.
- Validar se a rota Swagger UI (`/swagger`) renderiza sem erros de sintaxe YAML.
</requirements>

## Subtarefas

- [ ] 4.1 Editar o arquivo `backend/src/main/resources/openapi/documentation.yaml`.
- [ ] 4.2 Declarar os schemas de dados no bloco `components/schemas`.
- [ ] 4.3 Declarar a documentação das 6 rotas HTTP no bloco `paths`.
- [ ] 4.4 Iniciar a aplicação localmente (`./gradlew run`) e validar visualmente os schemas na UI do Swagger.
- [ ] 4.5 Atualizar o arquivo `README.md` mencionando o módulo de Recontagem se necessário.

## Detalhes de Implementação

Verifique a estrutura existente em `backend/src/main/resources/openapi/documentation.yaml` para manter a consistência de tags, nomenclatura de propriedades e exemplos em YAML.

## Critérios de Sucesso

- O arquivo `documentation.yaml` é considerado válido pela sintaxe OpenAPI 3.0.
- Todos os 6 endpoints e DTOs aparecem corretamente formatados no Swagger UI (`http://localhost:8080/swagger`).

## Testes da Tarefa

- [ ] Testes de unidade (Validação de parse/sintaxe do arquivo `documentation.yaml` via teste automatizado ou linting YAML)
- [ ] Testes de integração (Verificação da rota Swagger UI `/swagger`)

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes
- `backend/src/main/resources/openapi/documentation.yaml`
- `README.md`
