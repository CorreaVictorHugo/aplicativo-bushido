# Especificação do aplicativo de gestão para academia

## 1. Visão geral do projeto

Quero desenvolver um aplicativo de gestão para uma academia física, utilizando como referência funcional o aplicativo Alliance Jiu Jitsu.

A referência será utilizada apenas para compreender a estrutura dos módulos, os fluxos de navegação e as funcionalidades oferecidas. O novo aplicativo deverá possuir nome, identidade visual, textos, imagens, banco de dados e código próprios.

O sistema deverá centralizar o gerenciamento dos alunos, professores, treinos, horários, agendamentos, presenças, planos, pagamentos, avaliações físicas e comunicados da academia.

O arquivo de referência organiza a plataforma em áreas como gestão de atletas, controle de presença, treinos, agenda, comunicação, financeiro e avaliação física.

## 2. Objetivo principal

O aplicativo terá como objetivo facilitar a administração da academia e melhorar a experiência dos alunos.

A principal funcionalidade da primeira versão será o agendamento de treinos e aulas, permitindo que o aluno consulte horários, reserve vagas, faça check-in, cancele reservas e entre em listas de espera.

## 3. Tipos de usuário

O sistema deverá possuir quatro tipos principais de acesso:

### 3.1 Aluno

O aluno poderá:

* Criar e atualizar seu perfil;
* Consultar horários;
* Agendar treinos e aulas;
* Cancelar ou reagendar reservas;
* Fazer check-in;
* Entrar em uma lista de espera;
* Consultar sua frequência;
* Visualizar sua ficha de treino;
* Consultar avaliações físicas;
* Acompanhar seu plano;
* Consultar mensalidades;
* Receber comunicados;
* Visualizar notificações.

### 3.2 Professor

O professor poderá:

* Consultar sua agenda;
* Visualizar alunos agendados;
* Registrar presença;
* Criar fichas de treino;
* Atualizar exercícios e atividades;
* Registrar observações;
* Acompanhar a evolução dos alunos;
* Realizar avaliações físicas;
* Publicar comunicados;
* Bloquear horários indisponíveis.

### 3.3 Recepção

A recepção poderá:

* Cadastrar alunos;
* Atualizar dados cadastrais;
* Agendar alunos manualmente;
* Confirmar presença;
* Consultar planos;
* Registrar pagamentos;
* Verificar mensalidades pendentes;
* Gerenciar documentos;
* Consultar turmas e horários.

### 3.4 Administrador

O administrador terá acesso completo ao sistema e poderá:

* Gerenciar alunos e professores;
* Criar modalidades e turmas;
* Definir horários;
* Configurar limites de vagas;
* Gerenciar planos;
* Controlar pagamentos;
* Criar regras de agendamento;
* Enviar comunicados;
* Consultar relatórios;
* Gerenciar permissões;
* Configurar unidades da academia.

# 4. Módulos do aplicativo

## 4.1 Gestão de alunos

O sistema deverá permitir o cadastro completo dos alunos, incluindo:

* Nome completo;
* Data de nascimento;
* CPF;
* Telefone;
* E-mail;
* Endereço;
* Contato de emergência;
* Foto;
* Objetivo do aluno;
* Modalidade praticada;
* Categoria ou faixa etária;
* Peso;
* Altura;
* Restrições médicas;
* Observações;
* Data de matrícula;
* Situação do cadastro;
* Plano contratado.

Também deverá ser possível:

* Editar o cadastro;
* Desativar um aluno;
* Consultar o perfil individual;
* Armazenar documentos;
* Enviar atestado médico;
* Enviar autorizações;
* Visualizar e baixar documentos.

O arquivo de referência prevê cadastro, informações pessoais, categoria, peso, fotografia e armazenamento de documentos do atleta.

## 4.2 Agenda e agendamento

Este será o principal módulo da primeira versão.

O aluno deverá conseguir:

* Visualizar o calendário de aulas;
* Filtrar por modalidade;
* Filtrar por professor;
* Filtrar por unidade;
* Consultar horários disponíveis;
* Visualizar o número de vagas;
* Reservar uma vaga;
* Cancelar a reserva;
* Reagendar;
* Fazer check-in;
* Entrar na lista de espera;
* Receber uma notificação quando surgir uma vaga;
* Consultar seus próximos agendamentos;
* Consultar o histórico de reservas.

O arquivo utilizado como referência inclui consulta de horários, reserva, check-in, cancelamento, lista de espera e aviso quando uma vaga é liberada.

### Regras de agendamento

O administrador deverá conseguir configurar:

* Quantidade máxima de alunos por aula;
* Prazo mínimo para agendamento;
* Prazo mínimo para cancelamento;
* Limite de reservas por dia;
* Limite de reservas por semana;
* Tolerância para atrasos;
* Período permitido para check-in;
* Penalidade por ausência;
* Bloqueio temporário após faltas;
* Prioridade da lista de espera;
* Bloqueio de alunos inadimplentes;
* Modalidades permitidas por plano;
* Horários exclusivos para determinados planos.

## 4.3 Gestão de turmas e treinos

O sistema deverá permitir:

* Criar modalidades;
* Criar turmas;
* Definir dias e horários;
* Associar um professor;
* Definir capacidade máxima;
* Informar duração da aula;
* Definir nível da turma;
* Definir faixa etária;
* Cadastrar local ou sala;
* Registrar atividades realizadas;
* Consultar histórico dos treinos;
* Acompanhar a evolução do aluno.

A estrutura de referência prevê cadastro de treinos, organização por turma ou categoria, histórico de atividades e acompanhamento da evolução.

## 4.4 Controle de presença

O sistema deverá permitir:

* Check-in pelo aplicativo;
* Check-in pela recepção;
* Confirmação pelo professor;
* Registro de presença;
* Registro de ausência;
* Histórico de frequência;
* Percentual de assiduidade;
* Identificação de alunos pouco frequentes;
* Relatórios por turma;
* Relatórios por professor;
* Relatórios por período;
* Controle de alunos ativos e inativos.

O aplicativo de referência utiliza a frequência para acompanhar presença, participação e assiduidade dos alunos.

## 4.5 Fichas de treino

O professor deverá conseguir:

* Criar uma ficha individual;
* Definir exercícios;
* Informar séries;
* Informar repetições;
* Informar carga;
* Definir intervalo;
* Incluir orientações;
* Adicionar vídeos ou imagens;
* Definir a validade da ficha;
* Atualizar exercícios;
* Registrar evolução;
* Consultar fichas anteriores.

O aluno poderá:

* Consultar a ficha atual;
* Registrar cargas utilizadas;
* Marcar exercícios concluídos;
* Consultar o histórico;
* Visualizar observações do professor.

## 4.6 Avaliação física

O módulo deverá permitir:

* Cadastrar avaliações;
* Registrar peso;
* Registrar altura;
* Calcular indicadores corporais;
* Registrar medidas corporais;
* Incluir fotografias de evolução;
* Registrar percentual de gordura;
* Informar objetivos;
* Consultar avaliações anteriores;
* Comparar resultados;
* Exibir gráficos de evolução.

O arquivo de referência prevê o registro das avaliações, a consulta do histórico e o acompanhamento da evolução física.

## 4.7 Planos e financeiro

O sistema deverá permitir:

* Criar planos;
* Definir valor;
* Definir duração;
* Definir modalidades incluídas;
* Limitar quantidade de aulas;
* Definir data de vencimento;
* Registrar pagamentos;
* Consultar mensalidades;
* Exibir pagamentos pendentes;
* Consultar histórico financeiro;
* Renovar planos;
* Contratar serviços adicionais;
* Aplicar descontos;
* Registrar multas e juros;
* Gerar recibos;
* Integrar pagamentos via Pix, cartão ou boleto.

O aluno deverá visualizar:

* Plano atual;
* Data de vencimento;
* Situação financeira;
* Histórico de pagamentos;
* Opção de renovação;
* Serviços disponíveis para compra.

Essas funções seguem a estrutura do arquivo, que inclui mensalidades, histórico financeiro, planos, renovação e compra de serviços.

## 4.8 Comunicação

O aplicativo deverá possuir um mural de comunicados.

A academia poderá publicar:

* Avisos;
* Alterações de horário;
* Novas turmas;
* Eventos;
* Promoções;
* Fotografias;
* Vídeos;
* Mensagens;
* Informações sobre feriados;
* Comunicados urgentes.

Os usuários poderão, conforme as permissões:

* Curtir publicações;
* Comentar;
* Compartilhar internamente;
* Receber notificações;
* Entrar em contato com a recepção;
* Conversar com professores.

O módulo de referência contém mural, comunicados, fotografias, mensagens, curtidas, comentários e notificações.

## 4.9 Evolução e níveis

Caso a academia trabalhe com modalidades que possuam níveis, faixas ou graduações, o sistema deverá permitir:

* Registrar o nível atual;
* Atualizar a graduação;
* Consultar o histórico;
* Organizar alunos por nível;
* Definir critérios de evolução;
* Registrar datas de avaliações;
* Controlar níveis infantis e adultos;
* Emitir certificados.

Esse módulo poderá ser ativado somente para modalidades que utilizem graduação.

A referência contempla faixa atual, histórico de graduações, organização por faixa e controle específico para alunos infantis.

# 5. Estrutura das telas

## 5.1 Aplicativo do aluno

1. Tela de abertura;
2. Login;
3. Cadastro;
4. Recuperação de senha;
5. Página inicial;
6. Agenda;
7. Filtros de aulas;
8. Detalhes da aula;
9. Confirmação da reserva;
10. Lista de espera;
11. Meus agendamentos;
12. Check-in;
13. Minha ficha de treino;
14. Histórico de treinos;
15. Avaliações físicas;
16. Evolução;
17. Frequência;
18. Meu plano;
19. Pagamentos;
20. Mural da academia;
21. Notificações;
22. Perfil;
23. Documentos;
24. Configurações;
25. Suporte.

## 5.2 Aplicativo do professor

1. Login;
2. Agenda do dia;
3. Minhas turmas;
4. Lista de alunos;
5. Registro de presença;
6. Perfil do aluno;
7. Criação de ficha;
8. Histórico de fichas;
9. Avaliação física;
10. Registro de evolução;
11. Comunicados;
12. Bloqueio de horários;
13. Perfil do professor.

## 5.3 Painel administrativo

1. Dashboard;
2. Alunos;
3. Professores;
4. Modalidades;
5. Turmas;
6. Agenda;
7. Reservas;
8. Lista de espera;
9. Presenças;
10. Fichas de treino;
11. Avaliações;
12. Planos;
13. Mensalidades;
14. Pagamentos;
15. Documentos;
16. Comunicados;
17. Relatórios;
18. Configurações;
19. Usuários e permissões;
20. Unidades.

# 6. Fluxo principal de agendamento

1. O aluno acessa o aplicativo;
2. Seleciona a opção “Agenda”;
3. Escolhe uma data;
4. Filtra por modalidade, professor ou unidade;
5. Seleciona uma aula;
6. Consulta horário, professor e vagas disponíveis;
7. Confirma a reserva;
8. Recebe uma notificação de confirmação;
9. Realiza o check-in no dia da aula;
10. A presença é confirmada pelo professor ou pela recepção.

Quando a aula estiver lotada:

1. O aluno solicita entrada na lista de espera;
2. O sistema registra sua posição;
3. Uma vaga é liberada;
4. O próximo aluno recebe uma notificação;
5. O aluno confirma a vaga dentro do prazo;
6. Caso não confirme, a oportunidade passa para o próximo da lista.

# 7. Notificações

O aplicativo deverá enviar notificações para:

* Confirmação de reserva;
* Lembrete de aula;
* Cancelamento de aula;
* Alteração de professor;
* Liberação de vaga;
* Aproximação do vencimento;
* Mensalidade vencida;
* Publicação de comunicado;
* Atualização da ficha;
* Nova avaliação física;
* Renovação do plano;
* Promoções e eventos.

# 8. Relatórios administrativos

O painel deverá apresentar:

* Quantidade de alunos ativos;
* Quantidade de alunos inativos;
* Novas matrículas;
* Cancelamentos;
* Taxa de ocupação por turma;
* Horários mais procurados;
* Modalidades mais procuradas;
* Frequência média;
* Alunos com baixa frequência;
* Número de ausências;
* Receita mensal;
* Mensalidades em atraso;
* Planos mais vendidos;
* Agendamentos realizados;
* Cancelamentos de reservas;
* Utilização da lista de espera;
* Desempenho por unidade.

# 9. Primeira versão do aplicativo — MVP

A primeira versão deverá priorizar as funcionalidades essenciais.

## Funcionalidades do MVP

* Cadastro e login;
* Perfis de aluno, professor e administrador;
* Cadastro de alunos;
* Cadastro de professores;
* Cadastro de modalidades;
* Cadastro de turmas;
* Configuração de horários;
* Controle de vagas;
* Agenda;
* Reserva de aulas;
* Cancelamento;
* Lista de espera;
* Check-in;
* Registro de presença;
* Notificações;
* Consulta do plano;
* Painel administrativo básico;
* Relatórios básicos de frequência e ocupação.

## Funcionalidades para versões futuras

* Pagamento pelo aplicativo;
* Avaliação física completa;
* Gráficos de evolução;
* Fichas de treino avançadas;
* Chat;
* Mural com comentários;
* Integração com catraca;
* Integração com relógios inteligentes;
* Programa de pontos;
* Loja de produtos;
* Eventos e campeonatos;
* Gestão de várias unidades;
* Certificados e graduações;
* Inteligência artificial para recomendação de treinos.

# 10. Requisitos técnicos

O projeto deverá:

* Funcionar em Android e iPhone;
* Possuir painel administrativo web;
* Utilizar banco de dados seguro;
* Armazenar documentos e imagens;
* Proteger os dados pessoais;
* Possuir controle de permissões;
* Manter histórico das principais alterações;
* Permitir notificações;
* Possuir cópias de segurança;
* Estar preparado para múltiplas unidades;
* Ter interface simples e responsiva;
* Seguir as exigências da LGPD.

# 11. Sugestão de tecnologias

Para o aplicativo:

* Flutter ou React Native.

Para o painel administrativo:

* React, Next.js ou tecnologia equivalente.

Para o servidor:

* Node.js, NestJS ou tecnologia equivalente.

Para o banco de dados:

* PostgreSQL.

Para autenticação:

* Login por e-mail e senha;
* Recuperação de senha;
* Autenticação por código;
* Possibilidade futura de login com Google ou Apple.

Para notificações:

* Firebase Cloud Messaging.

Para armazenamento:

* Serviço seguro de armazenamento em nuvem.

# 12. Entregas esperadas

Antes do desenvolvimento completo, deverão ser apresentados:

1. Mapa das telas;
2. Fluxo de navegação;
3. Protótipo visual;
4. Identidade visual inicial;
5. Estrutura do banco de dados;
6. Regras de negócio;
7. Arquitetura do sistema;
8. Tecnologias escolhidas;
9. Cronograma por etapas;
10. Estimativa de custos;
11. Código-base;
12. Documentação para instalação;
13. Documentação para manutenção;
14. Plano de testes;
15. Processo de publicação nas lojas.

# 13. Orientação sobre a referência

O aplicativo Alliance Jiu Jitsu deverá servir apenas como referência funcional.

Não deverão ser copiados:

* Nome;
* Logotipo;
* Marca;
* Identidade visual;
* Textos;
* Imagens;
* Ícones exclusivos;
* Código-fonte;
* Banco de dados;
* Conteúdo protegido;
* Layout idêntico.

O novo produto deverá possuir experiência, interface e identidade próprias, ainda que ofereça módulos semelhantes de gestão esportiva.
