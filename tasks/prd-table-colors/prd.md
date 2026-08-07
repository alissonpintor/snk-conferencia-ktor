# Documento de Requisitos de Produto (PRD) - Sistema de Cores por Status

## Visão Geral

Implementação de um sistema de coloração condicional nas linhas da tabela de separações (`table-separacoes`), com base no status (situação) de cada separação. O objetivo é permitir que o usuário identifique visualmente e de forma rápida o estado de cada separação na tabela, utilizando cores de fundo claras e cores de texto escuras. O usuário poderá personalizar as cores de cada status por meio de um modal de configuração, acessível pelo botão de engrenagem (⚙️) já existente no cabeçalho da tabela.

## Objetivos

- Aumentar a eficiência visual na identificação do estado de cada separação na tabela.
- Permitir que o usuário personalize as cores associadas a cada status conforme preferência pessoal.
- Persistir as configurações de cores no `localStorage` para que sejam mantidas entre sessões.
- Fornecer uma experiência de configuração intuitiva e integrada à interface existente.

## Histórias de Usuário

- **Como** conferente, **quero** ver as linhas da tabela coloridas de acordo com o status da separação, **para que** eu identifique rapidamente quais separações precisam da minha atenção.
- **Como** gestor, **quero** personalizar as cores de cada status, **para que** eu possa adaptar a visualização ao meu fluxo de trabalho pessoal.
- **Como** usuário, **quero** que minhas configurações de cores sejam salvas automaticamente, **para que** eu não precise reconfigurar toda vez que acessar o sistema.
- **Como** usuário, **quero** poder restaurar as cores padrão, **para que** eu possa voltar à configuração original caso não goste das alterações.

## Funcionalidades Principais

1. **Coloração Condicional de Linhas**:
    - Cada linha da tabela de separações recebe uma cor de fundo (clara) e cor de texto (escura) com base no valor da coluna `situacao`.
    - As cores devem ser aplicadas de forma que não interfiram com o highlight de hover e seleção de linha já existentes.
    - Os 12 status possíveis são:
      - Aguardando Separação
      - Enviado para Separação
      - Em Processo de Separação
      - Aguardando Conferência
      - Em Processo de Conferência
      - Conferência com Divergência
      - Aguardando Recontagem
      - Aguardando Conferência de Volumes
      - Conferência Validada
      - Concluído
      - Cancelada
      - Possui Retorno de Mercadoria

2. **Botão "Configurar Cores"**:
    - Adicionado como uma nova opção no dropdown do botão de engrenagem (⚙️) existente no componente `HeaderSelectColumns`.
    - Ao clicar, abre um modal de configuração.

3. **Modal de Configuração de Cores**:
    - Exibe todos os 12 status com seus respectivos seletores de cor.
    - Para cada status, o usuário pode configurar a cor de fundo e a cor do texto.
    - O estilo padrão segue o padrão de cores claras para o fundo e cores escuras para o texto.
    - Inclui botão "Restaurar Padrão" para resetar as cores ao valor original.
    - Inclui botão "Salvar" para confirmar as alterações.
    - Exibe preview de como a linha ficará com as cores selecionadas.

4. **Persistência no localStorage**:
    - As configurações de cores são salvas no `localStorage` ao clicar em "Salvar".
    - Ao carregar a tabela, as cores são lidas do `localStorage`.
    - Se não houver configuração salva, são usadas as cores padrão.

## Experiência do Usuário

- **Acesso**: O usuário clica no ícone de engrenagem (⚙️) no cabeçalho da tabela → vê a opção "Configurar Cores" na lista do dropdown → clica para abrir o modal.
- **Configuração**: No modal, o usuário vê todos os status em uma lista, com um preview da cor atual e inputs de cor para fundo e texto. O usuário ajusta as cores e clica em "Salvar".
- **Feedback Visual**: Imediatamente após salvar, as linhas da tabela refletem as novas cores.
- **Consistência**: O design segue os padrões do DaisyUI e TailwindCSS já utilizados no projeto.

## Restrições Técnicas de Alto Nível

- **Framework**: Svelte 5 (Runes).
- **Tabela**: `@tanstack/table-core` (Svelte Headless Table).
- **Estilo**: TailwindCSS + DaisyUI.
- **Persistência**: `localStorage` no navegador.
- **Escopo**: Apenas a tabela `table-separacoes` (tabela principal de separações). A tabela de itens (`table-separacoes-itens`) está fora de escopo.

## Fora de Escopo

- Aplicação de cores na tabela de itens de separação (`table-separacoes-itens`).
- Sincronização de configurações entre dispositivos/usuários (backend).
- Temas de cores predefinidos (apenas cores customizáveis individualmente e cores padrão).
- Exportação/importação de configurações de cores.
