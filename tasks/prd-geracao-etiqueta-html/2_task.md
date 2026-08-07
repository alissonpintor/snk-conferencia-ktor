# Tarefa 2.0: Refatorar endpoint de impressão de volumes para obter dados de cadastro, buscar volumes do banco e gerar etiquetas em HTML

<critical>Ler os arquivos de prd.md e techspec.md desta pasta antes de prosseguir</critical>

## Visão Geral

Substituir a chamada ao visualizador de relatórios do Sankhya no endpoint `src/routes/api/conferencia/volumes/imprimir/+server.ts` por um fluxo local que:
1. Carrega os dados da separação (`ViewAppSeparacao`).
2. Executa a consulta SQL para obter o endereço cadastral e dados completos do parceiro (`TGFPAR`).
3. Executa a consulta SQL para listar os volumes correspondentes na tabela `TGWREV`.
4. Implementa um fallback caso a tabela `TGWREV` não retorne linhas, gerando os registros de volume simulados até o número de `quantidade` informada.
5. Renderiza a estrutura HTML/CSS com quebras de página por volume.
6. Adiciona a biblioteca JsBarcode via script na página retornada para renderizar o código de barras (Code 128) do volume (`IDREV`) e aciona a impressão automática (`window.print()`).

## Subtarefas

- [ ] 2.1 Criar uma função helper para execução de queries SQL customizadas via `DbExplorerSP.executeQuery`.
- [ ] 2.2 Buscar dados da separação utilizando a view `ViewAppSeparacao` com a classe `LoadView`.
- [ ] 2.3 Executar a consulta SQL para buscar dados cadastrais do cliente (Razão Social, Endereço, Número, Bairro, CEP, Fone, Cidade e UF/Estado sigla).
- [ ] 2.4 Executar a consulta SQL para buscar volumes cadastrados na tabela `TGWREV`.
- [ ] 2.5 Formatar o corpo da resposta em HTML print-friendly, implementando o loop para múltiplos volumes e o script do JsBarcode.
- [ ] 2.6 Definir a folha de estilo CSS com as regras `@media print` e dimensões `100mm x 60mm` para etiqueta térmica.

## Critérios de Sucesso

- O endpoint `/api/conferencia/volumes/imprimir` retorna uma página HTML com status 200 contendo as etiquetas estruturadas.
- Caso a consulta a `TGWREV` retorne zero linhas, as etiquetas virtuais ainda são geradas e renderizadas.
- O código de barras é exibido perfeitamente na página renderizada.

## Arquivos relevantes
- `src/routes/api/conferencia/volumes/imprimir/+server.ts`
