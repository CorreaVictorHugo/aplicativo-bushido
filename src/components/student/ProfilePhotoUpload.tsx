'use client'

import { useState } from 'react'

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string | null
  onFileSelected: (file: File | null) => void
}

export function ProfilePhotoUpload({ currentPhotoUrl, onFileSelected }: ProfilePhotoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 5MB.')
      e.target.value = ''
      return
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      alert('Tipo de arquivo inválido. Use JPEG, PNG, WebP ou GIF.')
      e.target.value = ''
      return
    }

    setPreviewUrl(URL.createObjectURL(file))
    onFileSelected(file)
  }

  const handleRemovePhoto = () => {
    setPreviewUrl(currentPhotoUrl || null)
    onFileSelected(null)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- preview é blob: (URL.createObjectURL), o next/image não otimiza blob URLs
          <img
            src={previewUrl}
            alt="Preview da foto do perfil"
            className="w-full h-full rounded-full object-cover border-2 border-zinc-200"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-zinc-200 flex items-center justify-center text-zinc-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}

        <label
          htmlFor="photo-upload"
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center cursor-pointer hover:bg-zinc-800 transition-colors border-2 border-white"
          aria-label="Selecionar foto do perfil"
        >
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="sr-only"
            aria-describedby="photo-hint"
          />
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </label>

        {previewUrl !== currentPhotoUrl && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors border-2 border-white"
            aria-label="Remover foto selecionada"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <p id="photo-hint" className="text-xs text-zinc-500 text-center max-w-xs">
        JPEG, PNG, WebP ou GIF — máx. 5MB
      </p>
    </div>
  )
}