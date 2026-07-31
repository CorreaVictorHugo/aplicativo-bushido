# PRD — Aplicativo Bushido

**Versão:** 0.1  
**Status:** Rascunho consolidado  
**Produto:** Aplicativo de gestão para academia de Jiu-Jitsu  
**Documento de origem:** `aplic-bushido.md`

---

## 1. Resumo executivo

O Aplicativo Bushido será uma plataforma móvel de gestão para academia de Jiu-Jitsu, utilizada por alunos e administradores no mesmo aplicativo, com interfaces e permissões diferentes conforme o perfil autenticado.

O produto centralizará:

- cadastro e acompanhamento de alunos;
- agenda de treinos;
- check-in e confirmação de presença;
- frequência;
- graduação e histórico de faixas e graus;
- indicadores administrativos em dashboard;
- situação e histórico financeiro simplificado;
- avisos, notícias, fotos, vídeos e notificações.

A primeira versão não será um sistema financeiro completo, não terá pagamento online e não terá cadastro formal de professores.

---

## 2. Problema

A academia precisa organizar informações esportivas e administrativas que atualmente podem estar dispersas entre planilhas, mensagens, registros manuais e ferramentas separadas.

Os principais problemas a resolver são:

1. dificuldade para manter o cadastro e a situação dos alunos atualizados;
2. ausência de um fluxo padronizado de check-in e confirmação de presença;
3. dificuldade para acompanhar frequência e alunos ausentes;
4. falta de histórico estruturado de graduações;
5. baixa visibilidade sobre indicadores da academia;
6. comunicação descentralizada entre academia e alunos;
7. falta de uma visão simples da situação financeira de cada aluno.

---

## 3. Objetivos do produto

### 3.1 Objetivo principal

Criar uma plataforma simples e centralizada para gerir alunos, treinos, presenças, graduações, comunicação e informações financeiras básicas de uma academia de Jiu-Jitsu.

### 3.2 Objetivos específicos

- Permitir que alunos façam check-in em treinos disponíveis.
- Permitir que responsáveis autorizados confirmem ou recusem check-ins.
- Registrar somente check-ins confirmados como presença válida.
- Disponibilizar o histórico de frequência por aluno.
- Manter o histórico completo de graduações sem sobrescrever registros anteriores.
- Disponibilizar um dashboard administrativo por período.
- Permitir que a academia publique comunicados e conteúdos.
- Exibir a situação de pagamento e o histórico financeiro do aluno.
- Manter um único aplicativo com experiências diferentes para aluno e administrador.

---

## 4. Não objetivos da versão 0.1

A versão inicial não contemplará:

- pagamento online;
- integração com gateway de pagamento;
- cartão, Pix ou boleto;
- emissão automática de cobranças;
- controle contábil ou financeiro avançado;
- integração com Power BI;
- cálculo automático de graduação;
- previsão automática de próxima graduação;
- decisão automática de aptidão para graduação;
- cadastro estruturado de professores;
- CPF, endereço ou documentos no cadastro dos alunos;
- contratação ou configuração definitiva da infraestrutura de produção antes da validação técnica do MVP.

---

## 5. Usuários e perfis

### 5.1 Aluno

O aluno poderá:

- criar conta;
- entrar no aplicativo;
- visualizar e atualizar dados pessoais permitidos;
- visualizar treinos disponíveis;
- fazer check-in;
- acompanhar o status do check-in;
- consultar presença e frequência;
- consultar graduação atual e histórico;
- consultar situação e histórico financeiro;
- visualizar avisos, notícias, eventos, fotos e vídeos;
- receber notificações.

O aluno não poderá:

- alterar sua própria faixa ou grau;
- alterar sua data de entrada;
- alterar seu status ativo ou inativo;
- publicar conteúdo administrativo;
- confirmar ou recusar presença, salvo se também possuir permissão administrativa específica.

### 5.2 Administrador

O administrador poderá:

- acessar o dashboard;
- cadastrar, editar, inativar e excluir alunos;
- criar e administrar treinos;
- definir responsáveis autorizados por treino;
- confirmar ou recusar check-ins;
- administrar graduações;
- registrar informações financeiras;
- publicar avisos, notícias, eventos, fotos e vídeos;
- enviar notificações;
- administrar o mural;
- consultar indicadores gerais e individuais.

### 5.3 Responsável autorizado

O responsável autorizado não será, nesta versão, um perfil independente.

Será um usuário administrativo com permissão para confirmar ou recusar check-ins de determinados treinos.

---

## 6. Escopo funcional

## 6.1 Módulo de alunos

### 6.1.1 Dados do aluno

Cada aluno terá:

- nome;
- foto;
- data de nascimento;
- telefone;
- e-mail;
- peso;
- faixa;
- grau;
- data de entrada na academia;
- status ativo ou inativo;
- observações.

### 6.1.2 Dados fora do escopo

Não serão cadastrados nesta versão:

- CPF;
- endereço;
- documentos pessoais;
- atestado médico;
- certidões ou anexos.

### 6.1.3 Operações administrativas

O administrador poderá:

- cadastrar aluno;
- editar aluno;
- inativar aluno;
- excluir aluno.

### 6.1.4 Separação entre dados de acesso e dados esportivos

**Dados preenchidos pelo aluno:**

- nome;
- foto;
- data de nascimento;
- telefone;
- e-mail;
- senha;
- confirmação de senha.

**Dados controlados pelo administrador:**

- faixa;
- grau;
- data de entrada;
- status;
- observações administrativas.

### 6.1.5 Regras de negócio

- O e-mail deve ser único por conta.
- Apenas o administrador pode definir ou alterar faixa, grau, data de entrada e status.
- Alunos inativos não podem realizar novos check-ins.
- A exclusão deve exigir confirmação.
- Recomenda-se preservar registros históricos relacionados ao aluno, mesmo após inativação.

---

## 6.2 Módulo de treinos e agenda

### 6.2.1 Definição de treino

Cada treino deverá conter:

- modalidade;
- dia da semana;
- horário;
- local;
- capacidade máxima;
- responsáveis autorizados;
- status do treino;
- lista de check-ins ou participantes.

A modalidade inicial será Jiu-Jitsu, mas o campo deverá ser editável.

### 6.2.2 Configuração administrativa

O administrador poderá:

- criar treino;
- editar treino;
- ativar ou desativar treino;
- definir dia e horário;
- definir local, como Tatame 1 ou Tatame 2;
- definir capacidade máxima;
- vincular responsáveis autorizados;
- consultar alunos que realizaram check-in.

### 6.2.3 Regra de elegibilidade

Todo aluno com status **ativo** estará habilitado a fazer check-in em qualquer treino disponível.

Na versão 0.1, não haverá vínculo fixo obrigatório entre aluno e turma.

### 6.2.4 Capacidade

O sistema deverá armazenar a capacidade máxima de cada treino.

A regra exata para impedir check-in quando a capacidade for atingida permanece pendente de definição.

---

## 6.3 Módulo de presença e check-in

### 6.3.1 Fluxo do aluno

1. O aluno acessa a área de check-in.
2. O sistema exibe os treinos disponíveis no dia.
3. O aluno seleciona um treino.
4. O aluno realiza o check-in.
5. O check-in recebe o status **Pendente**.
6. O aluno visualiza que o check-in aguarda confirmação.

### 6.3.2 Fluxo do responsável

1. O responsável acessa a área de check-ins pendentes.
2. O sistema exibe aluno, treino, data, horário e local.
3. O responsável escolhe **Confirmar** ou **Recusar**.
4. Se confirmado, o registro passa a contar como presença.
5. Se recusado, o registro não entra nos cálculos de frequência.

### 6.3.3 Status de check-in

- **Pendente:** aguardando análise.
- **Confirmado:** presença aprovada e contabilizada.
- **Recusado:** presença rejeitada e não contabilizada.

### 6.3.4 Janela de check-in

O aluno poderá fazer check-in a qualquer momento no mesmo dia da aula, entre 00:00 e 23:59.

### 6.3.5 Regras de negócio

- Apenas alunos ativos podem fazer check-in.
- Apenas usuários autorizados podem confirmar ou recusar check-ins.
- Somente check-ins confirmados entram nos indicadores de presença e frequência.
- O sistema deve impedir check-in duplicado do mesmo aluno no mesmo treino.
- Toda mudança de status deve registrar data, hora e usuário responsável.
- Um check-in recusado não poderá ser contabilizado como falta sem regra adicional explícita.

### 6.3.6 Métricas operacionais

O sistema deverá permitir acompanhar:

- total de check-ins;
- confirmados;
- recusados;
- pendentes.

---

## 6.4 Módulo de graduação

### 6.4.1 Dados de graduação

O sistema deverá registrar:

- faixa atual;
- grau atual;
- data da graduação;
- professor responsável, inicialmente como texto;
- observações;
- histórico completo de graduações;
- próxima graduação, como informação manual opcional;
- tempo na faixa, calculado a partir da data da graduação atual.

### 6.4.2 Regras de negócio

- Não haverá cálculo automático de graduação.
- Não haverá previsão automática de próxima graduação.
- O sistema não decidirá se o aluno está apto.
- A alteração será feita manualmente pelo administrador.
- Toda alteração deverá gerar um novo registro histórico.
- Registros anteriores não poderão ser apagados por uma atualização comum.
- A graduação atual deverá aparecer no perfil do aluno.

### 6.4.3 Exemplo de histórico

Faixa Branca → Grau 1 → Grau 2 → Grau 3 → Grau 4 → Faixa Azul.

---

## 6.5 Dashboard

### 6.5.1 Acesso

O dashboard ficará dentro do aplicativo e será acessível ao administrador.

### 6.5.2 Filtro de período

O administrador poderá selecionar:

- um mês; ou
- um intervalo de datas.

### 6.5.3 Indicadores gerais

- alunos ativos;
- alunos novos;
- frequência média;
- alunos ausentes;
- alunos por faixa;
- alunos por categoria;
- graduações no período.

### 6.5.4 Indicadores individuais

Para cada aluno:

- quantidade de treinos realizados;
- quantidade de faltas;
- percentual de frequência;
- histórico de presença.

### 6.5.5 Definições propostas

- **Aluno novo:** aluno cuja data de entrada esteja dentro do período selecionado.
- **Treino realizado:** presença confirmada.
- **Frequência:** presenças confirmadas divididas pelas oportunidades de treino aplicáveis.
- **Aluno ausente:** definição pendente, pois o produto ainda não define vínculo fixo do aluno com turmas ou obrigação de comparecimento.
- **Falta:** definição pendente pelo mesmo motivo.

A versão 0.1 deve evitar apresentar faltas e frequência com uma fórmula ambígua. Esses indicadores só deverão ser liberados após definição clara do denominador.

---

## 6.6 Módulo financeiro simplificado

### 6.6.1 Escopo

O sistema exibirá apenas informação administrativa básica.

### 6.6.2 Funcionalidades

- situação de pagamento do aluno;
- indicação visual de aluno em dia;
- histórico de pagamentos.

### 6.6.3 Fora do escopo

- pagamento online;
- gateway;
- cartão;
- Pix;
- boleto;
- emissão de cobrança;
- fluxo de caixa;
- conciliação;
- contabilidade;
- cobrança automática.

### 6.6.4 Dados mínimos sugeridos por registro

- aluno;
- competência ou referência;
- data de pagamento;
- valor;
- status;
- observação;
- usuário que registrou.

O campo de valor é recomendado para tornar o histórico útil, mas deverá ser confirmado pelo responsável do produto.

---

## 6.7 Módulo de comunicação

### 6.7.1 Conteúdos

- avisos da academia;
- notificações;
- mural;
- mensagens direcionadas;
- notícias e eventos;
- fotos;
- vídeos do YouTube.

### 6.7.2 Permissões

O administrador poderá:

- criar, editar e excluir publicações;
- publicar fotos;
- cadastrar links de vídeos do YouTube;
- enviar notificações;
- administrar o mural.

O aluno poderá:

- visualizar conteúdos;
- receber notificações;
- acessar vídeos publicados.

### 6.7.3 Pendência

O fluxo de “mensagem professor → aluno” depende da definição de como professores serão representados, pois não haverá cadastro formal de professores na versão inicial.

---

## 6.8 Autenticação e controle de acesso

### 6.8.1 Perfis

- Aluno;
- Administrador.

### 6.8.2 Fluxo de cadastro do aluno

1. O aluno seleciona **Criar conta**.
2. Preenche seus dados pessoais e de acesso.
3. O sistema valida os dados.
4. A conta é criada.
5. O aluno entra no aplicativo.

### 6.8.3 Login

Após autenticação, o sistema identifica o perfil e direciona:

- aluno para a tela inicial do aluno;
- administrador para o dashboard administrativo.

### 6.8.4 Requisitos mínimos de segurança

- senha armazenada de forma segura e nunca em texto puro;
- recuperação de senha;
- sessão autenticada;
- controle de permissões por perfil;
- proteção de rotas administrativas;
- registro de ações administrativas críticas;
- bloqueio de acesso para usuário inativo;
- política de privacidade e tratamento de dados pessoais.

### 6.8.5 Conta administrativa

O método de criação da primeira conta administrativa permanece pendente.

---

## 7. Fluxos principais

## 7.1 Cadastro e acesso do aluno

Criar conta → preencher dados → validar e-mail e senha → criar perfil → acessar aplicativo.

## 7.2 Check-in

Aluno ativo → visualiza treino do dia → faz check-in → status pendente → responsável confirma ou recusa → presença atualizada.

## 7.3 Graduação

Administrador abre perfil → registra nova faixa ou grau → informa data e responsável → salva → sistema preserva histórico → perfil exibe graduação atual.

## 7.4 Publicação de comunicado

Administrador cria publicação → adiciona texto e mídia ou link → define público → publica → alunos visualizam → notificação opcional é enviada.

## 7.5 Registro financeiro

Administrador abre perfil do aluno → adiciona registro de pagamento → atualiza situação → aluno consulta histórico e status.

---

## 8. Requisitos funcionais

### RF-001 — Cadastro de aluno

O sistema deve permitir que um aluno crie sua conta com dados pessoais e credenciais de acesso.

### RF-002 — Gestão administrativa de aluno

O sistema deve permitir ao administrador cadastrar, editar, inativar e excluir alunos.

### RF-003 — Controle de dados esportivos

O sistema deve restringir a alteração de faixa, grau, data de entrada e status ao administrador.

### RF-004 — Agenda de treinos

O sistema deve exibir os treinos disponíveis organizados por dia, horário e local.

### RF-005 — Gestão de treinos

O administrador deve poder criar, editar, ativar e desativar treinos.

### RF-006 — Check-in do aluno

O aluno ativo deve poder realizar check-in em treinos disponíveis no mesmo dia da aula.

### RF-007 — Validação de check-in

O responsável autorizado deve poder confirmar ou recusar check-ins pendentes.

### RF-008 — Registro de presença

O sistema deve contabilizar somente check-ins confirmados como presença.

### RF-009 — Histórico de graduação

O sistema deve preservar todas as alterações de faixa e grau do aluno.

### RF-010 — Dashboard por período

O administrador deve poder consultar indicadores por mês ou intervalo de datas.

### RF-011 — Situação financeira

O sistema deve permitir registrar e consultar a situação e o histórico de pagamentos do aluno.

### RF-012 — Comunicação

O administrador deve poder publicar avisos, notícias, eventos, fotos e vídeos.

### RF-013 — Notificações

O sistema deve permitir o envio de notificações aos alunos.

### RF-014 — Perfis de acesso

O sistema deve exibir funcionalidades e telas conforme o perfil autenticado.

### RF-015 — Auditoria de presença

O sistema deve registrar quem confirmou ou recusou um check-in e quando a ação ocorreu.

---

## 9. Requisitos não funcionais

### RNF-001 — Usabilidade

A interface deve ser simples, legível e adequada para uso rápido em celular.

### RNF-002 — Desempenho

As telas principais devem carregar rapidamente em conexão móvel comum.

### RNF-003 — Segurança

Dados pessoais e credenciais devem ser protegidos conforme boas práticas de segurança.

### RNF-004 — Privacidade

O produto deve respeitar a LGPD, coletando apenas dados necessários para sua finalidade.

### RNF-005 — Disponibilidade

O sistema deve preservar dados mesmo após encerramento inesperado do aplicativo.

### RNF-006 — Integridade

Históricos de presença, graduação e financeiro não devem ser sobrescritos sem rastreabilidade.

### RNF-007 — Compatibilidade

A aplicação deve funcionar no navegador, com abordagem mobile-first e interface responsiva para celulares Android e iPhone. Também deverá permanecer utilizável em tablets e computadores, sem depender de publicação em lojas de aplicativos.

### RNF-008 — Escalabilidade funcional

A estrutura deve permitir futuramente cadastro de professores, pagamentos online, Power BI e novas modalidades.

---

## 10. Critérios de aceite do MVP

O MVP será considerado funcional quando:

1. um aluno conseguir criar conta e entrar no aplicativo;
2. o administrador conseguir criar e gerenciar alunos;
3. o administrador conseguir criar treinos com dia, horário, local e capacidade;
4. um aluno ativo conseguir visualizar os treinos do dia;
5. o aluno conseguir fazer check-in uma única vez por treino;
6. o check-in ficar pendente até análise;
7. um responsável autorizado conseguir confirmar ou recusar;
8. somente o check-in confirmado gerar presença;
9. o aluno conseguir consultar seu histórico de presença;
10. o administrador conseguir alterar faixa e grau mantendo histórico;
11. o dashboard exibir ao menos alunos ativos, alunos novos, presenças e graduações por período;
12. o administrador conseguir registrar o status financeiro e pagamentos;
13. o aluno conseguir consultar sua situação financeira;
14. o administrador conseguir publicar um aviso;
15. o aluno conseguir visualizar o aviso e receber notificação;
16. as áreas administrativas ficarem inacessíveis para alunos comuns.

---

## 11. Métricas de sucesso

### 11.1 Adoção

- percentual de alunos ativos com conta criada;
- usuários ativos semanais;
- percentual de treinos com check-in digital.

### 11.2 Operação

- quantidade de check-ins por período;
- tempo médio para confirmação de check-in;
- percentual de check-ins pendentes ao fim do dia;
- percentual de cadastros completos.

### 11.3 Engajamento

- frequência de acesso ao aplicativo;
- visualizações de comunicados;
- taxa de abertura de notificações;
- consultas ao histórico de graduação e frequência.

### 11.4 Qualidade

- taxa de erro no login;
- taxa de falha no check-in;
- incidentes de duplicidade de presença;
- reclamações relacionadas a dados incorretos.

---

## 12. Estrutura conceitual de dados

Esta seção não define banco de dados, mas identifica as entidades principais.

### 12.1 Usuário

- identificador;
- e-mail;
- senha protegida;
- perfil;
- status;
- data de criação.

### 12.2 Aluno

- usuário associado;
- nome;
- foto;
- data de nascimento;
- telefone;
- peso;
- data de entrada;
- status;
- observações.

### 12.3 Treino

- modalidade;
- dia;
- horário;
- local;
- capacidade;
- status;
- responsáveis autorizados.

### 12.4 Check-in

- aluno;
- treino;
- data da aula;
- data e hora do check-in;
- status;
- responsável pela decisão;
- data e hora da decisão.

### 12.5 Graduação

- aluno;
- faixa;
- grau;
- data;
- professor responsável em texto;
- observação.

### 12.6 Registro financeiro

- aluno;
- referência;
- valor opcional;
- data;
- status;
- observação.

### 12.7 Publicação

- tipo;
- título;
- conteúdo;
- mídia ou link;
- autor;
- data de publicação;
- status.

### 12.8 Notificação

- destinatário ou público;
- título;
- mensagem;
- data de envio;
- status de leitura.

---

## 13. Navegação sugerida

### 13.1 Área do aluno

- Início;
- Check-in;
- Frequência;
- Graduação;
- Financeiro;
- Mural;
- Perfil.

### 13.2 Área do administrador

- Dashboard;
- Alunos;
- Treinos;
- Check-ins;
- Graduações;
- Financeiro;
- Comunicação;
- Configurações.

---

## 14. Priorização do MVP

### Prioridade P0 — Essencial

- autenticação;
- perfis aluno e administrador;
- cadastro e gestão de alunos;
- agenda de treinos;
- check-in;
- confirmação e recusa;
- presença e histórico;
- graduação e histórico;
- controle de acesso.

### Prioridade P1 — Importante

- dashboard básico;
- financeiro simplificado;
- mural e avisos;
- notificações;
- fotos e vídeos do YouTube.

### Prioridade P2 — Posterior

- mensagens individuais;
- dashboard avançado;
- exportações;
- Power BI;
- pagamentos online;
- cadastro de professores;
- automações de graduação.

---

## 15. Arquitetura e tecnologias recomendadas

### 15.1 Diretriz técnica

Para o MVP, o produto será uma aplicação web responsiva, com abordagem **mobile-first**. O acesso ocorrerá por endereço web no navegador, sem publicação inicial na Google Play ou App Store.

A interface deverá ser otimizada para uso em celulares, mas também deverá funcionar em tablets e computadores. A arquitetura deve ser simples, modular e de baixo custo operacional, permitindo evolução futura para uma PWA instalável ou aplicativo nativo, sem que isso faça parte do escopo inicial.

### 15.2 Front-end web

**Tecnologias recomendadas:**

- Next.js;
- React;
- TypeScript;
- Tailwind CSS;
- componentes acessíveis e reutilizáveis;
- design responsivo com prioridade para telas pequenas.

O Tailwind CSS poderá ser utilizado normalmente no front-end. Ele será responsável pela estilização, responsividade, espaçamentos, tipografia, estados visuais e padronização da interface.

A aplicação deverá utilizar a mesma base web para alunos e administradores. Após o login, menus, telas e permissões serão exibidos conforme o perfil do usuário.

### 15.3 Experiência mobile-first

A interface deverá ser projetada inicialmente para celulares, considerando:

- navegação inferior ou menu compacto;
- botões e áreas de toque adequados;
- formulários simples;
- carregamento rápido em redes móveis;
- telas adaptadas a diferentes larguras;
- ausência de dependência de gestos exclusivos de aplicativos nativos;
- suporte aos navegadores móveis atuais.

Em uma etapa futura, a aplicação poderá ser configurada como PWA, permitindo instalação opcional na tela inicial do celular. Essa instalação não exigirá publicação em loja, mas não é obrigatória para o primeiro MVP.

### 15.4 Backend e banco de dados

**Tecnologia recomendada para o MVP:** Supabase.

Componentes previstos:

- PostgreSQL como banco de dados relacional;
- Supabase Auth para cadastro, login, recuperação de senha e sessões;
- Row Level Security para restringir dados conforme usuário e perfil;
- Supabase Storage para fotos e arquivos de mídia;
- Edge Functions para regras que não devem ser executadas diretamente no navegador;
- Realtime somente em fluxos que realmente precisarem de atualização imediata.

O PostgreSQL é adequado para representar alunos, treinos, check-ins, presenças, graduações, pagamentos e permissões, pois esses dados possuem relações e exigem integridade.

### 15.5 API e regras de negócio

A primeira versão poderá utilizar os clientes oficiais do Supabase, protegidos por políticas de acesso. Regras sensíveis deverão ser executadas no servidor, especialmente:

- confirmação ou recusa de check-in;
- alteração de faixa e grau;
- ativação ou inativação de aluno;
- atualização da situação financeira;
- cálculo dos indicadores do dashboard;
- envio de notificações;
- criação e alteração de permissões administrativas.

Caso o produto cresça e exija integrações mais complexas, poderá ser criado posteriormente um backend dedicado com Node.js, TypeScript e NestJS, mantendo o PostgreSQL.

### 15.6 Notificações

No MVP, as comunicações poderão ocorrer dentro da própria aplicação, por meio de uma central de notificações e avisos.

Notificações por e-mail poderão ser adicionadas para eventos como:

- confirmação ou recusa de check-in;
- publicação de aviso geral;
- novo evento ou notícia;
- alteração administrativa relevante;
- recuperação de senha.

Web Push poderá ser avaliado posteriormente. Como o sistema será acessado pelo navegador, não serão utilizados inicialmente Expo Notifications, Firebase Cloud Messaging para aplicativo nativo ou tokens de dispositivos móveis.

### 15.7 Fotos, vídeos e conteúdo

- Fotos de perfil e imagens do mural: Supabase Storage;
- vídeos: links do YouTube, sem upload ou hospedagem própria no MVP;
- conteúdo textual: PostgreSQL;
- imagens com limites de tamanho e compressão antes do envio.

### 15.8 Estado, dados e formulários

Bibliotecas sugeridas:

- TanStack Query para consultas, cache e sincronização de dados remotos;
- React Hook Form para formulários;
- Zod para validação;
- Zustand apenas para estados globais simples;
- date-fns para tratamento de datas;
- biblioteca de componentes compatível com Tailwind CSS, quando necessária.

A equipe deverá evitar duplicar no estado global dados já controlados pelo cache das consultas.

### 15.9 Segurança e privacidade

Requisitos técnicos mínimos:

- comunicação exclusivamente por HTTPS;
- senhas administradas pelo serviço de autenticação;
- políticas de acesso no banco por perfil e propriedade do registro;
- separação entre permissões de aluno e administrador;
- validação no servidor para operações críticas;
- registro de alterações administrativas relevantes;
- proteção de chaves e segredos em variáveis de ambiente;
- backups do banco de dados;
- exclusão lógica preferencial para preservar históricos;
- adequação à LGPD;
- proteção contra acesso direto a rotas administrativas;
- validação de sessão no servidor quando aplicável.

### 15.10 Testes e qualidade

Ferramentas e práticas recomendadas:

- ESLint e Prettier;
- TypeScript em modo estrito;
- testes unitários com Vitest ou Jest;
- testes de componentes com React Testing Library;
- testes de fluxos críticos com Playwright;
- validação das regras do banco em ambiente separado;
- revisão de código antes da integração.

Fluxos prioritários para testes automatizados:

1. cadastro e login;
2. bloqueio de aluno inativo;
3. criação de treino;
4. realização de check-in;
5. confirmação e recusa;
6. contabilização de presença;
7. alteração de graduação com preservação do histórico;
8. restrição de acesso por perfil;
9. responsividade das telas principais em celulares.

### 15.11 Hospedagem, entrega e ambientes

Deverão existir, no mínimo:

- ambiente de desenvolvimento;
- ambiente de homologação;
- ambiente de produção.

Recomendações:

- Git e GitHub para versionamento;
- GitHub Actions para lint, tipos e testes;
- Vercel para hospedagem do front-end Next.js;
- Supabase para banco, autenticação e armazenamento;
- migrações versionadas do banco de dados;
- monitoramento de erros com Sentry ou serviço equivalente;
- domínio próprio com HTTPS.

Não fazem parte do escopo inicial:

- compilação para Android ou iOS;
- publicação na Google Play;
- publicação na App Store;
- EAS Build ou EAS Submit.

### 15.12 Arquitetura lógica resumida

```text
Usuário no navegador do celular
        │
        ▼
Aplicação web Next.js + React + TypeScript + Tailwind CSS
        │
        ├── Autenticação ─────────── Supabase Auth
        ├── Dados do produto ─────── PostgreSQL / Supabase
        ├── Fotos e imagens ──────── Supabase Storage
        ├── Regras sensíveis ─────── Edge Functions
        └── Avisos internos/e-mail ─ Serviço de notificações

A mesma aplicação atende:
        ├── Área do aluno
        └── Área administrativa
```

### 15.13 Decisões técnicas a validar antes do desenvolvimento

- definir se o MVP será apenas responsivo ou também PWA instalável;
- definir os navegadores móveis mínimos suportados;
- escolher a biblioteca de componentes visuais;
- definir identidade visual e design system no Tailwind CSS;
- estimar quantidade inicial de alunos e academias;
- definir política de retenção e exclusão de dados;
- definir necessidade de funcionamento offline;
- validar custos dos serviços conforme uso estimado;
- decidir se o projeto atenderá uma única academia ou várias organizações desde o início.

---

## 16. Riscos e dependências

### 16.1 Frequência e faltas sem vínculo fixo

Como todo aluno ativo pode fazer check-in em qualquer treino e não existe turma obrigatória, o sistema não possui uma base clara para determinar quantas aulas o aluno deveria ter frequentado. Isso afeta o cálculo de frequência, faltas e alunos ausentes.

### 16.2 Contradição na definição de turma

O documento de origem informa inicialmente que não haverá nome de turma, mas depois apresenta uma estrutura com nome, categoria e professor. O PRD adota o conceito de **treino agendado**, sem exigir nome de turma no MVP.

### 16.3 Professor sem entidade própria

Professor responsável aparece em treinos, graduações e mensagens, mas não haverá cadastro de professores. No MVP, o nome poderá ser armazenado como texto e as permissões operacionais serão atribuídas a administradores autorizados.

### 16.4 Capacidade máxima

A capacidade é armazenada, porém não está definido se check-ins pendentes reservam vaga ou se apenas confirmações contam para o limite.

### 16.5 Exclusão de aluno

Excluir fisicamente um aluno pode comprometer históricos. Recomenda-se priorizar inativação e restringir exclusão definitiva.

### 16.6 Criação da conta administrativa

A forma de criar, aprovar e recuperar contas administrativas ainda precisa ser definida.

---

## 17. Decisões pendentes

1. Como calcular frequência quando o aluno não possui turma obrigatória?
2. O que caracteriza uma falta?
3. Após quantos dias sem presença um aluno será considerado ausente?
4. Check-in pendente ocupa uma vaga da capacidade máxima?
5. O sistema bloqueará check-in quando a capacidade for atingida?
6. Haverá cancelamento de check-in pelo aluno?
7. O responsável poderá reverter uma confirmação ou recusa?
8. O professor responsável será somente texto ou futuro usuário relacionado?
9. Haverá categorias de aluno no MVP?
10. O valor será obrigatório no histórico financeiro?
11. Mensagens serão individuais ou apenas comunicados gerais?
12. Como será criada a primeira conta administrativa?
13. Será necessário validar e-mail no cadastro?
14. O aluno recém-cadastrado ficará ativo automaticamente ou dependerá de aprovação?
15. A exclusão definitiva de alunos será realmente permitida?

---

## 18. Roadmap sugerido

### Fase 1 — Fundação

- autenticação;
- perfis e permissões;
- cadastro de alunos;
- navegação básica.

### Fase 2 — Operação esportiva

- treinos;
- agenda;
- check-in;
- confirmação de presença;
- histórico.

### Fase 3 — Graduação e indicadores

- histórico de graduações;
- dashboard básico;
- filtros por período.

### Fase 4 — Administração e comunicação

- financeiro simplificado;
- mural;
- avisos;
- fotos;
- vídeos;
- notificações.

### Fase 5 — Evoluções futuras

- cadastro de professores;
- pagamentos online;
- mensagens individuais;
- relatórios avançados;
- integração com Power BI.

---

## 19. Definição de pronto

Uma funcionalidade será considerada pronta quando:

- atender aos critérios de aceite;
- respeitar permissões de acesso;
- possuir tratamento de erro;
- manter integridade dos dados;
- funcionar em telas móveis suportadas;
- passar por testes funcionais;
- possuir mensagens claras ao usuário;
- registrar ações administrativas críticas quando aplicável;
- não introduzir regressões nos fluxos existentes.

---

## 20. Conclusão

O MVP do Aplicativo Bushido deve priorizar a operação diária da academia: alunos, treinos, check-ins, presenças e graduações. Dashboard, financeiro simplificado e comunicação complementam o produto, mas devem ser implementados sem ampliar o escopo para pagamentos, contabilidade ou automações complexas.

As principais decisões que precisam ser resolvidas antes do desenvolvimento são a fórmula de frequência, a definição de falta, o comportamento da capacidade dos treinos e a representação de professores e responsáveis.
