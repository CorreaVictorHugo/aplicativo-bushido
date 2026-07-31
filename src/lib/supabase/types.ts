export type Profile = {
  id: string
  email: string
  role: 'student' | 'admin'
  status: 'active' | 'inactive'
  created_at: string
}

export type Student = {
  id: string
  profile_id: string
  name: string
  photo_url?: string
  birth_date?: string
  phone?: string
  weight?: number
  belt: 'white' | 'blue' | 'purple' | 'brown' | 'black' | 'red' | 'coral'
  degree: 0 | 1 | 2 | 3 | 4
  entry_date: string
  status: 'active' | 'inactive'
  notes?: string
  created_at: string
  updated_at: string
}

export type StudentWithGraduations = Student & {
  graduations: Graduation[]
}

export type Training = {
  id: string
  modality: string
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6
  time: string
  location: string
  capacity: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export type TrainingResponsible = {
  id: string
  training_id: string
  profile_id: string
  created_at: string
}

export type CheckInStatus = 'pending' | 'confirmed' | 'rejected'

export type CheckIn = {
  id: string
  student_id: string
  training_id: string
  class_date: string
  checkin_at: string
  status: CheckInStatus
  decided_by?: string
  decided_at?: string
  created_at: string
  updated_at: string
}

export type Graduation = {
  id: string
  student_id: string
  belt: 'white' | 'blue' | 'purple' | 'brown' | 'black' | 'red' | 'coral'
  degree: 0 | 1 | 2 | 3 | 4
  date: string
  responsible_name?: string
  notes?: string
  created_at: string
}

export type Payment = {
  id: string
  student_id: string
  reference: string
  amount?: number
  date: string
  status: 'paid' | 'pending' | 'overdue'
  notes?: string
  registered_by: string
  created_at: string
}

export type PublicationType = 'notice' | 'news' | 'event' | 'photo' | 'video'

export type Publication = {
  id: string
  type: PublicationType
  title: string
  content?: string
  media_url?: string
  author_id: string
  published_at: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

export type Notification = {
  id: string
  target_profile: 'all' | 'student' | 'admin' | string
  title: string
  message: string
  sent_at: string
  read_at?: string
  created_at: string
}