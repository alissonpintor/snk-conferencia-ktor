# Template de Documento de Requisitos de Produto (PRD)

## Visão Geral

Implementação da funcionalidade de redimensionamento de colunas nas tabelas de listagem de separações e itens de separação. A funcionalidade visa melhorar a usabilidade e leitura de dados, permitindo que os operadores ajustem a largura das colunas conforme sua necessidade e preferência.

## Objetivos

- Habilitar o redimensionamento manual das colunas pelos usuários.
- Persistir as preferências de largura de coluna do usuário, para que a configuração seja mantida entre sessões/recargas de página.
- Garantir que tabelas com muitas colunas ou com colunas muito largas possam ser visualizadas através de rolagem horizontal, evitando quebras de linha/layout indesejadas.

## Histórias de Usuário

- **Como operador de expedição**, eu quero **aumentar a largura da coluna de "Parceiro" ou "Produto"**, para que **eu possa ler o nome completo sem que o texto seja truncado**.
- **Como usuário do sistema**, eu quero **que o tamanho das colunas que eu ajustei seja salvo**, para que **eu não precise reajustar toda vez que entrar na tela**.
- **Como usuário**, eu quero **poder rolar a tabela horizontalmente**, para que **eu possa ver todas as colunas mesmo quando elas excedem a largura da tela**.

## Funcionalidades Principais

### 1. Manipulador de Redimensionamento (Resize Handle)
- **O que faz:** Adiciona uma área interativa na borda direita do cabeçalho de cada coluna redimensionável.
- **Por que é importante:** Permite que o usuário inicie a ação de redimensionamento.
- **Como funciona:** Ao passar o mouse sobre a borda, o cursor muda para indicar possibilidade de redimensionamento (`col-resize`). O usuário clica e arrasta para ajustar a largura.

### 2. Redimensionamento Visual
- **O que faz:** Atualiza a largura da coluna em tempo real ou via indicador visual enquanto o usuário arrasta.
- **Por que é importante:** Fornece feedback imediato sobre o novo tamanho da coluna.

### 3. Persistência de Estado
- **O que faz:** Salva a largura definida para cada coluna no armazenamento local do navegador (`localStorage`).
- **Por que é importante:** Mantém a consistência da interface para o usuário entre visitas.
- **Como funciona:** Ao finalizar o redimensionamento (evento de `mouseup`), a nova largura é salva associada ao ID da tabela e da coluna. Ao carregar a tabela, as larguras salvas são aplicadas.

### 4. Rolagem Horizontal
- **O que faz:** Habilita uma barra de rolagem horizontal no contêiner da tabela.
- **Por que é importante:** Permite que o usuário defina larguras grandes para as colunas sem "quebrar" o layout da página ou espremer outras colunas.

## Experiência do Usuário

- **Interação:** O usuário deve sentir que o controle é fluido. O cursor deve mudar claramente (`cursor: col-resize`) ao passar sobre a área de redimensionamento.
- **Feedback Visual:** Durante o redimensionamento, o usuário deve ter claro qual será a nova largura.
- **Reset:** (Opcional, mas boa prática) Considerar comportamento padrão caso não haja valor salvo.
- **Layout:** A tabela deve respeitar o layout fixo (`table-layout: fixed`) para que as larguras sejam obedecidas estritamente, com o contêiner permitindo `overflow-x: auto`.

## Restrições Técnicas de Alto Nível

- **Escopo de Componentes:** A implementação deve ser aplicada especificamente nos componentes `table-separacoes` e `table-separacoes-itens` localizados em `src/routes/expedicao/components/separacoes/panel/`.
- **Tecnologia:** Utilizar Svelte 5 (Runes) e CSS/TailwindCSS.
- **Sem Dependências Pesadas:** Evitar adicionar novas bibliotecas pesadas apenas para esta funcionalidade se for possível implementar com lógica simples e leve ou utilizando recursos já existentes (como `bits-ui` ou `@tanstack/table-core` se já estiver em uso e suportar). Nota: O projeto já usa `@tanstack/table-core`.
- **Performance:** O redimensionamento não deve causar "lag" perceptível na renderização da tabela.

## Fora de Escopo

- **Dispositivos Móveis:** A funcionalidade não precisa ser otimizada ou estar disponível para telas pequenas/touch.
- **Restrições de Largura:** Não haverá largura mínima ou máxima imposta (conforme solicitação do usuário), embora tecnicamente um mínimo implícito de visibilidade seja aceitável.
- **Backend Storage:** As preferências não serão salvas no banco de dados do servidor, apenas localmente (`localStorage`).
