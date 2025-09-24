import { Enrollment } from '@/types'

export const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    studentId: '4',
    courseId: '1',
    enrolledAt: new Date('2024-03-15'),
    progress: 75,
    completedLessons: ['1-1', '1-2'],
    lastAccessedAt: new Date('2024-12-20')
  },
  {
    id: '2',
    studentId: '4',
    courseId: '3',
    enrolledAt: new Date('2024-04-10'),
    progress: 45,
    completedLessons: ['3-1'],
    lastAccessedAt: new Date('2024-12-19')
  },
  {
    id: '3',
    studentId: '5',
    courseId: '1',
    enrolledAt: new Date('2024-03-20'),
    progress: 100,
    completedLessons: ['1-1', '1-2', '1-3'],
    lastAccessedAt: new Date('2024-12-18')
  },
  {
    id: '4',
    studentId: '5',
    courseId: '2',
    enrolledAt: new Date('2024-05-01'),
    progress: 30,
    completedLessons: ['2-1'],
    lastAccessedAt: new Date('2024-12-21')
  },
  {
    id: '5',
    studentId: '6',
    courseId: '3',
    enrolledAt: new Date('2024-04-15'),
    progress: 60,
    completedLessons: ['3-1', '3-2'],
    lastAccessedAt: new Date('2024-12-20')
  }
]