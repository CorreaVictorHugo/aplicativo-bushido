# Guia completo de pastas e arquivos — Aplicativo Bushido

Este documento explica a estrutura atual do projeto em linguagem simples. Ele descreve o papel de cada pasta e de cada arquivo funcional, além de separar código escrito pela equipe, configurações e arquivos gerados automaticamente.

## 1. Visão geral

O Bushido é um aplicativo web de gestão de academia de Jiu-Jitsu. O frontend e a camada de servidor usam Next.js e React. O Supabase fornece autenticação, banco PostgreSQL e armazenamento de arquivos.

Fluxo simplificado:

```text
Navegador do usuário
  -> páginas e componentes React
  -> hooks e validações
  -> cliente Supabase
  -> autenticação, banco PostgreSQL e Storage
  -> políticas RLS autorizam ou recusam a operação
```

## 2. Árvore principal

```text
aplicativo-bushido/
├── public/                         Recursos públicos
├── src/                            Código principal do aplicativo
│   ├── app/                        Páginas e rotas do Next.js
│   ├── components/                 Componentes visuais reutilizáveis
│   ├── hooks/                      Lógicas React reutilizáveis
│   ├── lib/                        Configurações, tipos e validações
│   └── middleware.ts               Proteção e redirecionamento de rotas
├── supabase/
│   └── migrations/                 Histórico da estrutura do banco
├── explicacao-pastas-arquivos/     Documentação didática do projeto
├── .next/                          Build local gerado pelo Next.js
├── node_modules/                   Dependências instaladas pelo npm
└── arquivos de configuração
```

## 3. Pasta `src`

`src` significa *source*, ou código-fonte. É a pasta mais importante do projeto: contém páginas, componentes, regras de interface, consultas ao Supabase e tipos TypeScript.

### 3.1. `src/app`

É a estrutura de rotas do App Router do Next.js. Em geral, uma pasta que contém `page.tsx` vira um endereço do site. Um `layout.tsx` envolve as páginas abaixo dele com uma estrutura compartilhada.

#### `src/app/layout.tsx`

Layout raiz de toda a aplicação. Define o idioma como português, fontes, metadados do site, estilos globais e envolve todas as páginas com `Providers`. Qualquer página do app passa por esse layout.

#### `src/app/globals.css`

Arquivo de estilos globais. Carrega o Tailwind CSS e define regras visuais que devem valer para o aplicativo inteiro.

#### `src/app/favicon.ico`

Ícone pequeno mostrado na aba do navegador.

### 3.2. Rotas públicas de autenticação

Estas páginas podem ser acessadas antes de o usuário entrar na conta.

#### `src/app/cadastro/page.tsx`

Rota `/cadastro`. Monta a tela de criação de conta e inclui o componente `CadastroForm`.

#### `src/app/login/page.tsx`

Rota `/login`. Monta a tela de entrada e inclui `LoginForm`.

#### `src/app/recuperar-senha/page.tsx`

Rota `/recuperar-senha`. Exibe o formulário usado para solicitar por e-mail um link de recuperação.

#### `src/app/redefinir-senha/page.tsx`

Rota `/redefinir-senha`. Recebe o retorno do link enviado pelo Supabase e exibe o formulário de nova senha. Usa `Suspense` porque parte dos dados vem da URL no navegador.

### 3.3. `src/app/(student)`

Grupo de rotas da área do aluno. Os parênteses indicam um **route group**: servem para organizar arquivos, mas não aparecem na URL. Por isso `(student)/perfil/page.tsx` produz `/perfil`, e não `/(student)/perfil`.

#### `src/app/(student)/layout.tsx`

Layout compartilhado da área do aluno. Cria a navegação inferior com as abas Início, Check-in, Frequência, Graduação, Financeiro, Mural e Perfil. Usa `usePathname` para destacar a aba atual.

#### `src/app/(student)/page.tsx`

Rota `/`, a página inicial do aluno. Confere a sessão no servidor; visitantes vão para `/login` e administradores vão para `/admin`. Para alunos, mostra o resumo inicial, ainda com indicadores provisórios.

#### `src/app/(student)/checkin/page.tsx`

Rota `/checkin`. Espaço reservado para listar os treinos disponíveis e permitir que o aluno registre presença.

#### `src/app/(student)/frequencia/page.tsx`

Rota `/frequencia`. Espaço reservado para o histórico e os indicadores de presença do aluno.

#### `src/app/(student)/graduacao/page.tsx`

Rota `/graduacao`. Espaço reservado para mostrar faixa, grau e histórico de graduações.

#### `src/app/(student)/financeiro/page.tsx`

Rota `/financeiro`. Espaço reservado para mensalidades, pagamentos pendentes, pagos ou vencidos.

#### `src/app/(student)/mural/page.tsx`

Rota `/mural`. Espaço reservado para avisos, notícias, eventos, fotos e vídeos publicados pela academia.

#### `src/app/(student)/perfil/page.tsx`

Rota `/perfil`. Monta a página de visualização do perfil e renderiza `ProfileView`. Também fornece uma interface provisória de carregamento por meio de `Suspense`.

#### `src/app/(student)/perfil/loading.tsx`

Tela automática de carregamento da rota `/perfil`. O Next.js pode mostrá-la enquanto a página ou seus dados ainda estão sendo preparados. O efeito de blocos cinza é chamado de *skeleton*.

#### `src/app/(student)/perfil/editar/page.tsx`

Rota `/perfil/editar`. Monta a tela que contém `ProfileEdit`, usada para alterar dados permitidos do aluno.

### 3.4. `src/components`

Contém componentes React reutilizáveis. Uma página representa uma rota; um componente representa uma parte da interface ou um comportamento que pode ser encaixado em páginas.

#### `src/components/Providers.tsx`

Cria e disponibiliza o `QueryClient` do TanStack Query para toda a aplicação. Configura cache de 60 segundos e evita refazer consultas automaticamente sempre que a janela volta a receber foco.

### 3.5. `src/components/auth`

Componentes relacionados a cadastro, login e senha.

#### `CadastroForm.tsx`

Formulário de criação de conta. Integra React Hook Form, Zod e Supabase Auth. Envia nome, nascimento e telefone como metadados; o trigger do banco transforma esses dados em registros de `profiles` e `students`. Também trata carregamento, erros e confirmação de e-mail.

#### `LoginForm.tsx`

Formulário de entrada com e-mail e senha. Chama `signInWithPassword`, consulta a função do usuário e redireciona alunos ou administradores para suas áreas. Mostra mensagens específicas para credenciais inválidas, conexão e e-mail não confirmado.

#### `RecuperarSenhaForm.tsx`

Solicita o envio do e-mail de recuperação por meio de `resetPasswordForEmail`. Usa uma mensagem genérica para não revelar se determinado e-mail está cadastrado.

#### `RedefinirSenhaForm.tsx`

Valida o código recebido no link de recuperação, troca esse código por uma sessão temporária e chama `updateUser` para salvar a nova senha.

#### `ResendConfirmation.tsx`

Componente compartilhado para reenviar o e-mail de confirmação de cadastro. Controla estado de envio, sucesso, erro e limite de tentativas.

### 3.6. `src/components/student`

Componentes da área do aluno, atualmente concentrados no perfil.

#### `ProfileView.tsx`

Coordena a visualização do perfil. Usa `useStudent` para buscar os dados, mostra estados de carregamento e erro, reúne foto, status e informações e oferece os botões Editar perfil e Sair da conta.

#### `ProfileInfo.tsx`

Apresenta os dados detalhados do aluno, como faixa, grau, entrada, peso, telefone, nascimento e tempo na faixa. Também traduz valores internos do banco para textos amigáveis.

#### `ProfilePhoto.tsx`

Exibe a foto do aluno. Quando não existe foto, gera um avatar com iniciais e uma cor derivada do nome.

#### `ProfilePhotoUpload.tsx`

Interface para selecionar uma nova imagem. Verifica o arquivo, cria uma pré-visualização local e comunica a seleção ao formulário de edição.

#### `ProfileEdit.tsx`

Formulário completo de edição. Carrega os dados atuais, preenche os campos, envia uma nova foto quando necessário e atualiza a tabela `students`. Nome, telefone, peso e nascimento são editáveis pelo aluno; faixa, grau, entrada e status pertencem ao administrador.

#### `StatusBadge.tsx`

Pequeno indicador visual que transforma `active` ou `inactive` em um selo de status compreensível, com texto e cor apropriados.

### 3.7. `src/hooks`

Hooks personalizados são funções React iniciadas por `use`. Eles agrupam uma lógica reutilizável que envolve estado, efeitos, cache ou serviços externos.

#### `useSupabase.ts`

Cria e memoriza o cliente Supabase do navegador. Os componentes usam esse hook para autenticação e operações no banco sem repetir a configuração.

#### `useStudent.ts`

Usa TanStack Query para buscar o aluno autenticado e suas graduações. Guarda o resultado em cache por 60 segundos e fornece dados, carregamento, erro e função de nova tentativa.

#### `useProfilePhoto.ts`

Responsável pelo processamento e upload da foto. Valida tamanho e formato, comprime a imagem no navegador com Canvas, envia ao bucket `avatars` e devolve a URL pública.

### 3.8. `src/lib`

`lib` reúne código de apoio que não é uma página nem um componente visual: clientes de serviços, tipos e regras de validação.

### 3.9. `src/lib/supabase`

#### `client.ts`

Cria o cliente Supabase usado no navegador. Utiliza as variáveis públicas de URL e chave publicável.

#### `server.ts`

Cria o cliente Supabase para Server Components e outras execuções no servidor. Integra os cookies do Next.js para que a sessão do usuário seja reconhecida e atualizada.

#### `types.ts`

Define tipos TypeScript como `Profile`, `Student`, `Training`, `CheckIn`, `Graduation`, `Payment`, `Publication` e `Notification`. Esses tipos ajudam o editor e o compilador, mas não criam tabelas no banco.

### 3.10. `src/lib/schemas`

Schemas são regras Zod que validam dados antes de enviá-los. Cada arquivo também exporta um tipo TypeScript inferido das mesmas regras.

#### `cadastroSchema.ts`

Valida nome, e-mail, senha, confirmação, nascimento e telefone do cadastro. Também confirma se as duas senhas são iguais.

#### `loginSchema.ts`

Valida se o e-mail possui formato válido e se a senha foi preenchida.

#### `recuperarSenhaSchema.ts`

Valida o e-mail usado na solicitação de recuperação.

#### `redefinirSenhaSchema.ts`

Valida a nova senha, seus requisitos mínimos e a confirmação correspondente.

#### `perfilSchema.ts`

Valida os campos editáveis do perfil: nome, telefone, peso opcional e nascimento.

### 3.11. `src/middleware.ts`

Funciona como um porteiro antes das rotas. Lê a sessão por cookies, impede acesso não autenticado à área administrativa, verifica a função `admin` e redireciona usuários já autenticados que tentam voltar às telas de cadastro ou login.

## 4. Pasta `supabase`

Contém a definição versionada do banco. O banco real fica nos servidores do Supabase; estes arquivos registram como criá-lo ou modificá-lo.

### 4.1. `supabase/migrations`

Migration é uma alteração SQL numerada. Os arquivos devem ser aplicados em ordem.

#### `20240101000001_create_profiles_table.sql`

Cria `profiles`, que complementa `auth.users` com e-mail, função (`student` ou `admin`) e status. Ativa RLS e cria o trigger inicial de novo usuário.

#### `20240101000002_create_students_table.sql`

Cria `students`, com os dados esportivos e pessoais do aluno: nome, foto, nascimento, telefone, peso, faixa, grau e entrada. Adiciona políticas e atualização automática de `updated_at`.

#### `20240101000003_create_trainings_table.sql`

Cria `trainings`, que representa modalidade, dia da semana, horário, local, capacidade e status dos treinos.

#### `20240101000004_create_training_responsibles_table.sql`

Cria a ligação entre treinos e perfis responsáveis. Essa tabela permite que um professor ou responsável seja associado a um ou mais treinos.

#### `20240101000005_create_checkins_table.sql`

Cria os registros de presença. Um check-in começa pendente e pode ser confirmado ou recusado por responsável ou administrador.

#### `20240101000006_create_graduations_table.sql`

Cria o histórico de graduações, guardando faixa, grau, data, responsável e observações.

#### `20240101000007_create_payments_table.sql`

Cria o controle financeiro com referência, valor, data, situação e administrador responsável pelo registro.

#### `20240101000008_create_publications_table.sql`

Cria avisos, notícias, eventos e publicações com mídia, autor, data e situação de rascunho ou publicação.

#### `20240101000009_create_notifications_table.sql`

Cria notificações destinadas a todos, alunos, administradores ou um perfil específico, incluindo controle de leitura.

#### `20240101000010_create_storage_buckets.sql`

Cria buckets do Supabase Storage para avatares, imagens de publicações e uploads. Também define quem pode enviar, alterar, apagar e visualizar arquivos.

#### `20240101000011_update_auth_trigger.sql`

Atualiza `handle_new_user` para criar `profiles` e `students` automaticamente após o cadastro, usando os metadados enviados pelo formulário. Também ajusta permissões de inserção e atualização do aluno.

#### `20240101000012_fix_rls_recursion.sql`

Corrige o erro `42P17` de recursão infinita nas políticas de `profiles`. Centraliza a verificação administrativa em `is_admin()` e substitui as subconsultas autorreferentes nas políticas.

## 5. Pasta `public`

Arquivos desta pasta são entregues diretamente pelo Next.js. Por exemplo, `public/file.svg` pode ser acessado como `/file.svg`.

Os arquivos `file.svg`, `globe.svg`, `next.svg`, `vercel.svg` e `window.svg` são imagens do template inicial do Next.js. Atualmente não são essenciais ao domínio Bushido e podem ser removidos quando houver certeza de que nenhuma tela os utiliza.

## 6. Documentação e planejamento

### `README.md`

Apresentação principal do repositório: objetivo, tecnologias, instalação, funcionalidades e banco.

### `prd.md`

Documento de requisitos do produto. Descreve o que o aplicativo deve oferecer e orienta decisões funcionais.

### `tasks.md` e `lista-tarefas-app-bushido.txt`

Listas de trabalho, fases concluídas e próximos passos.

### `# Especificação do aplicativo de ge.txt`

Especificação textual anterior do sistema. Serve como referência de requisitos e contexto.

### `explicacao-pastas-arquivos/`

Pasta reservada aos materiais didáticos sobre arquitetura, tecnologias e organização do projeto. Este guia fica nela.

### `AGENTS.md`

Memória e instruções usadas por assistentes de desenvolvimento. Registra stack, estrutura, funcionalidades concluídas e regras de trabalho. Não participa da execução do aplicativo.

### `CLAUDE.md`

Arquivo de orientação para outra ferramenta de assistência por IA. Não faz parte do aplicativo em produção.

## 7. Configurações da raiz

### `package.json`

Manifesto do projeto Node.js. Lista scripts (`dev`, `build`, `start`, `lint`) e bibliotecas como Next.js, React, Supabase, Zod e TanStack Query.

### `package-lock.json`

Registra as versões exatas das dependências instaladas. Deve acompanhar o projeto no Git para manter instalações reproduzíveis.

### `tsconfig.json`

Configura o TypeScript. Ativa verificações rígidas e define o atalho `@/*`, permitindo importar `@/components/...` em vez de caminhos relativos longos.

### `next.config.ts`

Configuração geral do Next.js. Está praticamente vazio e preparado para futuras opções.

### `next-env.d.ts`

Arquivo gerado pelo Next.js para integrar seus tipos ao TypeScript. Não deve ser editado manualmente.

### `eslint.config.mjs`

Configura o ESLint, ferramenta que encontra padrões problemáticos, erros e inconsistências no código.

### `postcss.config.mjs`

Configura o PostCSS e conecta o Tailwind CSS ao processo de geração dos estilos.

### `.env.local`

Guarda configurações locais, como URL e chave publicável do Supabase. Mesmo quando contém apenas chave publicável, não deve ser enviado ao Git. Nunca deve conter `service_role` em código de frontend.

### `.gitignore`

Informa ao Git quais arquivos não devem ser versionados, como dependências, builds, logs e variáveis de ambiente.

## 8. Pastas e arquivos gerados

### `node_modules/`

Contém o código das bibliotecas instaladas por `npm install`. É grande, pode ser recriado pelo `package-lock.json` e não deve ser editado nem enviado ao Git.

### `.next/`

Saída gerada pelo Next.js durante desenvolvimento e build. Inclui código compilado, cache e arquivos temporários. Pode ser apagada para limpar cache e será recriada.

### `tsconfig.tsbuildinfo`

Cache incremental do TypeScript. Acelera verificações futuras e não contém regra de negócio.

### Pastas iniciadas por ponto

Pastas como `.git`, `.github`, `.codex`, `.claude`, `.cursor`, `.gemini`, `.antigravity` e `.aiox-core` pertencem ao versionamento ou a ferramentas de desenvolvimento. Elas podem configurar automações e assistentes, mas não são rotas nem funcionalidades do aplicativo entregue ao usuário.

## 9. Como localizar uma funcionalidade

Use este caminho mental:

```text
Endereço da página
  -> src/app/.../page.tsx
  -> componente em src/components
  -> hook em src/hooks
  -> cliente/tipo/schema em src/lib
  -> tabela e política em supabase/migrations
```

Exemplo do perfil:

```text
/perfil
  -> app/(student)/perfil/page.tsx
  -> components/student/ProfileView.tsx
  -> hooks/useStudent.ts
  -> lib/supabase/client.ts
  -> tabelas students e graduations
  -> políticas RLS das migrations
```

## 10. Glossário rápido

- **Página:** componente associado a um endereço.
- **Layout:** estrutura compartilhada por várias páginas.
- **Componente:** parte reutilizável da interface.
- **Hook:** função que encapsula lógica React reutilizável.
- **Schema Zod:** conjunto de regras para validar dados.
- **Client Component:** componente executado no navegador e marcado com `'use client'`.
- **Server Component:** componente executado no servidor por padrão.
- **Migration:** alteração versionada na estrutura do banco.
- **RLS:** regras do banco que controlam quais linhas cada usuário acessa.
- **Trigger:** função executada automaticamente pelo banco após determinado evento.
- **Storage:** armazenamento de arquivos do Supabase.
- **Sessão:** informação que identifica o usuário autenticado.
- **Cache:** cópia temporária de dados para evitar buscas desnecessárias.

---

Este documento representa a estrutura observada em 31 de julho de 2026. Ele deve ser atualizado quando novas rotas, componentes, hooks ou migrations forem adicionados.
