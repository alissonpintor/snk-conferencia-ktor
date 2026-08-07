# Documento de Requisitos de Produto (PRD) - Filtros Avançados de Coluna

## Visão Geral

Implementação de uma funcionalidade de filtragem avançada por coluna para as tabelas de conferência e expedição. O objetivo é permitir que os usuários filtrem os dados apresentados nas tabelas de forma intuitiva e eficiente, diretamente a partir dos cabeçalhos das colunas, utilizando critérios específicos para cada tipo de dado (texto, data, número, lista).

## Objetivos

- Aumentar a eficiência dos conferentes e gestores na localização de registros específicos (separações, itens).
- Fornecer uma interface de filtragem consistente e integrada às tabelas existentes.
- Suportar múltiplos tipos de dados com estratégias de filtragem adequadas (ex: buscas textuais, intervalos de datas, seleção múltipla).
- Manter a performance da aplicação realizando a filtragem no cliente (client-side).

## Histórias de Usuário

- **Como** conferente, **quero** filtrar as separações pela "Situação" (ex: selecionar apenas "Em Separação" e "Pendente"), **para que** eu possa focar nas tarefas prioritárias.
- **Como** gestor, **quero** filtrar por um intervalo de "Dt. Separação", **para que** eu possa analisar o desempenho de um período específico.
- **Como** usuário, **quero** buscar um "Parceiro" por parte do nome, **para que** eu encontre rapidamente todos os pedidos de um cliente específico.
- **Como** usuário, **quero** ver visualmente quais colunas estão filtradas, **para que** eu não me confunda sobre quais dados estão sendo exibidos.

## Funcionalidades Principais

1.  **Interface de Filtro no Cabeçalho**:
    - Ícone de filtro em cada coluna habilitada.
    - Ao clicar, abre um Dropdown/Popover contextual (não modal) com as opções de filtro.
    - Indicador visual ativo quando um filtro está aplicado na coluna.

2.  **Tipos de Filtro Específicos**:
    - **Texto**: Campo de entrada para busca textual (contém, igual).
    - **Data**: Seleção de intervalo de datas (Data Inicial e Data Final).
    - **Número**: Intervalo numérico (Min/Max) ou valor exato.
    - **Lista (Enum)**: Checkboxes para seleção múltipla de opções disponíveis.

3.  **Controle de Filtros**:
    - Botão "Aplicar" (ou aplicação reativa/automática, a definir na UX).
    - Botão "Limpar" para remover o filtro da coluna.
    - Botão "Limpar Todos" (global da tabela, desejável).

4.  **Filtragem Client-Side**:
    - Utilização dos recursos do `@tanstack/table-core` para processar os dados em memória.

## Experiência do Usuário

- **Interação**: O usuário clica no ícone de funil no cabeçalho da coluna. Um menu dropdown aparece logo abaixo. O usuário insere os critérios e o filtro é aplicado.
- **Feedback Visual**: O ícone do funil muda de cor (ex: torna-se sólido ou colorido) para indicar que há um filtro ativo naquela coluna.
- **Consistência**: O design deve seguir os padrões do DaisyUI e TailwindCSS já utilizados no projeto.

## Restrições Técnicas de Alto Nível

- **Framework**: Svelte 5 (Runes).
- **Tabela**: `@tanstack/table-core` (Svelte Headless Table).
- **Estilo**: TailwindCSS + DaisyUI.
- **Escopo de Dados**: A filtragem será aplicada apenas aos dados carregados no cliente (Client-side filtering).
- **Persistência**: O estado dos filtros **não** será persistido (reset ao recarregar a página, conforme decisão de projeto).

## Fora de Escopo

- Filtragem Server-side (paginação e filtros via API).
- Persistência de filtros no LocalStorage ou URL (query params).
- Filtros complexos combinados (AND/OR entre colunas) através de um construtor de queries avançado (a filtragem é por coluna, implicitamente AND).
