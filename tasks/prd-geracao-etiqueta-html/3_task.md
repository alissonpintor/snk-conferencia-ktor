# Tarefa 3.0: Validar a etiqueta gerada em HTML de acordo com o exemplo do PDF

<critical>Ler os arquivos de prd.md, techspec.md e comparar visualmente com o arquivo tasks/etiqueta_volume.pdf</critical>

## Visão Geral

Verificar que a etiqueta gerada pelo backend em HTML está visualmente equivalente ao exemplo fornecido em `tasks/etiqueta_volume.pdf` e que a impressão térmica funciona conforme esperado, incluindo o acionamento do diálogo de impressão automático e legibilidade do código de barras.

## Subtarefas

- [ ] 3.1 Conferir os campos impressos contra a etiqueta do PDF:
  - Logotipo/Marca STOKY
  - PEDIDO, O.C, Dt/Hr e Conferente no topo
  - Código - Nome Fantasia do Cliente em destaque
  - Cidade/Estado, Volume (e.g. 1 / 3) e Tipo de Entrega no meio
  - Razão Social e Endereço Completo formatados
  - Código de barras escaneável representando o `IDREV` do volume e seu valor textual ao lado.
- [ ] 3.2 Testar a funcionalidade de abertura automática no final do processo da conferência ao registrar volumes.
- [ ] 3.3 Garantir que o diálogo de impressão seja ativado automaticamente (`window.print()`).
- [ ] 3.4 Validar o comportamento de fallback caso não existam registros em `TGWREV`.

## Critérios de Sucesso

- As etiquetas de volume impressas seguem exatamente o design de `tasks/etiqueta_volume.pdf`.
- Os códigos de barras (Code 128) são lidos com sucesso por dispositivos coletores ou smartphones.
- A quebra de página funciona perfeitamente ao gerar múltiplos volumes.

## Arquivos relevantes
- `tasks/etiqueta_volume.pdf`
- `src/routes/api/conferencia/volumes/imprimir/+server.ts`
