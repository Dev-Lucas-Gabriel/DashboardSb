# SBSHOP — Controle de Caixa (com login da equipe)

Dashboard para lançar manualmente as entradas e saídas da loja, acompanhar o
lucro por dia/mês/período, com login individual e dados compartilhados em
tempo real entre você e sua equipe.

## O que ele faz

- Login individual (e-mail + senha) para cada pessoa da equipe.
- Lançamento manual de entradas (vendas) e saídas (despesas), com data e nota opcional.
- Cálculo automático de lucro líquido e margem.
- Filtro por período: intervalo de datas livre, ou atalhos ("Este mês", "7 dias", "30 dias", "Tudo").
- Gráfico de lucro por dia dentro do período escolhido.
- Gráfico de evolução do lucro nos últimos 6 meses.
- Extrato detalhado com opção de excluir lançamentos.
- Os dados ficam no banco de dados (Supabase) — todos da equipe veem os mesmos
  lançamentos, atualizados em tempo real, de qualquer aparelho.

---

## Passo 1 — Criar o banco de dados (Supabase, gratuito)

1. Crie uma conta em [supabase.com](https://supabase.com) e clique em **New project**.
2. Escolha um nome (ex: `sbshop`), uma senha de banco (guarde num lugar seguro) e a região mais próxima.
3. Espere o projeto ser criado (leva 1-2 minutos).
4. No menu lateral, vá em **SQL Editor** → **New query**.
5. Abra o arquivo `supabase/schema.sql` deste projeto, copie todo o conteúdo, cole no editor e clique em **Run**.
   Isso cria a tabela de lançamentos e as regras de acesso da equipe.
6. Vá em **Authentication → Providers** e confirme que **Email** está habilitado (já vem habilitado por padrão).
7. Vá em **Authentication → Settings** e desative "Enable email confirmations" caso queira que os logins funcionem
   imediatamente sem precisar confirmar e-mail (opcional, mas mais prático para uma equipe pequena que você mesmo cadastra).

### Criar o acesso de cada pessoa da equipe

Como são só vocês (você + 1-2 pessoas), o jeito mais simples é você mesmo criar as contas, sem precisar de tela de
cadastro pública:

1. No Supabase, vá em **Authentication → Users → Add user**.
2. Preencha o e-mail e uma senha para cada pessoa da equipe.
3. Marque **Auto Confirm User** (assim a pessoa já consegue entrar direto).
4. Repita para cada integrante.

Cada um vai usar esse e-mail e senha para entrar no painel.

### Pegar as chaves de conexão

1. No Supabase, vá em **Project Settings → API**.
2. Copie o **Project URL** e a chave **anon public**.

---

## Passo 2 — Configurar o projeto localmente

Pré-requisito: [Node.js](https://nodejs.org) instalado (versão 18 ou mais recente).

```bash
npm install
cp .env.example .env
```

Abra o arquivo `.env` e cole o **Project URL** e a chave **anon public** que você copiou:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-public
```

Depois rode:

```bash
npm run dev
```

Abra o endereço que aparecer no terminal (geralmente `http://localhost:5173`) e faça login com um dos acessos
que você criou no Supabase.

---

## Passo 3 — Colocar no ar para a equipe usar

A forma mais simples e gratuita é o **Netlify** (não precisa saber programar nem usar GitHub):

1. Rode `npm run build` — isso cria a pasta `dist/` com o site pronto.
2. Acesse [app.netlify.com/drop](https://app.netlify.com/drop) e arraste a pasta `dist` para a página.
3. Em poucos segundos o Netlify te dá um link (algo como `sbshop-caixa.netlify.app`) — é esse link que você
   compartilha com a equipe.
4. **Importante:** antes do passo 1, garanta que o arquivo `.env` está preenchido corretamente, pois as chaves
   do Supabase são "gravadas" dentro do site no momento do build.

### Alternativa com atualizações automáticas (Vercel + GitHub)

Se no futuro você for mexer no código com frequência, vale subir o projeto para um repositório no GitHub e conectar
no [vercel.com](https://vercel.com) — assim, toda vez que você atualizar o código, o site atualiza sozinho. Nesse
caso, as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` são configuradas no painel da Vercel, em
**Project Settings → Environment Variables**, em vez do arquivo `.env`.

---

## Estrutura do projeto

```
sbshop-dashboard/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── supabase/
│   └── schema.sql          # script para criar a tabela e as permissões no Supabase
└── src/
    ├── main.jsx              # ponto de entrada do React
    ├── App.jsx                # tela principal, junta tudo
    ├── index.css              # cores, fontes e estilos globais
    ├── lib/
    │   └── supabaseClient.js  # conexão com o Supabase
    ├── components/
    │   ├── Header.jsx          # topo com a marca SBSHOP e o usuário logado
    │   ├── Login.jsx           # tela de login
    │   ├── FilterBar.jsx       # filtro de período (datas + atalhos)
    │   ├── StatCard.jsx        # cartões de entradas/saídas/lucro/margem
    │   ├── Charts.jsx          # gráfico diário + gráfico dos últimos meses
    │   ├── NewEntryForm.jsx    # formulário de novo lançamento
    │   └── Ledger.jsx          # extrato (lista de lançamentos)
    ├── hooks/
    │   ├── useAuth.js          # login, logout e sessão do usuário
    │   └── useEntries.js       # busca, adiciona e remove lançamentos (com sincronização em tempo real)
    └── utils/
        └── format.js           # formatação de datas e valores em R$
```

## Segurança

- Ninguém sem login consegue ver ou alterar os lançamentos — isso é garantido pelas regras de acesso (Row Level
  Security) criadas pelo `supabase/schema.sql`.
- Qualquer pessoa logada da equipe vê e pode lançar/excluir dados de todo mundo (é um caixa único e compartilhado,
  não lançamentos separados por pessoa).
- Nunca compartilhe a **service role key** do Supabase — este projeto usa apenas a chave **anon public**, que é
  segura para ficar exposta no navegador.
