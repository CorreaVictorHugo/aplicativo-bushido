'use client'

import { useCallback, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UseProfilePhotoResult {
  uploadPhoto: (file: File, userId: string) => Promise<string | null>
  compressImage: (file: File, maxWidth?: number, maxHeight?: number, quality?: number) => Promise<Blob>
  isUploading: boolean
  uploadError: string | null
}

export function useProfilePhoto(): UseProfilePhotoResult {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const compressImage = useCallback(
    (file: File, maxWidth = 400, maxHeight = 400, quality = 0.8): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        const reader = new FileReader()

        reader.onload = (e) => {
          img.src = e.target?.result as string
        }

        img.onload = () => {
          const canvas = document.createElement('canvas')
          let { width, height } = img

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width *= ratio
            height *= ratio
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Não foi possível criar contexto do canvas'))
            return
          }

          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob)
              else reject(new Error('Falha na compressão'))
            },
            'image/jpeg',
            quality
          )
        }

        img.onerror = () => reject(new Error('Erro ao carregar imagem'))
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
        reader.readAsDataURL(file)
      })
    },
    []
  )

  const uploadPhoto = useCallback(
    async (file: File, userId: string): Promise<string | null> => {
      setIsUploading(true)
      setUploadError(null)

      try {
        // Validações
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Arquivo muito grande. Máximo 5MB.')
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!validTypes.includes(file.type)) {
          throw new Error('Tipo de arquivo inválido. Use JPEG, PNG, WebP ou GIF.')
        }

        // Comprimir
        const compressedBlob = await compressImage(file)

        // Upload para Supabase Storage
        const supabase = createClient()
        const fileExt = file.type === 'image/png' ? 'png' : 'jpg'
        const path = `${userId}/avatar.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, compressedBlob, {
            upsert: true,
            contentType: file.type,
          })

        if (uploadError) {
          console.error('Erro no upload:', uploadError)
          throw new Error('Falha ao enviar foto. Tente novamente.')
        }

        // Obter URL pública
        const { data } = supabase.storage.from('avatars').getPublicUrl(path)
        return data.publicUrl
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro inesperado no upload'
        setUploadError(message)
        return null
      } finally {
        setIsUploading(false)
      }
    },
    [compressImage]
  )

  return { uploadPhoto, compressImage, isUploading, uploadError }
}