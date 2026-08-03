# Revisão de Segurança / RLS — Bushido

**Data:** 03/08/2026
**Status:** Revisão realizada; correções em migration 15
**Escopo:** Políticas RLS das 9 tabelas + Storage + funções (migrations 01–14)

---

## Resumo

| Severidade | Qtd | Descrição |
|-----------|-----|-----------|
| 🔴 Crítica | 2 | Escalada de privilégio (role) e alteração de dados esportivos pelo aluno |
| 🟡 Média | 0 | — |
| 🟢 Baixa | 3 | Notas de design aceitáveis |

---

## 🔴 Crítico 1 — `profiles`: aluno pode alterar o próprio `role`

**Política atual** (`migration 01`):
```sql
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

**Problema:** o `with check` não restringe **colunas**. Qualquer aluno pode executar via API direta:
```sql
update profiles set role = 'admin' where id = auth.uid();
```
A UI não expõe isso, mas o RLS **permite**. A função `is_admin()` passaria a retornar `true` → **escalada para administrador**.

**Correção:** trigger `before update` que bloqueia alteração de `role`/`status` por não-admin.

---

## 🔴 Crítico 2 — `students`: aluno pode alterar faixa/grau/entrada/status

**Política atual** (`migration 11`):
```sql
create policy "Students can update own record"
  on students for update
  to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());
```

**Problema:** sem restrição de colunas. O aluno pode alterar `belt`, `degree`, `entry_date` e `status` diretamente — violando o **RF-003** (apenas admin controla esses dados).

**Correção:** trigger `before update` que bloqueia alteração de `belt`/`degree`/`entry_date`/`status` por não-admin.

---

## 🟢 Baixas (aceitáveis no MVP, documentadas)

1. **`trainings`** — "Anyone can view active trainings" (leitura pública). Aceitável: dados não sensíveis.
2. **`publications`** — "Anyone can view published publications". Aceitável: conteúdo do mural é público por natureza.
3. **`uploads` (Storage)** — qualquer autenticado pode enviar ao bucket `uploads`; leitura limitada ao dono/admin. Aceitável.

---

## Isolamento entre alunos (verificado ✅)

- `checkins`, `graduations`, `payments` (select): filtram por `student_id in (select id from students where profile_id = auth.uid())` → **aluno não vê dados de outros alunos**
- `students` (select): `profile_id = auth.uid()`
- `notifications` (select): `target_profile in ('all','students')` ou específica para o aluno
- Storage `avatars`: path `{userId}/...` com `auth.uid()::text = foldername[1]`

## Auditoria (verificado ✅)

- Check-ins: `decided_by` + `decided_at` exigidos pela RLS de update
- Pagamentos: `registered_by = auth.uid()` exigido na inserção
- Publicações: `author_id = auth.uid()` exigido

---

## Correções aplicadas (migration 15)

- Função trigger `prevent_profile_role_update` (bloqueia role/status em `profiles`)
- Função trigger `prevent_student_protected_update` (bloqueia belt/degree/entry_date/status em `students`)
- Ambos permitem admin (`is_admin()`) e superuser (migrations/seed)
