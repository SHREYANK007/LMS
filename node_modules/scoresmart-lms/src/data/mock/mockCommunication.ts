import { Announcement, FAQ, Feedback, FeedbackResponse } from '@/types'

// Mock announcements data
export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'New PTE Speaking Module Released',
    content: 'We\'re excited to announce the launch of our advanced PTE Speaking module with AI-powered feedback. This module includes real-time pronunciation analysis and detailed feedback on fluency and content.',
    type: 'info',
    courseType: 'PTE',
    isGlobal: false,
    targetRole: 'student',
    createdBy: 'admin1',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    expiresAt: new Date('2024-02-15')
  },
  {
    id: '2',
    title: 'System Maintenance Scheduled',
    content: 'Our platform will undergo scheduled maintenance on January 20th from 2:00 AM to 4:00 AM EST. During this time, some features may be temporarily unavailable.',
    type: 'urgent',
    isGlobal: true,
    createdBy: 'admin1',
    isActive: true,
    createdAt: new Date('2024-01-10'),
    expiresAt: new Date('2024-01-21')
  },
  {
    id: '3',
    title: 'New NAATI Certification Guidelines',
    content: 'Important updates to NAATI certification requirements have been published. Please review the updated guidelines in your course materials section.',
    type: 'info',
    courseType: 'NAATI',
    isGlobal: false,
    targetRole: 'student',
    createdBy: 'admin1',
    isActive: true,
    createdAt: new Date('2024-01-12'),
    expiresAt: new Date('2024-03-12')
  },
  {
    id: '4',
    title: 'Limited Time Offer: 20% Off One-to-One Sessions',
    content: 'Book your one-to-one sessions this month and save 20%! This special offer is valid until the end of January. Use code SAVE20 at checkout.',
    type: 'offer',
    isGlobal: true,
    targetRole: 'student',
    createdBy: 'admin1',
    isActive: true,
    createdAt: new Date('2024-01-08'),
    expiresAt: new Date('2024-01-31')
  },
  {
    id: '5',
    title: 'New Tutor Onboarding Process',
    content: 'We\'ve streamlined our tutor onboarding process. New tutors can now complete their profile setup and training modules more efficiently.',
    type: 'info',
    isGlobal: false,
    targetRole: 'tutor',
    createdBy: 'admin1',
    isActive: true,
    createdAt: new Date('2024-01-14')
  }
]

// Mock FAQs data
export const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How do I book a Smart Quad session?',
    answer: 'To book a Smart Quad session, navigate to the Smart Quad page from your dashboard. You can either join an existing group or request to form a new one. Smart Quad sessions are limited to 4 students maximum for personalized attention.',
    category: 'Sessions',
    courseType: 'BOTH',
    isActive: true,
    order: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    question: 'What is the difference between PTE and NAATI courses?',
    answer: 'PTE (Pearson Test of English) is an English language proficiency test, while NAATI (National Accreditation Authority for Translators and Interpreters) is for translator and interpreter certification. Our PTE course focuses on English language skills, while NAATI course covers translation and interpretation techniques.',
    category: 'Courses',
    courseType: 'BOTH',
    isActive: true,
    order: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    question: 'Can I reschedule my One-to-One session?',
    answer: 'Yes, you can reschedule your One-to-One session up to 24 hours before the scheduled time. Go to your dashboard, find the session under "Upcoming Sessions," and click "Reschedule." Please note that same-day rescheduling may incur additional charges.',
    category: 'Sessions',
    courseType: 'BOTH',
    isActive: true,
    order: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    question: 'How do I access my study materials?',
    answer: 'All your study materials are available in the Materials section of your dashboard. Materials are organized by course type and module. You can view them online or download them for offline study (where permitted).',
    category: 'Materials',
    courseType: 'BOTH',
    isActive: true,
    order: 4,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '5',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. For enterprise accounts, we also offer invoice-based billing with NET 30 terms.',
    category: 'Payments',
    courseType: 'BOTH',
    isActive: true,
    order: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '6',
    question: 'How long do I have access to my course materials?',
    answer: 'Course access duration depends on your enrollment type. Standard courses provide 6 months of access, while premium packages offer 12 months. You can check your expiry date in your profile section.',
    category: 'Access',
    courseType: 'BOTH',
    isActive: true,
    order: 6,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '7',
    question: 'What happens if I miss a Masterclass session?',
    answer: 'Don\'t worry! All Masterclass sessions are recorded and available for replay within 48 hours. You can access the recording from your dashboard under "Completed Sessions." The recording includes the full session plus downloadable materials.',
    category: 'Sessions',
    courseType: 'BOTH',
    isActive: true,
    order: 7,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '8',
    question: 'How is my progress tracked?',
    answer: 'Your progress is automatically tracked through session attendance, assignment completions, and practice test scores. You can view detailed progress reports in your dashboard, including strengths, weaknesses, and recommendations for improvement.',
    category: 'Progress',
    courseType: 'BOTH',
    isActive: true,
    order: 8,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

// Mock feedback/support tickets data
export const mockFeedback: Feedback[] = [
  {
    id: '1',
    studentId: 'student1',
    subject: 'Technical Issue with Video Player',
    message: 'I\'m experiencing issues with the video player during sessions. The video keeps freezing and the audio cuts out intermittently. This has happened in my last 3 sessions.',
    attachments: [],
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'support1',
    responses: [
      {
        id: 'resp1',
        feedbackId: '1',
        responderId: 'support1',
        responderRole: 'admin',
        message: 'Thank you for reporting this issue. We\'re investigating the video player problems. Can you please let us know which browser you\'re using and your internet connection speed?',
        createdAt: new Date('2024-01-15T10:30:00')
      }
    ],
    createdAt: new Date('2024-01-15T09:15:00'),
    updatedAt: new Date('2024-01-15T10:30:00')
  },
  {
    id: '2',
    studentId: 'student2',
    subject: 'Request for Additional PTE Practice Materials',
    message: 'Hi, I\'ve completed all the available PTE reading materials and would like to request additional practice tests, especially for the "Fill in the Blanks" section.',
    status: 'resolved',
    priority: 'medium',
    assignedTo: 'tutor1',
    responses: [
      {
        id: 'resp2',
        feedbackId: '2',
        responderId: 'tutor1',
        responderRole: 'tutor',
        message: 'Great to hear you\'re making excellent progress! I\'ve added 5 additional Fill in the Blanks practice sets to your materials section. You should see them under "Advanced Practice."',
        createdAt: new Date('2024-01-14T14:20:00')
      }
    ],
    createdAt: new Date('2024-01-14T11:45:00'),
    updatedAt: new Date('2024-01-14T14:20:00')
  },
  {
    id: '3',
    studentId: 'student3',
    subject: 'Scheduling Conflict with Smart Quad Sessions',
    message: 'I have a recurring work meeting that conflicts with my Tuesday Smart Quad sessions. Is it possible to move to a different time slot or join a different group?',
    status: 'open',
    priority: 'medium',
    responses: [],
    createdAt: new Date('2024-01-16T08:30:00'),
    updatedAt: new Date('2024-01-16T08:30:00')
  },
  {
    id: '4',
    studentId: 'student4',
    subject: 'Feedback on Recent Masterclass',
    message: 'I wanted to thank Dr. Chen for the excellent NAATI masterclass on interpretation techniques. The practical exercises were very helpful. Could we have more sessions like this?',
    status: 'closed',
    priority: 'low',
    assignedTo: 'admin1',
    responses: [
      {
        id: 'resp3',
        feedbackId: '4',
        responderId: 'admin1',
        responderRole: 'admin',
        message: 'Thank you for the positive feedback! We\'re delighted that you found the masterclass helpful. We\'ll definitely schedule more interpretation technique sessions based on this feedback.',
        createdAt: new Date('2024-01-13T16:00:00')
      }
    ],
    createdAt: new Date('2024-01-13T12:15:00'),
    updatedAt: new Date('2024-01-13T16:00:00')
  },
  {
    id: '5',
    studentId: 'student5',
    subject: 'Payment Processing Error',
    message: 'I tried to renew my course subscription but the payment failed even though my card has sufficient funds. The error message says "Transaction declined." Can you help?',
    status: 'urgent',
    priority: 'urgent',
    assignedTo: 'admin1',
    responses: [],
    createdAt: new Date('2024-01-16T15:45:00'),
    updatedAt: new Date('2024-01-16T15:45:00')
  }
]

// Helper functions
export const getAnnouncementsByRole = (role: 'student' | 'tutor' | 'admin') => {
  return mockAnnouncements.filter(announcement =>
    announcement.isActive &&
    (announcement.targetRole === role || announcement.targetRole === 'all' || announcement.isGlobal)
  )
}

export const getAnnouncementsByCourse = (courseType: 'PTE' | 'NAATI' | 'BOTH') => {
  return mockAnnouncements.filter(announcement =>
    announcement.isActive &&
    (announcement.courseType === courseType || announcement.courseType === 'BOTH' || announcement.isGlobal)
  )
}

export const getFAQsByCategory = (category: string) => {
  return mockFAQs.filter(faq => faq.isActive && faq.category === category)
    .sort((a, b) => a.order - b.order)
}

export const getFAQsByCourse = (courseType: 'PTE' | 'NAATI' | 'BOTH') => {
  return mockFAQs.filter(faq =>
    faq.isActive &&
    (faq.courseType === courseType || faq.courseType === 'BOTH')
  ).sort((a, b) => a.order - b.order)
}

export const getFeedbackByStatus = (status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'urgent') => {
  return mockFeedback.filter(feedback => feedback.status === status)
}

export const getFeedbackByStudent = (studentId: string) => {
  return mockFeedback.filter(feedback => feedback.studentId === studentId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export const getFeedbackByPriority = (priority: 'low' | 'medium' | 'high' | 'urgent') => {
  return mockFeedback.filter(feedback => feedback.priority === priority)
}

export const getRecentFeedback = (days: number = 7) => {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  return mockFeedback.filter(feedback => feedback.createdAt >= cutoffDate)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

// Categories for filtering
export const faqCategories = [...new Set(mockFAQs.map(faq => faq.category))]
export const announcementTypes = ['info', 'urgent', 'offer'] as const