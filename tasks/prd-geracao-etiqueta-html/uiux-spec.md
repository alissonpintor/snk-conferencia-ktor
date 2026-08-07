# Especificação de UI/UX: Geração de Etiquetas de Volume em HTML

## Visão Geral Visual

A etiqueta é desenhada para um ambiente logístico de ritmo acelerado. O visual é limpo, com alto contraste (preto puro sobre fundo branco), forte peso tipográfico nas informações mais críticas (Código do Cliente, Cidade/Estado, Número do Pedido, ID do Volume) e linhas de divisão sólidas de 1.5px a 2px para separar as seções logicamente e facilitar a leitura rápida pelo conferente ou operador.

## Estrutura e Layout

- **Tamanho Físico da Etiqueta**: 100mm de largura x 60mm de altura.
- **Margens**: 3mm nas bordas internas para evitar cortes na área útil da impressora térmica.
- **Tipografia**: Família de fontes sans-serif do sistema (`system-ui`, `Segoe UI`, `Roboto`, `Helvetica Neue`), ou carregamento da fonte *Inter* para consistência perfeita em telas e impressões.
- **Grade Estrutural (Layout por Flexbox/Grid)**:
  - **Linha 1 (Cabeçalho)**: Dividida em três partes (Logo STOKY | Pedido + O.C | Dt/Hr + Conferente).
  - **Linha 2 (Cliente Principal)**: Bloco contínuo com "Código do Cliente - Nome Fantasia" em texto grande e destacado.
  - **Linha 3 (Logística)**: Três blocos (Cidade/UF | Número do Volume | Letra da Entrega).
  - **Linha 4 (Endereço Completo)**: Razão social oficial e endereço de entrega detalhado em fonte condensada e menor (9px).
  - **Linha 5 (Código de Barras)**: Código de barras centralizado com o número da etiqueta (`IDREV`) impresso à direita em tamanho grande e legível.

## Fluxo de Navegação e Impressão

1. O conferente digita os volumes no painel e confirma.
2. O sistema realiza as requisições de gravação.
3. No sucesso da gravação, o sistema dispara a abertura da aba do navegador para `/api/conferencia/volumes/imprimir`.
4. A nova aba carrega a página HTML gerada.
5. O script local inicia o processamento do código de barras usando a biblioteca JsBarcode.
6. Uma vez renderizados os vetores (SVGs) de código de barras, o sistema dispara o comando `window.print()`.
7. O operador apenas confirma a impressão na impressora térmica ativa e fecha a aba.

## Tratamento de Dados e Limitações

- **Nomes Longos de Parceiros**: Caso a Razão Social ou Endereço excedam a largura física da etiqueta, o texto fará quebra de linha automática. O tamanho da fonte foi ajustado para `9px` para garantir o encaixe seguro de endereços extensos de até 3 linhas sem transbordar a div de `60mm` de altura.
- **Estilo de Impressão**: Ocultação automática de botões, barras de ferramentas ou menus do navegador usando regras de impressão (`@media print`).
