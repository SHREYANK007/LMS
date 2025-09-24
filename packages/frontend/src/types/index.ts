export interface User {
  id: string
  name: string
  email: string
  password?: string
  role: 'admin' | 'tutor' | 'student'
  avatar?: string
  phone?: string
  guardianEmail?: string // For students
  createdAt: Date
  lastLogin?: Date
  isActive: boolean

  // Course assignment
  courseType?: 'PTE' | 'NAATI' | 'BOTH'
  expiryDate?: Date

  // Feature toggles for students
  features?: {
    smartQuad: boolean
    oneToOne: boolean
    masterclass: boolean
    practicePortal: boolean
  }
}

export interface Course {
  id: string
  type: 'PTE' | 'NAATI'
  name: string
  description: string
  isActive: boolean
  createdAt: Date
}

export interface Session {
  id: string
  title: string
  type: 'smart-quad' | 'one-to-one' | 'masterclass'
  courseType: 'PTE' | 'NAATI' | 'BOTH'
  tutorId: string
  tutorName: string
  tutorAvatar?: string
  studentIds: string[]
  maxStudents: number
  date: Date
  startTime: string
  endTime: string
  duration: number
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  meetingLink?: string
  description?: string
  price: number
  tags: string[]
  materials?: string[]
  recordingUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Availability {
  id: string
  tutorId: string
  tutorName: string
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  startTime: string
  endTime: string
  sessionType: 'smart-quad' | 'one-to-one' | 'masterclass'
  maxStudents: number
  isActive: boolean
  courseType: 'PTE' | 'NAATI' | 'BOTH'
  price: number
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: string
  sessionId: string
  studentId: string
  studentName: string
  studentEmail: string
  bookingDate: Date
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  amount: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface SmartQuadGroup {
  id: string
  name: string
  courseType: 'PTE' | 'NAATI'
  tutorId: string
  tutorName: string
  studentIds: string[]
  maxStudents: 4
  currentStudents: number
  startDate: Date
  endDate: Date
  sessionDays: number[] // Days of week
  startTime: string
  endTime: string
  sessionsCompleted: number
  totalSessions: number
  status: 'forming' | 'active' | 'completed'
  price: number
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  isAvailable: boolean
  tutorId?: string
  tutorName?: string
  sessionType?: 'smart-quad' | 'one-to-one' | 'masterclass'
  price?: number
  currentBookings?: number
  maxBookings?: number
}

export interface CalendarEvent {
  id: string
  title: string
  type: 'session' | 'availability' | 'break'
  start: Date
  end: Date
  color: string
  sessionType?: 'smart-quad' | 'one-to-one' | 'masterclass'
  tutorId?: string
  studentIds?: string[]
  status?: string
}

export interface StudyMaterial {
  id: string
  title: string
  description?: string
  fileUrl: string
  fileType: string
  courseType: 'PTE' | 'NAATI' | 'BOTH'
  visibility: 'all_course_students' | 'my_students_only'
  category: string
  tags: string[]
  uploadedBy: string
  uploadedByRole: 'admin' | 'tutor'
  allowDownload: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Announcement {
  id: string
  title: string
  content: string
  type: 'urgent' | 'info' | 'offer'
  courseType?: 'PTE' | 'NAATI' | 'BOTH'
  isGlobal: boolean
  targetRole?: 'student' | 'tutor' | 'all'
  createdBy: string
  isActive: boolean
  createdAt: Date
  expiresAt?: Date
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  courseType?: 'PTE' | 'NAATI' | 'BOTH'
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Feedback {
  id: string
  studentId: string
  subject: string
  message: string
  attachments?: string[]
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo?: string
  responses: FeedbackResponse[]
  createdAt: Date
  updatedAt: Date
}

export interface FeedbackResponse {
  id: string
  feedbackId: string
  responderId: string
  responderRole: 'admin' | 'tutor'
  message: string
  attachments?: string[]
  createdAt: Date
}

export interface Review {
  id: string
  studentId: string
  tutorId: string
  sessionId: string
  rating: number // 1-5
  comment?: string
  isAnonymous: boolean
  isApproved: boolean
  createdAt: Date
}

export interface Payment {
  id: string
  studentId: string
  amount: number
  currency: string
  type: 'subscription' | 'renewal' | 'refund'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  transactionId?: string
  metadata?: any
  createdAt: Date
}

export interface SystemLog {
  id: string
  userId: string
  userRole: string
  action: string
  resourceType: string
  resourceId?: string
  details?: any
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

export interface Analytics {
  totalUsers: number
  activeUsers: number
  totalSessions: number
  completedSessions: number
  totalRevenue: number
  averageRating: number
  courseStats: {
    PTE: { students: number, sessions: number }
    NAATI: { students: number, sessions: number }
  }
}