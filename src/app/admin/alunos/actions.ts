'use server'

import { createClient as createServiceClient } from '@supabase/supabase-js'

export type CreateStudentInput = {
  email: string
  password: string
  name: string
  phone?: string
  birth_date?: string
  weight?: string
  belt: 'white' | 'blue' | 'purple' | 'brown' | 'black' | 'red' | 'coral'
  degree: number
  entry_date: string
  status: 'active' | 'inactive'
  notes?: string
}

export async function createStudent(input: CreateStudentInput): Promise<{ success?: boolean; error?: string }> {
  const serviceKey = process.env.SERVICE_ROLE_KEY
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceKey || !url) {
    return { error: 'SERVICE_ROLE_KEY não configurada no servidor. Adicione ao .env.local.' }
  }

  const adminClient = createServiceClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      name: input.name,
      birth_date: input.birth_date || null,
      phone: input.phone || null,
    },
  })

  if (authError) {
    const message = authError.message.toLowerCase()
    if (message.includes('already registered') || message.includes('already exists')) {
      return { error: 'Este e-mail já está cadastrado.' }
    }
    return { error: 'Erro ao criar o usuário. Tente novamente.' }
  }

  if (!authData.user) {
    return { error: 'Erro ao criar o usuário. Tente novamente.' }
  }

  const { error: updateError } = await adminClient
    .from('students')
    .update({
      belt: input.belt,
      degree: input.degree,
      entry_date: input.entry_date,
      status: input.status,
      notes: input.notes || null,
      weight: input.weight ? Number(input.weight) : null,
    })
    .eq('profile_id', authData.user.id)

  if (updateError) {
    return { error: 'Usuário criado, mas falha ao atualizar os dados esportivos.' }
  }

  return { success: true }
}
