'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { perfilSchema, type PerfilData } from '@/lib/schemas/perfilSchema'
import { useSupabase } from '@/hooks/useSupabase'
import { useProfilePhoto } from '@/hooks/useProfilePhoto'
import { ProfilePhotoUpload } from './ProfilePhotoUpload'

export function ProfileEdit() {
  const router = useRouter()
  const supabase = useSupabase()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [profileLoaded, setProfileLoaded] = useState(false)

  const { uploadPhoto, isUploading: isPhotoUploading, uploadError: photoUploadError } = useProfilePhoto()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PerfilData>({
    resolver: zodResolver(perfilSchema),
    shouldFocusError: true,
    mode: 'onChange',
  })

  useEffect(() => {
    let cancelled = false

    const loadStudentData = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (cancelled) return
        if (!session) {
          setIsLoading(false)
          return
        }

        setUserId(session.user.id)

        const { data: student, error } = await supabase
          .from('students')
          .select('name, phone, weight, birth_date, photo_url')
          .eq('profile_id', session.user.id)
          .single()

        if (cancelled) return

        if (error || !student) {
          console.error('Erro ao carregar dados:', error)
          setIsLoading(false)
          return
        }

        reset({
          name: student.name,
          phone: student.phone || '',
          weight: student.weight ? String(student.weight) : '',
          birthDate: student.birth_date || '',
        })
        setCurrentPhotoUrl(student.photo_url || null)
        setProfileLoaded(true)
      } catch (err) {
        if (!cancelled) {
          console.error('Erro ao carregar dados do aluno:', err)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadStudentData()
    return () => {
      cancelled = true
    }
  }, [supabase, reset])

  const onSubmit = async (data: PerfilData) => {
    if (isSubmitted) return
    setIsSubmitted(true)
    setSubmitError(null)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setIsSubmitted(false)
        setSubmitError('Sessão expirada. Faça login novamente.')
        return
      }

      let finalPhotoUrl = currentPhotoUrl

      // Se houver foto nova selecionada, faz upload primeiro
      if (selectedPhoto) {
        const uploadedUrl = await uploadPhoto(selectedPhoto, session.user.id)
        if (!uploadedUrl) {
          setIsSubmitted(false)
          return // uploadError já é exibido via useProfilePhoto
        }
        finalPhotoUrl = uploadedUrl
      }

      const updateData: Record<string, unknown> = {
        name: data.name,
        phone: data.phone,
        birth_date: data.birthDate,
      }

      if (data.weight && !isNaN(Number(data.weight))) {
        updateData.weight = Number(data.weight)
      }

      if (finalPhotoUrl) {
        updateData.photo_url = finalPhotoUrl
      }

      const { error } = await supabase
        .from('students')
        .update(updateData)
        .eq('profile_id', session.user.id)

      if (error) {
        setIsSubmitted(false)
        console.error('Erro ao atualizar:', error)
        setSubmitError('Erro ao salvar alterações. Tente novamente.')
        return
      }

      router.push('/perfil')
      router.refresh()
    } catch (err) {
      setIsSubmitted(false)
      console.error('Erro inesperado:', err)
      setSubmitError('Ocorreu um erro inesperado. Tente novamente.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16" role="status" aria-label="Carregando edição de perfil">
        <div className="animate-pulse w-full max-w-md space-y-4">
          <div className="h-24 w-24 mx-auto rounded-full bg-zinc-200" />
          <div className="h-6 w-48 mx-auto bg-zinc-200 rounded" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 bg-zinc-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!userId || !profileLoaded) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center" role="alert">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
          Não foi possível carregar seus dados. Tente novamente.
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-sm font-medium text-zinc-900 underline hover:text-zinc-700"
        >
          Recarregar página
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-1 flex-col max-w-md mx-auto w-full px-4 py-8 gap-6"
    >
      <header className="flex flex-col items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold text-zinc-900">Editar Perfil</h1>
        <p className="text-sm text-zinc-500">Atualize seus dados pessoais</p>
      </header>

      <ProfilePhotoUpload
        currentPhotoUrl={currentPhotoUrl}
        onFileSelected={setSelectedPhoto}
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-zinc-900">
            Nome completo
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register('name')}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
          {errors.name && (
            <p className="text-xs text-red-600" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-sm font-medium text-zinc-900">
            Telefone
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            {...register('phone')}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
          {errors.phone && (
            <p className="text-xs text-red-600" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="weight" className="text-sm font-medium text-zinc-900">
            Peso (kg) <span className="text-zinc-400">(opcional)</span>
          </label>
          <input
            id="weight"
            type="number"
            step="0.1"
            min="0"
            max="300"
            {...register('weight')}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
          {errors.weight && (
            <p className="text-xs text-red-600" role="alert">
              {errors.weight.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="birthDate" className="text-sm font-medium text-zinc-900">
            Data de nascimento
          </label>
          <input
            id="birthDate"
            type="date"
            {...register('birthDate')}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.birthDate && (
            <p className="text-xs text-red-600" role="alert">
              {errors.birthDate.message}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-xs text-zinc-500 mb-2">Estes campos só podem ser alterados pelo administrador:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-zinc-400">Faixa</span>
              <p className="font-medium text-zinc-900">—</p>
            </div>
            <div>
              <span className="text-zinc-400">Grau</span>
              <p className="font-medium text-zinc-900">—</p>
            </div>
            <div>
              <span className="text-zinc-400">Data de entrada</span>
              <p className="font-medium text-zinc-900">—</p>
            </div>
            <div>
              <span className="text-zinc-400">Status</span>
              <p className="font-medium text-zinc-900">—</p>
            </div>
          </div>
        </div>

        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {submitError}
          </div>
        )}

        {photoUploadError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {photoUploadError}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || isSubmitted || isPhotoUploading}
            className="flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting || isSubmitted ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Salvando...
              </span>
            ) : (
              'Salvar alterações'
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push('/perfil')}
            disabled={isSubmitting || isSubmitted}
            className="flex h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  )
}