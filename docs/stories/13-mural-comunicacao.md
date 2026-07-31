# Story 13 — Mural / Comunicação

**ID:** STORY-4.4 / 4.5 / 4.6  
**Fase:** 4 — Administração e comunicação  
**Status:** Implemented  
**Prioridade:** P1

---

## Descrição

Como **administrador**, quero publicar e gerenciar avisos, notícias, eventos, fotos e vídeos, e como **aluno**, quero visualizar essas publicações no mural.

## Acceptance Criteria

- [ ] **AC1:** `/admin/comunicacao` lista publicações com status (rascunho/publicado)
- [ ] **AC2:** Formulário de publicação: tipo (aviso, notícia, evento, foto, vídeo), título, conteúdo, mídia (URL de imagem ou vídeo do YouTube)
- [ ] **AC3:** Publicação pode ser salva como rascunho ou publicada
- [ ] **AC4:** Ações: editar, excluir, publicar/despublicar
- [ ] **AC5:** `/mural` (aluno) lista publicações **publicadas** ordenadas por data
- [ ] **AC6:** Exibir tipo, título, conteúdo, imagem e vídeo do YouTube incorporado
- [ ] **AC7:** RLS: aluno vê somente publicadas; admin vê tudo
- [ ] **AC8:** Validação Zod

## Arquivos envolvidos

```
src/app/admin/comunicacao/
├── page.tsx              # NOVO — lista de publicações
├── nova/page.tsx         # NOVO — criar publicação
└── [id]/editar/page.tsx  # NOVO — editar publicação

src/app/(student)/mural/page.tsx  # MODIFICAR — placeholder → mural

src/components/admin/
├── PublicationList.tsx   # NOVO — lista com ações
└── PublicationForm.tsx   # NOVO — form RHF + Zod

src/components/student/
├── MuralList.tsx         # NOVO — publicações publicadas
└── YoutubeEmbed.tsx      # NOVO — iframe do YouTube a partir do link

src/lib/schemas/
└── publicationSchema.ts  # NOVO — Zod schema

src/hooks/
├── useAdminPublications.ts # NOVO — CRUD (admin)
└── usePublications.ts      # NOVO — publicadas (aluno)
```

## Dependências

- **Migration 08** (tabela `publications`) e **Migration 12** (RLS admin)
- Bucket `publications` (Storage) — upload de fotos pode ser adicionado depois; MVP usa URL

## Stack técnica

| Aspecto | Decisão |
|---------|---------|
| Tipos | notice / news / event / photo / video |
| Mídia | `media_url` (URL de imagem ou link do YouTube) — sem upload no MVP |
| YouTube | Extrai o ID do link e incorpora com `<iframe>` |
| Status | draft / published / archived |
| Auditoria | `author_id = auth.uid()` (RLS exige) |

## Regras de negócio

- Apenas publicações `published` aparecem no mural do aluno
- Vídeos: apenas link do YouTube (sem upload/hospedagem no MVP)
- `author_id` obrigatório e = admin logado (RLS)

## Checklist de implementação

- [X] Criar schema `publicationSchema.ts`
- [X] Criar hooks `useAdminPublications` e `usePublications`
- [X] Criar `PublicationList`, `PublicationForm`, `MuralList`, `YoutubeEmbed`
- [X] Criar páginas admin de comunicação
- [X] Implementar `/mural` do aluno
- [X] Extrair ID do YouTube e incorporar
- [X] Testar RLS (só publicadas no mural)
- [X] Build + lint
