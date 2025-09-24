import { User } from '@/types'

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@scoresmart.com',
    role: 'admin',
    avatar: '/demo-content/images/admin-avatar.jpg',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-12-21')
  },
  {
    id: '2',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@scoresmart.com',
    role: 'tutor',
    avatar: '/demo-content/images/tutor1-avatar.jpg',
    createdAt: new Date('2024-02-10'),
    lastLogin: new Date('2024-12-20')
  },
  {
    id: '3',
    name: 'Prof. Michael Brown',
    email: 'michael.brown@scoresmart.com',
    role: 'tutor',
    avatar: '/demo-content/images/tutor2-avatar.jpg',
    createdAt: new Date('2024-02-15'),
    lastLogin: new Date('2024-12-19')
  },
  {
    id: '4',
    name: 'Emily Johnson',
    email: 'emily.johnson@student.com',
    role: 'student',
    avatar: '/demo-content/images/student1-avatar.jpg',
    createdAt: new Date('2024-03-01'),
    lastLogin: new Date('2024-12-21')
  },
  {
    id: '5',
    name: 'David Lee',
    email: 'david.lee@student.com',
    role: 'student',
    avatar: '/demo-content/images/student2-avatar.jpg',
    createdAt: new Date('2024-03-05'),
    lastLogin: new Date('2024-12-20')
  },
  {
    id: '6',
    name: 'Maria Garcia',
    email: 'maria.garcia@student.com',
    role: 'student',
    avatar: '/demo-content/images/student3-avatar.jpg',
    createdAt: new Date('2024-03-10'),
    lastLogin: new Date('2024-12-21')
  }
]