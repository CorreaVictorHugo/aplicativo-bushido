# Bushido — Gestão de Academia de Jiu-Jitsu

Sistema web para gestão de academias de Jiu-Jitsu, com foco em controle de alunos, treinos, check-ins, graduações e comunicação.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| Banco | PostgreSQL (via Supabase) |
| Autenticação | Supabase Auth (email/senha) |
| ORM/Cliente | supabase-js |
| Formulários | React Hook Form + Zod |
| Cache/Estado | TanStack Query + Zustand |
| Deploy | Vercel |

## Funcionalidades

### Aluno
- Cadastro e login
- Check-in em treinos
- Histórico de presença
- Consulta de graduação
- Situação financeira
- Mural de comunicados

### Administrador
- Dashboard com indicadores
- Gestão de alunos (CRUD)
- Criação e gerenciamento de treinos
- Validação de check-ins
- Registro de graduações
- Controle financeiro
- Publicação de avisos e notícias
- Envio de notificações

## Estrutura do projeto

```
src/
├── app/            # Rotas do Next.js (App Router)
│   ├── cadastro/   # Cadastro de aluno
│   ├── admin/      # Área administrativa
│   └── page.tsx    # Home
├── components/     # Componentes React
├── hooks/          # Hooks personalizados
└── lib/            # Utilitários e configurações
    ├── supabase/   # Clientes Supabase (server/client)
    └── schemas/    # Schemas Zod
supabase/
└── migrations/     # Migrations do banco de dados
```

## Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/bushido.git
cd bushido

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env.local com:
# NEXT_PUBLIC_SUPABASE_URL=sua_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon

# Inicie o servidor de desenvolvimento
npm run dev
```

## Banco de dados

As migrations estão em `supabase/migrations/`. Para aplicar:

1. Acesse o SQL Editor do Supabase Dashboard
2. Execute cada migration em ordem numérica
3. Ou use o Supabase CLI: `supabase migration up`

### Principais tabelas

- **profiles** — Estende `auth.users` com role (student/admin) e status
- **students** — Dados específicos do aluno (faixa, grau, data de entrada, etc.)
- **trainings** — Treinos cadastrados (modalidade, horário, capacidade)
- **training_responsibles** — Vincula responsáveis aos treinos
- **checkins** — Registro de presença do aluno no treino
- **graduations** — Histórico de graduações do aluno
- **payments** — Controle financeiro
- **publications** — Mural de avisos e comunicados
- **notifications** — Central de notificações

## Segurança

- Autenticação via Supabase Auth (email/senha)
- Row Level Security (RLS) em todas as tabelas
- Cada usuário acessa apenas seus próprios dados
- Administradores têm visão geral
- Triggers no banco para criação atômica de perfil + aluno
- Nenhuma chave secreta exposta no frontend

## Licença

MIT
