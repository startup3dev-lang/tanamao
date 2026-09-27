# TA PRONTO

Marketplace de serviços em Teresina. Clientes procuram prestadores, enviam pedidos, recebem propostas, conversam, acompanham a execução e avaliam serviços concluídos. Prestadores se cadastram gratuitamente; o perfil só aparece no catálogo após aprovação pela equipe.

## Arquitetura

- Frontend: React, Vite e TypeScript. O catálogo e as operações usam `/api`.
- Backend: Node.js e Express, com validação de entrada, sessões em cookies HTTP-only e permissões por recurso.
- Banco: PostgreSQL 15+; migrações versionadas em `database/migrations`.
- Monetização inicial: Google AdSense (Auto ads). Não há cobrança de prestadores.
- Assinaturas futuras: tabelas preparadas, sem planos ativos, gateway ou cobrança. Ativar assinaturas exige implementar integração com o provedor de pagamento, webhooks idempotentes e regras de acesso.

## Desenvolvimento local

Para uma prévia local sem instalar PostgreSQL, execute `npm run build` e `npm run api:demo`. Abra `http://localhost:5173/tanamao/`. A demonstração guarda os dados em `.demo-db/` (ignorados pelo Git) e só aceita conexões locais. Há um prestador aprovado (`prestador.demo@tapronto.local`) e um administrador (`admin.demo@tapronto.local`), ambos com a senha `TesteLocal123!`. Crie uma conta de cliente pela interface para testar pedidos, propostas, conversa e avaliação. Estes usuários são exclusivamente de teste e não existem no banco de produção.

1. Crie um PostgreSQL 15+ vazio.
2. Copie `.env.example` para `.env` e preencha `DATABASE_URL` e `WEB_ORIGIN=http://localhost:5173`.
3. Execute `npm ci` e `npm run db:migrate`.
4. Execute `npm run db:seed` para criar as categorias iniciais.
5. Em um terminal, execute `npm run api`; em outro, `npm run dev`.
6. Verifique com `npm run check`.

O frontend local usa o proxy Vite para chamar a API em `localhost:3001`. `VITE_API_URL` deve ficar vazio no desenvolvimento local. A API lê `DATABASE_URL`, `WEB_ORIGIN`, `PORT` e `NODE_ENV` do ambiente; Node não carrega `.env` automaticamente. No Node 22, use `node --env-file=.env server/index.js` e `node --env-file=.env server/migrate.js`, ou exporte as variáveis no shell antes dos comandos acima.

Para cadastrar o primeiro administrador, registre uma conta normalmente e atribua o papel manualmente no banco com `insert into user_roles(user_id,role) values('<uuid-da-conta>','admin');`. Após conferir o perfil do prestador, o administrador chama `PATCH /api/admin/providers/<uuid>/verification` com `{ "status": "verified" }`. O cadastro de prestadores exige aprovação; não há automação de verificação documental nesta versão.

## Publicação

O servidor Oracle deve ter PostgreSQL 15+, Node 22, TLS/HTTPS e proxy reverso. Rode as migrações e o seed antes de iniciar a API. Defina `DATABASE_URL`, `WEB_ORIGIN` (origem exata do site), `NODE_ENV=production` e `PORT` no serviço do backend. Não coloque senha, URL do banco ou chaves privadas no repositório.

O workflow do GitHub Pages requer a variável de repositório `API_BASE_URL` com a URL pública HTTPS da API, sem `/api` no final. Ele executa testes, verificação de tipos e build; sem a variável, falha antes da publicação. Para uma sessão confiável nos navegadores, use domínios do mesmo site para frontend e API ou sirva ambos pelo servidor Oracle. Cookies entre domínios independentes podem ser bloqueados por políticas de terceiros.

O AdSense usa o publisher `ca-pub-8919406521141060` no workflow. A exibição exige que o domínio esteja aprovado no painel e que Auto ads esteja habilitado lá. Um `public/ads.txt` está incluído; o Google procura esse arquivo na raiz do domínio. No GitHub Pages de projeto (`/tanamao/`), o arquivo fica em um subcaminho e não substitui o `ads.txt` da raiz. Configure um domínio próprio antes de depender dessa verificação.

O código de anúncios só é carregado após a escolha explícita do visitante, e a Política de Privacidade fica em `/privacidade`. Antes da abertura pública, revise a política com os dados da entidade responsável e configure no AdSense a gestão de consentimento exigida para visitantes das regiões em que o site será acessado.

## Limites atuais

- Não há cobrança por serviço, repasse, assinatura ativa ou anúncio manual com ID de slot.
- O chat busca novas mensagens a cada cinco segundos; uma evolução possível é WebSocket ou SSE.
- A disponibilidade e distância ainda não vêm de geolocalização do prestador. O lançamento está limitado a Teresina.
- O teste integrado usa PostgreSQL em WASM para verificar migrações e fluxos da API. A conexão com a instância Oracle de produção requer os endereços e acesso ao servidor.
