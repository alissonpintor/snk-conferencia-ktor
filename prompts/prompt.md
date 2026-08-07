Analise os modulos de autenticação e autorização e melhore o codigo aplicando as melhores praticas do Svelte 5, TypeScript e Tailwind CSS. Use as skills que estão no arquivo ./agent/skills/svelte5-best-practices.

A estrutura atual de autenticação do projeto é:

src/
├── lib/
│   ├── assets/
│   ├── components/
│   ├── utils/
│   └── types/
├── routes/
│   ├── +page.svelte  --Componente que faz a autenticação
│   ├── +page.server.ts  --Validação de dados enviados pelo formulário e autenticação na api da Sankhya
│   ├── logoff/
│   │   ├── +server.ts
└── hooks.server.ts --Validação de sessão e configuração de rotas protegidas atraves do jsessionid

1. Somente nas melhores praticas
2. Usar as já instaladas
3. Dektop-first
4. Nenhum
5. Somente login

Manter a estrutura em ./tasks/prd-auth-refactor/