import { User } from '@/types'

export const mockUsers: User[] = [
  // Admin Users
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@scoresmart.com',
    role: 'admin',
    avatar: '/api/placeholder/100/100',
    phone: '+61 400 123 456',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-12-21'),
    isActive: true
  },

  // Tutor Users
  {
    id: '2',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@scoresmart.com',
    role: 'tutor',
    avatar: '/api/placeholder/100/100',
    phone: '+61 400 234 567',
    courseType: 'BOTH',
    createdAt: new Date('2024-02-10'),
    lastLogin: new Date('2024-12-20'),
    isActive: true
  },
  {
    id: '3',
    name: 'Prof. Michael Brown',
    email: 'michael.brown@scoresmart.com',
    role: 'tutor',
    avatar: '/api/placeholder/100/100',
    phone: '+61 400 345 678',
    courseType: 'PTE',
    createdAt: new Date('2024-02-15'),
    lastLogin: new Date('2024-12-19'),
    isActive: true
  },
  {
    id: '8',
    name: 'Dr. Lisa Chen',
    email: 'lisa.chen@scoresmart.com',
    role: 'tutor',
    avatar: '/api/placeholder/100/100',
    phone: '+61 400 456 789',
    courseType: 'NAATI',
    createdAt: new Date('2024-03-20'),
    lastLogin: new Date('2024-12-18'),
    isActive: true
  },

  // Student Users
  {
    id: '4',
    name: 'Emily Johnson',
    email: 'emily.johnson@student.com',
    role: 'student',
    avatar: '/api/placeholder/100/100',
    phone: '+61 400 567 890',
    guardianEmail: 'parent.johnson@email.com',
    courseType: 'PTE',
    expiryDate: new Date('2025-03-15'),
    features: {
      smartQuad: true,
      oneToOne: true,
      masterclass: true,
      practicePortal: true
    },
    createdAt: new Date('2024-03-01'),
    lastLogin: new Date('2024-12-21'),
    isActive: true
  },
  {
    id: '5',
    name: 'David Lee',
    email: 'david.lee@student.com',
    role: 'student',
    avatar: '/api/placeholder/100/100',
    phone: '+61 400 678 901',
    courseType: 'NAATI',
    expiryDate: new Date('2025-02-28'),
    features: {
      smartQuad: true,
      oneToOne: false,
      masterclass: true,
      practicePortal: true
    },
    createdAt: new Date('2024-03-05'),
    lastLogin: new Date('2024-12-20'),
    isActive: true
  },
  {
    id: '6',
    name: 'Maria Garcia',
    email: 'maria.garcia@student.com',
    role: 'student',
    avatar: '/api/placeholder/100/100',
    phone: '+61 400 789 012',
    guardianEmail: 'family.garcia@email.com',
    courseType: 'BOTH',
    expiryDate: new Date('2025-04-20'),
    features: {
      smartQuad: true,
      oneToOne: true,
      masterclass: false,
      practicePortal: true
    },
    createdAt: new Date('2024-03-10'),
    lastLogin: new Date('2024-12-21'),
    isActive: true
  },
  {
    id: '7',
    name: 'James Wilson',
    email: 'james.wilson@student.com',
    role: 'student',
    avatar: '/api/placeholder/100/100',
    phone: '+61 400 890 123',
    courseType: 'PTE',
    expiryDate: new Date('2025-01-15'),
    features: {
      smartQuad: false,
      oneToOne: true,
      masterclass: true,
      practicePortal: false
    },
    createdAt: new Date('2024-04-12'),
    lastLogin: new Date('2024-12-19'),
    isActive: false
  },
  {
    id: '9',
    name: 'Priya Sharma',
    email: 'priya.sharma@student.com',
    role: 'student',
    avatar: '/api/placeholder/100/100',
    phone: '+61 400 901 234',
    courseType: 'NAATI',
    expiryDate: new Date('2024-12-30'),
    features: {
      smartQuad: true,
      oneToOne: true,
      masterclass: true,
      practicePortal: true
    },
    createdAt: new Date('2024-05-08'),
    lastLogin: new Date('2024-12-20'),
    isActive: true
  },
  {
    id: '10',
    name: 'Alex Thompson',
    email: 'alex.thompson@student.com',
    role: 'student',
    avatar: '/api/placeholder/100/100',
    phone: '+61 400 012 345',
    courseType: 'BOTH',
    expiryDate: new Date('2025-06-10'),
    features: {
      smartQuad: true,
      oneToOne: true,
      masterclass: true,
      practicePortal: true
    },
    createdAt: new Date('2024-06-15'),
    lastLogin: new Date('2024-12-21'),
    isActive: true
  }
]

// Helper function to get users by role
export const getUsersByRole = (role: 'admin' | 'tutor' | 'student') => {
  return mockUsers.filter(user => user.role === role)
}

// Helper function to get students by course type
export const getStudentsByCourse = (courseType: 'PTE' | 'NAATI' | 'BOTH') => {
  return mockUsers.filter(user =>
    user.role === 'student' &&
    (user.courseType === courseType || user.courseType === 'BOTH')
  )
}

// Helper function to get expiring students (within 10 days)
export const getExpiringStudents = () => {
  const tenDaysFromNow = new Date()
  tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10)

  return mockUsers.filter(user =>
    user.role === 'student' &&
    user.expiryDate &&
    user.expiryDate <= tenDaysFromNow
  )
}