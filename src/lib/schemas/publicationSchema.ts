import { z } from 'zod'

export const publicationSchema = z.object({
  type: z.enum(['notice', 'news', 'event', 'photo', 'video']),
  title: z.string().min(1, 'Título é obrigatório').min(3, 'Título muito curto'),
  content: z.string().optional(),
  media_url: z.string().optional().refine(
    (val) => !val || /^https?:\/\//.test(val),
    { message: 'Informe uma URL válida (começando com http)' }
  ),
  status: z.enum(['draft', 'published']),
})

export type PublicationFormData = z.infer<typeof publicationSchema>
