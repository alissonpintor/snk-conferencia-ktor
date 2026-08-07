# Especificação Técnica: Geração de Etiquetas de Volume em HTML

## Resumo Executivo

Esta especificação técnica detalha a substituição do fluxo de geração de etiquetas PDF via visualizador de relatórios do Sankhya por um endpoint que gera um layout HTML otimizado para impressão térmica. O endpoint buscará as informações da conferência/separação no ERP, as informações do endereço do parceiro, os volumes criados na tabela `TGWREV` e retornará uma resposta HTML com quebra de página por volume, código de barras Code 128 (usando JsBarcode) e chamada automática para `window.print()`.

## Arquitetura do Sistema

### Visão Geral dos Componentes

- **`src/routes/api/conferencia/volumes/imprimir/+server.ts`**: Modificado para buscar dados cadastrais e de volume, gerando a página HTML em substituição à resposta em PDF.
- **`src/lib/states/conferencia.svelte.ts`** & **`src/lib/states/recontagem.svelte.ts`**: Atualizados para enviar a quantidade de volumes informada no frontend para o endpoint `/api/conferencia/volumes/imprimir`.

### Fluxo de Dados e Banco de Dados

1. **Separação**: Busca básica de cabeçalho na view `APP_SEPARACAO` filtrando por `NUSEPARACAO`.
2. **Dados Cadastrais do Parceiro**: Consulta SQL na tabela `TGFPAR` (com joins em `TSIEND`, `TSIBAI`, `TSICID`, `TSIUFS`) para obter a Razão Social, Telefone, CEP, Tipo de Logradouro, Nome do Logradouro, Número, Bairro, Cidade e UF (Sigla).
3. **Volumes Registrados**: Consulta SQL na tabela `TGWREV` filtrando por `NUSEPARACAO` e `NUNOTA` para retornar a lista de volumes (`IDREV` e `SEQETIQUETA`).
4. **HTML Renderizado**:
   - Se os volumes em `TGWREV` forem encontrados, usa-os para gerar as etiquetas.
   - Fallback: Se não encontrar registros no banco (ex: atraso na inserção assíncrona), gera etiquetas virtuais no range de 1 até `quantidade` recebida, gerando códigos de barras no formato `[NUSEPARACAO]-[index]`.

## Design de Implementação

### Detalhes das Consultas SQL

#### Consulta de Endereço do Parceiro
```sql
SELECT 
    par.RAZAOSOCIAL,
    par.TELEFONE,
    par.CEP,
    par.NUMEND,
    par.COMPLEMENTO,
    endr.NOMEEND,
    endr.TIPO AS TIPOEND,
    bai.NOMEBAI,
    cid.NOMECID,
    ufs.UF AS UF_SIGLA
FROM TGFPAR par
LEFT JOIN TSIEND endr ON par.CODEND = endr.CODEND
LEFT JOIN TSIBAI bai ON par.CODBAI = bai.CODBAI
LEFT JOIN TSICID cid ON par.CODCID = cid.CODCID
LEFT JOIN TSIUFS ufs ON cid.UF = ufs.CODUF
WHERE par.CODPARC = :codParc
```

#### Consulta de Volumes (TGWREV)
```sql
SELECT IDREV, SEQETIQUETA, DHINC 
FROM TGWREV 
WHERE NUSEPARACAO = :nroSeparacao AND NUNOTA = :nroUnico 
ORDER BY SEQETIQUETA
```

### Layout de Impressão HTML/CSS

- **Tamanho da Página**: `@page { size: 100mm 60mm; margin: 0; }`
- **Múltiplos Volumes**: Cada etiqueta de volume será uma div de classe `label-card` de tamanho `100mm` por `60mm` com a regra CSS `page-break-after: always;`.
- **Prevenção de Transbordo**: Propriedade `overflow: hidden;` nas divs principais e truncagem de nomes de clientes muito longos.
- **Desenho do Código de Barras**: Carregamento da biblioteca JsBarcode via CDN (`https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js`) e execução no evento `window.onload`.

## Abordagem de Testes

### Testes Manuais
- Validar abertura de nova aba com a etiqueta renderizada em HTML.
- Validar que a impressão térmica do navegador se adequa perfeitamente ao tamanho da etiqueta configurada (100x60mm).
- Validar a leitura do código de barras gerado através de scanner físico ou câmera de smartphone.

## Considerações Técnicas

- **Cloudflare Compatibility**: O backend do SvelteKit é executado em Cloudflare Workers (Edge). A geração do layout por HTML puro com scripts clientes contorna as limitações de pacotes nativos de PDF ou manipulação de imagem.
- **Robustez**: O fallback para quantidade informada previne erros de experiência do usuário nos casos em que a escrita no banco de dados Sankhya demore mais do que o processamento do endpoint de impressão.
