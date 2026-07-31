interface ProfilePhotoProps {
  photoUrl?: string | null
  name: string
  size?: number
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getColorFromName(name: string): string {
  const colors = [
    'bg-zinc-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function ProfilePhoto({ photoUrl, name, size = 96 }: ProfilePhotoProps) {
  const initials = getInitials(name)
  const bgColor = getColorFromName(name)

  return (
    <div className="relative flex-shrink-0" aria-hidden="true">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={`${name} - Foto do perfil`}
          className={`w-${size} h-${size} rounded-full object-cover border-2 border-zinc-200`}
        />
      ) : (
        <div
          className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white text-2xl font-bold ${bgColor} border-2 border-zinc-200`}
          role="img"
          aria-label={`${name} - Avatar`}
        >
          {initials}
        </div>
      )}
    </div>
  )
}