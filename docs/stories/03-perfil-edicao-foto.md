# Story 3 — Página de edição do perfil + upload de foto

**ID:** STORY-1.8  
**Fase:** 1.4 — Perfil do Aluno (edição)  
**Status:** Implemented  
**Prioridade:** P0

---

## Descrição

Como **aluno**, quero editar meus dados permitidos (nome, foto, telefone, peso, data de nascimento) e fazer upload de uma foto de perfil, para que minhas informações estejam sempre atualizadas.

## Acceptance Criteria

- [ ] **AC1:** Página `/perfil/editar` dentro do grupo `(student)`
- [ ] **AC2:** Formulário pré-preenchido com dados atuais do aluno
- [ ] **AC3:** Campos editáveis: nome, telefone, peso, data de nascimento
- [ ] **AC4:** Campos bloqueados (somente leitura): faixa, grau, data de entrada, status
- [ ] **AC5:** Upload de foto com preview antes de salvar
- [ ] **AC6:** Compressão client-side antes do upload (max 5MB, redimensionar para 400x400)
- [ ] **AC7:** Salvar foto no Supabase Storage (bucket `avatars`, path `{userId}/avatar.jpg`)
- [ ] **AC8:** Validação Zod: nome (≥3 caracteres), telefone (10-11 dígitos), peso (opcional), data (antes de hoje)
- [ ] **AC9:** Botão "Salvar" desabilitado durante submit com spinner
- [ ] **AC10:** Mensagem de sucesso após salvar
- [ ] **AC11:** Tratamento de erros (rede, arquivo grande, tipo inválido)
- [ ] **AC12:** Redirecionar para `/perfil` após salvar com dados atualizados
- [ ] **AC13:** Cancelar → voltar para `/perfil` sem salvar

## Arquivos envolvidos

```
src/app/(student)/perfil/
├── editar/
│   └── page.tsx           # NOVO — Server Component → ProfileEdit (client)

src/components/student/
├── ProfileEdit.tsx         # NOVO — Formulário de edição (Client Component)
├── ProfilePhotoUpload.tsx  # NOVO — Upload com preview + compressão

src/lib/schemas/
└── perfilSchema.ts         # NOVO — Zod schema para edição de perfil

src/hooks/
└── useProfilePhoto.ts     # NOVO — Hook para upload de foto (compressão + Storage)
```

## Dependências

- **Story 1** — Layout de navegação do aluno (grupo `(student)`)
- **Story 2** — Página de visualização do perfil (botão "Editar" leva para cá)

## Stack técnica

| Aspecto | Decisão |
|---------|---------|
| Formulário | React Hook Form + Zod resolver (mesmo padrão do cadastro) |
| Upload | Input file → FileReader → canvas compress → Blob → Storage |
| Compressão | Canvas API (manter proporção, max 400x400, qualidade 0.8) |
| Storage | Supabase Storage, bucket `avatars`, path `{userId}/avatar.{ext}` |
| Validação | Zod schema (reaproveitar regras do cadastroSchema) |
| Preview | URL.createObjectURL() antes do upload |
| Mutação | TanStack Query mutation ou fetch direto via cliente Supabase |

## Schema de validação (perfilSchema.ts)

```typescript
import { z } from 'zod'

export const perfilSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').min(3, 'Nome deve ter no mínimo 3 caracteres'),
  phone: z.string().min(1, 'Telefone é obrigatório').refine(
    (val) => { const digits = val.replace(/\D/g, ''); return digits.length >= 10 && digits.length <= 11 },
    { message: 'Telefone deve ter entre 10 e 11 dígitos' }
  ),
  weight: z.string().optional().refine(
    (val) => !val || !isNaN(Number(val)),
    { message: 'Peso deve ser um número' }
  ),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória').refine((val) => {
    const date = new Date(val); const today = new Date(); return !isNaN(date.getTime()) && date < today
  }, 'Data de nascimento inválida'),
})

export type PerfilData = z.infer<typeof perfilSchema>
```

## Fluxo de upload de foto

```
1. Usuário seleciona arquivo (input type="file", accept="image/*")
2. Valida tamanho ≤ 5MB e tipo image/jpeg|png|webp
3. Exibe preview com FileReader/URL.createObjectURL()
4. Ao salvar:
   a. Canvas API: redimensiona para max 400x400 mantendo proporção
   b. Canvas.toBlob() qualidade 0.8
   c. supabase.storage.from('avatars').upload(path, blob, { upsert: true })
   d. Obtém URL pública: supabase.storage.from('avatars').getPublicUrl(path)
   e. Atualiza students.photo_url no banco
5. Se não selecionou foto nova, apenas salva os campos de texto
```

## Regras de negócio

- Aluno só pode editar: nome, foto, telefone, peso, data de nascimento
- Faixa, grau, data de entrada e status são controlados pelo admin
- Foto deve ser imagem válida (jpeg, png, webp, gif)
- Tamanho máximo: 5MB (já configurado no bucket)
- Compressão client-side obrigatória para evitar uploads grandes

## Checklist de implementação

- [X] Criar schema `src/lib/schemas/perfilSchema.ts`
- [X] Criar `src/app/(student)/perfil/editar/page.tsx`
- [X] Criar `src/components/student/ProfileEdit.tsx` (RHF + Zod)
- [X] Criar `src/components/student/ProfilePhotoUpload.tsx` (preview + compressão)
- [X] Criar hook `src/hooks/useProfilePhoto.ts`
- [X] Implementar upload para Supabase Storage bucket `avatars`
- [X] Atualizar `students.photo_url` após upload bem-sucedido
- [X] Implementar preview antes do upload
- [X] Implementar compressão client-side (Canvas API)
- [X] Validar formulário com Zod
- [X] Tratar erros: arquivo grande, tipo inválido, rede
- [X] Redirecionar para `/perfil` após salvar
- [ ] Testar upload em mobile (câmera + galeria) — pendente teste em dispositivo físico
- [X] Verificar RLS: aluno pode atualizar próprio registro
