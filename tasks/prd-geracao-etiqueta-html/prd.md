# Documento de Requisitos de Produto (PRD) - Geração de Etiquetas de Volume em HTML

## Visão Geral

Este documento descreve a substituição do fluxo de impressão de etiquetas de volume da conferência. Atualmente, o sistema utiliza o visualizador de relatórios do ERP Sankhya, o que causa lentidão, instabilidade e erros de concorrência (como o erro `WMS_E00144`). A nova funcionalidade gerará o layout das etiquetas diretamente na API do sistema em formato HTML print-friendly, otimizado para impressoras térmicas (tamanho aproximado de 100mm x 60mm), com códigos de barras gerados localmente e abertura automática da aba de impressão ao finalizar a conferência.

## Objetivos

- **Rapidez e Estabilidade**: Eliminar a dependência do visualizador de relatórios do Sankhya, reduzindo o tempo de impressão de minutos para segundos e eliminando falhas de sincronismo.
- **Autonomia da API**: Gerar o layout visual (HTML/CSS) no próprio backend da aplicação, permitindo customizações ágeis sem necessidade de editar relatórios no ERP.
- **Experiência do Usuário (UX)**: Disparar a janela de impressão do navegador de forma automática e integrada após o conferente informar a quantidade de volumes.

## Histórias de Usuário

- Como conferente, eu quero que a tela de impressão das etiquetas de volume apareça automaticamente após eu digitar a quantidade de volumes e confirmar, para que eu não precise realizar passos adicionais ou aguardar o carregamento lento do ERP.
- Como operador de expedição, eu quero que as etiquetas impressas contenham todos os dados da nota, cliente, cidade/estado, transportadora e um código de barras escaneável do volume (`IDREV`), para que a triagem e o despacho das mercadorias ocorram sem erros.

## Funcionalidades Principais

1. **Geração Dinâmica de Etiquetas em HTML**:
   - Layout estruturado em HTML e CSS local no backend da aplicação.
   - Suporte a múltiplas etiquetas na mesma página (uma por volume registrado).
   - Quebra de página automática por etiqueta para impressoras térmicas.

2. **Detecção e Busca de Dados**:
   - Resgate dos dados da separação (`APP_SEPARACAO`): Pedido, Ordem de Carga, Nome do Conferente, Nome Fantasia do Cliente, Código do Cliente e Tipo de Entrega.
   - Resgate de dados cadastrais adicionais do cliente (`TGFPAR`): Razão Social, Endereço Completo, Bairro, CEP, Fone, Cidade e Sigla do Estado (UF).
   - Resgate dos volumes registrados (`TGWREV`): Identificador Único do Volume (`IDREV`), Sequência do Etiqueta (`SEQETIQUETA`), e Data/Hora de Inclusão (`DHINC`).
   - Mecanismo de contingência (fallback): Se por atraso do ERP os registros em `TGWREV` não forem encontrados de imediato, gerar etiquetas simuladas com base na quantidade informada pelo usuário.

3. **Código de Barras Local**:
   - Integração da biblioteca JsBarcode via script na página gerada para desenhar o código de barras (Code 128) contendo o valor do `IDREV` correspondente de cada volume de forma offline/local.

4. **Abertura Automática**:
   - Ao concluir o registro de volumes no frontend, abrir a página gerada em uma nova aba e invocar o método `window.print()` automaticamente.

## Experiência do Usuário

1. O usuário finaliza a conferência de itens no painel.
2. O componente `registrar-volume.svelte` solicita a quantidade de volumes.
3. O usuário informa o valor e clica em "Concluir".
4. O sistema registra os volumes e, imediatamente, abre uma nova aba no navegador com a página de etiquetas em HTML.
5. O diálogo de impressão do navegador abre automaticamente com as etiquetas renderizadas e prontas para envio à impressora térmica.

## Restrições Técnicas de Alto Nível

- **Tamanho do Papel**: O layout deve ser desenhado para etiquetas de dimensão de 100mm de largura por 60mm de altura, com margens zeradas.
- **Compatibilidade de Impressão**: Uso de regras CSS `@media print` para garantir que o navegador faça o dimensionamento e quebra de páginas de forma correta.
- **Acessibilidade**: Textos legíveis com alto contraste (preto no branco) para facilitar a leitura em ambiente de expedição/galpão.

## Fora de Escopo

- Customização de layouts para outros tipos de etiquetas (ex: etiquetas de gôndola, etiquetas de produtos).
- Envio de e-mail automático com as etiquetas de volume.
