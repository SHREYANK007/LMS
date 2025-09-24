import { StudyMaterial } from '@/types'

export const mockStudyMaterials: StudyMaterial[] = [
  // PTE Materials
  {
    id: '1',
    title: 'PTE Academic Speaking Guide 2024',
    description: 'Comprehensive guide covering all speaking tasks including personal introduction, read aloud, repeat sentence, describe image, and answer short questions.',
    fileUrl: '/demo-content/documents/pte-speaking-guide.pdf',
    fileType: 'pdf',
    courseType: 'PTE',
    visibility: 'all_course_students',
    category: 'Speaking',
    tags: ['speaking', 'guide', 'fundamentals', '2024'],
    uploadedBy: '1', // Admin
    uploadedByRole: 'admin',
    allowDownload: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'PTE Writing Templates & Strategies',
    description: 'Essential templates and strategies for summarize written text, essay writing, and all writing tasks with scoring criteria.',
    fileUrl: '/demo-content/documents/pte-writing-templates.pdf',
    fileType: 'pdf',
    courseType: 'PTE',
    visibility: 'all_course_students',
    category: 'Writing',
    tags: ['writing', 'templates', 'essay', 'strategies'],
    uploadedBy: '1',
    uploadedByRole: 'admin',
    allowDownload: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: '3',
    title: 'PTE Reading Comprehension Techniques',
    description: 'Advanced techniques for multiple choice, re-order paragraphs, fill in the blanks, and reading & writing fill in the blanks.',
    fileUrl: '/demo-content/documents/pte-reading-techniques.pdf',
    fileType: 'pdf',
    courseType: 'PTE',
    visibility: 'my_students_only',
    category: 'Reading',
    tags: ['reading', 'comprehension', 'techniques', 'advanced'],
    uploadedBy: '2', // Dr. Sarah Wilson
    uploadedByRole: 'tutor',
    allowDownload: false,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: '4',
    title: 'PTE Listening Practice Tests',
    description: 'Collection of practice tests for all listening tasks including summarize spoken text, multiple choice, highlight correct summary, and more.',
    fileUrl: '/demo-content/documents/pte-listening-tests.pdf',
    fileType: 'pdf',
    courseType: 'PTE',
    visibility: 'all_course_students',
    category: 'Listening',
    tags: ['listening', 'practice', 'tests', 'mock'],
    uploadedBy: '3', // Prof. Michael Brown
    uploadedByRole: 'tutor',
    allowDownload: true,
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-03-01')
  },

  // NAATI Materials
  {
    id: '5',
    title: 'NAATI CCL Dialogue Practice',
    description: 'Authentic dialogue practice sessions for NAATI CCL test preparation with common scenarios and vocabulary.',
    fileUrl: '/demo-content/documents/naati-dialogue-practice.pdf',
    fileType: 'pdf',
    courseType: 'NAATI',
    visibility: 'all_course_students',
    category: 'Dialogue',
    tags: ['naati', 'ccl', 'dialogue', 'practice'],
    uploadedBy: '1',
    uploadedByRole: 'admin',
    allowDownload: false,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '6',
    title: 'NAATI Translation Techniques',
    description: 'Professional translation techniques and strategies for NAATI certification tests with industry best practices.',
    fileUrl: '/demo-content/documents/naati-translation-techniques.pdf',
    fileType: 'pdf',
    courseType: 'NAATI',
    visibility: 'my_students_only',
    category: 'Translation',
    tags: ['naati', 'translation', 'techniques', 'professional'],
    uploadedBy: '8', // Dr. Lisa Chen
    uploadedByRole: 'tutor',
    allowDownload: true,
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20')
  },
  {
    id: '7',
    title: 'NAATI Ethics and Professional Standards',
    description: 'Comprehensive guide to NAATI ethics, professional standards, and code of conduct for interpreters and translators.',
    fileUrl: '/demo-content/documents/naati-ethics-guide.pdf',
    fileType: 'pdf',
    courseType: 'NAATI',
    visibility: 'all_course_students',
    category: 'Ethics',
    tags: ['naati', 'ethics', 'professional', 'standards', 'code'],
    uploadedBy: '1',
    uploadedByRole: 'admin',
    allowDownload: false,
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-02-28')
  },

  // Both Courses Materials
  {
    id: '8',
    title: 'Academic Vocabulary Builder',
    description: 'Essential academic vocabulary for both PTE and NAATI with examples, synonyms, and usage in context.',
    fileUrl: '/demo-content/documents/academic-vocabulary.pdf',
    fileType: 'pdf',
    courseType: 'BOTH',
    visibility: 'all_course_students',
    category: 'Vocabulary',
    tags: ['vocabulary', 'academic', 'both', 'essential'],
    uploadedBy: '1',
    uploadedByRole: 'admin',
    allowDownload: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-03-15')
  },
  {
    id: '9',
    title: 'Test Anxiety Management Strategies',
    description: 'Psychological strategies and techniques to manage test anxiety for both PTE and NAATI examinations.',
    fileUrl: '/demo-content/documents/test-anxiety-strategies.pdf',
    fileType: 'pdf',
    courseType: 'BOTH',
    visibility: 'all_course_students',
    category: 'Psychology',
    tags: ['anxiety', 'psychology', 'strategies', 'mental-health'],
    uploadedBy: '2',
    uploadedByRole: 'tutor',
    allowDownload: false,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: '10',
    title: 'Study Schedule Template',
    description: 'Customizable study schedule templates for effective preparation planning across different time frames.',
    fileUrl: '/demo-content/documents/study-schedule-template.xlsx',
    fileType: 'xlsx',
    courseType: 'BOTH',
    visibility: 'all_course_students',
    category: 'Planning',
    tags: ['schedule', 'planning', 'template', 'organization'],
    uploadedBy: '1',
    uploadedByRole: 'admin',
    allowDownload: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },

  // Video Materials
  {
    id: '11',
    title: 'PTE Speaking Masterclass Recording',
    description: 'Complete recording of live masterclass covering advanced PTE speaking strategies and practice sessions.',
    fileUrl: '/demo-content/videos/pte-speaking-masterclass.mp4',
    fileType: 'mp4',
    courseType: 'PTE',
    visibility: 'all_course_students',
    category: 'Masterclass',
    tags: ['speaking', 'masterclass', 'video', 'live-session'],
    uploadedBy: '2',
    uploadedByRole: 'tutor',
    allowDownload: false,
    createdAt: new Date('2024-03-25'),
    updatedAt: new Date('2024-03-25')
  },
  {
    id: '12',
    title: 'NAATI Interpretation Demo',
    description: 'Demonstration video showing proper interpretation techniques and real-world scenarios for NAATI preparation.',
    fileUrl: '/demo-content/videos/naati-interpretation-demo.mp4',
    fileType: 'mp4',
    courseType: 'NAATI',
    visibility: 'my_students_only',
    category: 'Demonstration',
    tags: ['naati', 'interpretation', 'demo', 'video'],
    uploadedBy: '8',
    uploadedByRole: 'tutor',
    allowDownload: false,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01')
  }
]

// Categories for materials
export const materialCategories = [
  'Speaking',
  'Writing',
  'Reading',
  'Listening',
  'Dialogue',
  'Translation',
  'Ethics',
  'Vocabulary',
  'Psychology',
  'Planning',
  'Masterclass',
  'Demonstration',
  'Practice Tests',
  'Grammar',
  'Pronunciation'
]

// Common tags
export const commonTags = [
  'speaking',
  'writing',
  'reading',
  'listening',
  'pte',
  'naati',
  'practice',
  'guide',
  'templates',
  'strategies',
  'techniques',
  'fundamentals',
  'advanced',
  'vocabulary',
  'grammar',
  'pronunciation',
  'mock-tests',
  'sample-answers',
  'tips',
  'tricks'
]

// Helper functions
export const getMaterialsByCourse = (courseType: 'PTE' | 'NAATI' | 'BOTH') => {
  return mockStudyMaterials.filter(material =>
    material.courseType === courseType || material.courseType === 'BOTH'
  )
}

export const getMaterialsByCategory = (category: string) => {
  return mockStudyMaterials.filter(material => material.category === category)
}

export const getMaterialsByUploader = (uploaderId: string) => {
  return mockStudyMaterials.filter(material => material.uploadedBy === uploaderId)
}

export const getVisibleMaterials = (studentCourseType: 'PTE' | 'NAATI' | 'BOTH', tutorId?: string) => {
  return mockStudyMaterials.filter(material => {
    // Check course type compatibility
    const courseMatch = material.courseType === studentCourseType ||
                       material.courseType === 'BOTH' ||
                       studentCourseType === 'BOTH'

    if (!courseMatch) return false

    // Check visibility
    if (material.visibility === 'all_course_students') return true
    if (material.visibility === 'my_students_only' && tutorId && material.uploadedBy === tutorId) return true

    return false
  })
}