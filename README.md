# Lista de Tarefas

To-do list com **login** (cada usuário só vê suas próprias tarefas), feito com **Next.js**, **PostgreSQL** e **Neon Auth** (Stack Auth).

## Arquitetura

- `app/page.js` — interface (React)
- `app/api/tarefas/` — API REST (Controller + lógica de negócio), protegida por login
- `app/handler/[...stack]/` — telas de login/cadastro (prontas, do Neon Auth)
- `lib/db.js` — conexão com o banco (Repository)
- `lib/stack.js` — configuração do login
- `schema.sql` — modelagem da tabela `tarefas` (com `usuario_id`)

## Rodando localmente

### 1. Instalar dependências
```bash
npm install
```

### 2. Variáveis de ambiente
O arquivo `.env.local` já vem preenchido neste projeto. Se precisar recriar, use `.env.example` como modelo.

### 3. Rodar o projeto
```bash
npm run dev
```
Acesse http://localhost:3000 — vai pedir login (crie uma conta com e-mail/senha).

## Deploy na Vercel

1. Suba este projeto para um repositório no GitHub
2. Em [vercel.com](https://vercel.com), importe o repositório
3. Em **Environment Variables**, adicione as 4 variáveis que estão no `.env.local`
4. Clique em **Deploy**

## Próximos passos possíveis
- Adicionar categorias ou prioridades às tarefas
- Traduzir as telas de login para português
- Testes automatizados das API routes

