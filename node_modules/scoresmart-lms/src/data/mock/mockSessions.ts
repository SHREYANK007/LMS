import { Session, Availability, SmartQuadGroup, Booking } from '@/types'

// Mock tutor availability data
export const mockAvailability: Availability[] = [
  {
    id: '1',
    tutorId: 'tutor1',
    tutorName: 'Dr. Sarah Wilson',
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '17:00',
    sessionType: 'smart-quad',
    maxStudents: 4,
    isActive: true,
    courseType: 'PTE',
    price: 80,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    tutorId: 'tutor1',
    tutorName: 'Dr. Sarah Wilson',
    dayOfWeek: 3, // Wednesday
    startTime: '09:00',
    endTime: '17:00',
    sessionType: 'smart-quad',
    maxStudents: 4,
    isActive: true,
    courseType: 'PTE',
    price: 80,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    tutorId: 'tutor1',
    tutorName: 'Dr. Sarah Wilson',
    dayOfWeek: 5, // Friday
    startTime: '09:00',
    endTime: '17:00',
    sessionType: 'one-to-one',
    maxStudents: 1,
    isActive: true,
    courseType: 'PTE',
    price: 150,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    tutorId: 'tutor2',
    tutorName: 'Prof. Michael Brown',
    dayOfWeek: 2, // Tuesday
    startTime: '10:00',
    endTime: '18:00',
    sessionType: 'smart-quad',
    maxStudents: 4,
    isActive: true,
    courseType: 'NAATI',
    price: 90,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '5',
    tutorId: 'tutor2',
    tutorName: 'Prof. Michael Brown',
    dayOfWeek: 4, // Thursday
    startTime: '10:00',
    endTime: '18:00',
    sessionType: 'smart-quad',
    maxStudents: 4,
    isActive: true,
    courseType: 'NAATI',
    price: 90,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '6',
    tutorId: 'tutor3',
    tutorName: 'Dr. Lisa Chen',
    dayOfWeek: 6, // Saturday
    startTime: '10:00',
    endTime: '16:00',
    sessionType: 'masterclass',
    maxStudents: 15,
    isActive: true,
    courseType: 'BOTH',
    price: 120,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

// Mock sessions data
export const mockSessions: Session[] = [
  {
    id: '1',
    title: 'PTE Speaking & Writing Smart Quad',
    type: 'smart-quad',
    courseType: 'PTE',
    tutorId: 'tutor1',
    tutorName: 'Dr. Sarah Wilson',
    tutorAvatar: 'SW',
    studentIds: ['student1', 'student2', 'student3'],
    maxStudents: 4,
    date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
    startTime: '10:00',
    endTime: '11:30',
    duration: 90,
    status: 'scheduled',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    description: 'Focus on speaking fluency and writing task 1',
    price: 80,
    tags: ['Speaking', 'Writing', 'Beginner'],
    materials: ['1', '2'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'NAATI Ethics & Standards',
    type: 'smart-quad',
    courseType: 'NAATI',
    tutorId: 'tutor2',
    tutorName: 'Prof. Michael Brown',
    tutorAvatar: 'MB',
    studentIds: ['student4', 'student5'],
    maxStudents: 4,
    date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    startTime: '14:00',
    endTime: '15:30',
    duration: 90,
    status: 'scheduled',
    meetingLink: 'https://meet.google.com/xyz-abcd-efg',
    description: 'Professional ethics and industry standards',
    price: 90,
    tags: ['Ethics', 'Standards', 'Professional'],
    materials: ['8', '9'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    title: 'One-to-One PTE Reading Focus',
    type: 'one-to-one',
    courseType: 'PTE',
    tutorId: 'tutor1',
    tutorName: 'Dr. Sarah Wilson',
    tutorAvatar: 'SW',
    studentIds: ['student1'],
    maxStudents: 1,
    date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
    startTime: '15:00',
    endTime: '16:00',
    duration: 60,
    status: 'scheduled',
    meetingLink: 'https://meet.google.com/one-two-three',
    description: 'Personalized reading comprehension training',
    price: 150,
    tags: ['Reading', 'Comprehension', 'Advanced'],
    materials: ['3', '4'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    title: 'PTE & NAATI Masterclass',
    type: 'masterclass',
    courseType: 'BOTH',
    tutorId: 'tutor3',
    tutorName: 'Dr. Lisa Chen',
    tutorAvatar: 'LC',
    studentIds: ['student1', 'student2', 'student3', 'student4', 'student5', 'student6'],
    maxStudents: 15,
    date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Next week
    startTime: '11:00',
    endTime: '13:00',
    duration: 120,
    status: 'scheduled',
    meetingLink: 'https://meet.google.com/master-class-room',
    description: 'Advanced strategies for both PTE and NAATI success',
    price: 120,
    tags: ['Advanced', 'Strategies', 'Both Courses'],
    materials: ['10', '11', '12'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '5',
    title: 'Completed PTE Smart Quad',
    type: 'smart-quad',
    courseType: 'PTE',
    tutorId: 'tutor1',
    tutorName: 'Dr. Sarah Wilson',
    tutorAvatar: 'SW',
    studentIds: ['student1', 'student2', 'student3', 'student7'],
    maxStudents: 4,
    date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    startTime: '10:00',
    endTime: '11:30',
    duration: 90,
    status: 'completed',
    meetingLink: 'https://meet.google.com/completed-session',
    description: 'Speaking and listening practice',
    price: 80,
    tags: ['Speaking', 'Listening'],
    recordingUrl: 'https://recordings.scoresmart.com/session5.mp4',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

// Mock Smart Quad groups
export const mockSmartQuadGroups: SmartQuadGroup[] = [
  {
    id: '1',
    name: 'PTE Intensive Group A',
    courseType: 'PTE',
    tutorId: 'tutor1',
    tutorName: 'Dr. Sarah Wilson',
    studentIds: ['student1', 'student2', 'student3'],
    maxStudents: 4,
    currentStudents: 3,
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
    sessionDays: [1, 3, 5], // Mon, Wed, Fri
    startTime: '10:00',
    endTime: '11:30',
    sessionsCompleted: 5,
    totalSessions: 20,
    status: 'active',
    price: 1600, // 20 sessions × 80
    description: 'Comprehensive PTE preparation with focus on all modules',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'NAATI Professional Group',
    courseType: 'NAATI',
    tutorId: 'tutor2',
    tutorName: 'Prof. Michael Brown',
    studentIds: ['student4', 'student5'],
    maxStudents: 4,
    currentStudents: 2,
    startDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Next week
    endDate: new Date(new Date().getTime() + 37 * 24 * 60 * 60 * 1000),
    sessionDays: [2, 4], // Tue, Thu
    startTime: '14:00',
    endTime: '15:30',
    sessionsCompleted: 0,
    totalSessions: 16,
    status: 'forming',
    price: 1440, // 16 sessions × 90
    description: 'Professional NAATI certification preparation',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

// Mock bookings
export const mockBookings: Booking[] = [
  {
    id: '1',
    sessionId: '1',
    studentId: 'student1',
    studentName: 'Emily Johnson',
    studentEmail: 'emily@example.com',
    bookingDate: new Date(),
    status: 'confirmed',
    paymentStatus: 'paid',
    amount: 80,
    notes: 'Regular Smart Quad session',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    sessionId: '1',
    studentId: 'student2',
    studentName: 'David Lee',
    studentEmail: 'david@example.com',
    bookingDate: new Date(),
    status: 'confirmed',
    paymentStatus: 'paid',
    amount: 80,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    sessionId: '3',
    studentId: 'student1',
    studentName: 'Emily Johnson',
    studentEmail: 'emily@example.com',
    bookingDate: new Date(),
    status: 'pending',
    paymentStatus: 'pending',
    amount: 150,
    notes: 'One-to-one reading focus session',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

// Helper functions
export const getSessionsByType = (type: 'smart-quad' | 'one-to-one' | 'masterclass') => {
  return mockSessions.filter(session => session.type === type)
}

export const getSessionsByTutor = (tutorId: string) => {
  return mockSessions.filter(session => session.tutorId === tutorId)
}

export const getSessionsByStudent = (studentId: string) => {
  return mockSessions.filter(session => session.studentIds.includes(studentId))
}

export const getUpcomingSessions = () => {
  const now = new Date()
  return mockSessions.filter(session => session.date > now && session.status === 'scheduled')
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}

export const getAvailableSlots = (courseType: 'PTE' | 'NAATI' | 'BOTH', sessionType?: string) => {
  return mockAvailability.filter(slot =>
    slot.isActive &&
    (slot.courseType === courseType || slot.courseType === 'BOTH') &&
    (!sessionType || slot.sessionType === sessionType)
  )
}

export const getSmartQuadGroupsByStatus = (status: 'forming' | 'active' | 'completed') => {
  return mockSmartQuadGroups.filter(group => group.status === status)
}

export const getBookingsByStudent = (studentId: string) => {
  return mockBookings.filter(booking => booking.studentId === studentId)
}

export const getBookingsBySession = (sessionId: string) => {
  return mockBookings.filter(booking => booking.sessionId === sessionId)
}