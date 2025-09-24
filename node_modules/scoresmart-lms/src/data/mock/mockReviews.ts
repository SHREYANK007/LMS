import { Review } from '@/types'

// Mock reviews data
export const mockReviews: Review[] = [
  {
    id: '1',
    studentId: 'student1',
    tutorId: 'tutor1',
    sessionId: '1',
    rating: 5,
    comment: 'Dr. Sarah Wilson is an exceptional tutor! Her Smart Quad sessions are incredibly well-structured and engaging. She provides detailed feedback and creates a supportive learning environment. I\'ve seen significant improvement in my PTE speaking skills.',
    isAnonymous: false,
    isApproved: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    studentId: 'student2',
    tutorId: 'tutor1',
    sessionId: '2',
    rating: 4,
    comment: 'Great teaching methodology and very patient with students. The one-to-one session helped me understand my weak areas in writing. Would definitely recommend!',
    isAnonymous: false,
    isApproved: true,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '3',
    studentId: 'student3',
    tutorId: 'tutor2',
    sessionId: '3',
    rating: 5,
    comment: 'Prof. Michael Brown\'s NAATI classes are outstanding. His deep knowledge of translation techniques and real-world examples make the sessions incredibly valuable. Highly recommended for anyone serious about NAATI certification.',
    isAnonymous: false,
    isApproved: true,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '4',
    studentId: 'student4',
    tutorId: 'tutor3',
    sessionId: '4',
    rating: 5,
    comment: 'Dr. Lisa Chen\'s masterclass was phenomenal! The advanced strategies she shared for both PTE and NAATI were game-changing. Her expertise and teaching style are unmatched.',
    isAnonymous: false,
    isApproved: true,
    createdAt: new Date('2024-01-08')
  },
  {
    id: '5',
    studentId: 'student5',
    tutorId: 'tutor1',
    sessionId: '5',
    rating: 4,
    comment: 'Very helpful session. Sarah explained the PTE reading techniques clearly and provided practical tips. The practice exercises were particularly useful.',
    isAnonymous: true,
    isApproved: true,
    createdAt: new Date('2024-01-14')
  },
  {
    id: '6',
    studentId: 'student1',
    tutorId: 'tutor2',
    sessionId: '6',
    rating: 4,
    comment: 'Good session overall. Michael\'s approach to NAATI ethics was comprehensive. Could benefit from more interactive elements, but the content was solid.',
    isAnonymous: false,
    isApproved: true,
    createdAt: new Date('2024-01-13')
  },
  {
    id: '7',
    studentId: 'student6',
    tutorId: 'tutor1',
    sessionId: '7',
    rating: 5,
    comment: 'Amazing tutor! Sarah\'s feedback is always constructive and actionable. The Smart Quad format works perfectly for collaborative learning. Best investment for PTE preparation!',
    isAnonymous: false,
    isApproved: true,
    createdAt: new Date('2024-01-11')
  },
  {
    id: '8',
    studentId: 'student2',
    tutorId: 'tutor3',
    sessionId: '8',
    rating: 5,
    comment: 'Dr. Chen\'s expertise in both PTE and NAATI is remarkable. Her masterclass provided insights I couldn\'t find anywhere else. Definitely worth every penny!',
    isAnonymous: false,
    isApproved: true,
    createdAt: new Date('2024-01-09')
  },
  {
    id: '9',
    studentId: 'student7',
    tutorId: 'tutor2',
    sessionId: '9',
    rating: 3,
    comment: 'The session was okay. Content was good but the pace was a bit slow for my liking. Would prefer more intensive sessions.',
    isAnonymous: true,
    isApproved: true,
    createdAt: new Date('2024-01-07')
  },
  {
    id: '10',
    studentId: 'student3',
    tutorId: 'tutor1',
    sessionId: '10',
    rating: 5,
    comment: 'Sarah is simply the best! Her teaching methods are innovative and effective. I scored my target in PTE thanks to her guidance. Highly recommend her Smart Quad sessions!',
    isAnonymous: false,
    isApproved: true,
    createdAt: new Date('2024-01-16')
  }
]

// Additional mock data for tutor information
export const mockTutorInfo = [
  {
    id: 'tutor1',
    name: 'Dr. Sarah Wilson',
    avatar: 'SW',
    specializations: ['PTE Speaking', 'PTE Writing', 'Academic English'],
    experience: '8 years',
    totalReviews: 156,
    averageRating: 4.8,
    responseRate: '98%',
    bio: 'Dr. Sarah Wilson is a certified English language instructor with over 8 years of experience in PTE preparation. She holds a PhD in Applied Linguistics and has helped over 500 students achieve their target scores.',
    achievements: ['Top Rated Tutor 2023', 'Excellence in Teaching Award', '500+ Successful Students'],
    sessionTypes: ['Smart Quad', 'One-to-One'],
    languages: ['English (Native)', 'Spanish (Fluent)']
  },
  {
    id: 'tutor2',
    name: 'Prof. Michael Brown',
    avatar: 'MB',
    specializations: ['NAATI Translation', 'NAATI Interpretation', 'Professional Ethics'],
    experience: '12 years',
    totalReviews: 98,
    averageRating: 4.7,
    responseRate: '95%',
    bio: 'Professor Michael Brown is a NAATI-certified translator and interpreter with 12 years of professional experience. He has worked with government agencies and international organizations.',
    achievements: ['NAATI Expert Certified', 'Professional Excellence Award', '300+ Certified Students'],
    sessionTypes: ['Smart Quad', 'One-to-One'],
    languages: ['English (Native)', 'Mandarin (Fluent)', 'French (Intermediate)']
  },
  {
    id: 'tutor3',
    name: 'Dr. Lisa Chen',
    avatar: 'LC',
    specializations: ['Advanced PTE Strategies', 'NAATI Certification', 'Cross-cultural Communication'],
    experience: '10 years',
    totalReviews: 134,
    averageRating: 4.9,
    responseRate: '99%',
    bio: 'Dr. Lisa Chen is a bilingual education specialist with expertise in both PTE and NAATI preparation. She has published research on language assessment and cross-cultural communication.',
    achievements: ['Bilingual Education Expert', 'Research Excellence Award', 'Innovation in Teaching'],
    sessionTypes: ['Masterclass', 'One-to-One'],
    languages: ['English (Native)', 'Mandarin (Native)', 'Japanese (Intermediate)']
  }
]

// Helper functions
export const getReviewsByTutor = (tutorId: string) => {
  return mockReviews.filter(review => review.tutorId === tutorId && review.isApproved)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export const getReviewsByStudent = (studentId: string) => {
  return mockReviews.filter(review => review.studentId === studentId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export const getReviewsByRating = (rating: number) => {
  return mockReviews.filter(review => review.rating === rating && review.isApproved)
}

export const getAverageRatingForTutor = (tutorId: string) => {
  const tutorReviews = getReviewsByTutor(tutorId)
  if (tutorReviews.length === 0) return 0

  const totalRating = tutorReviews.reduce((sum, review) => sum + review.rating, 0)
  return Math.round((totalRating / tutorReviews.length) * 10) / 10
}

export const getRatingDistribution = (tutorId: string) => {
  const tutorReviews = getReviewsByTutor(tutorId)
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

  tutorReviews.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++
  })

  return distribution
}

export const getRecentReviews = (days: number = 30) => {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  return mockReviews.filter(review =>
    review.isApproved &&
    review.createdAt >= cutoffDate
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export const getTopRatedTutors = () => {
  const tutorRatings = mockTutorInfo.map(tutor => ({
    ...tutor,
    calculatedRating: getAverageRatingForTutor(tutor.id),
    reviewCount: getReviewsByTutor(tutor.id).length
  }))

  return tutorRatings
    .filter(tutor => tutor.reviewCount >= 5) // Minimum 5 reviews
    .sort((a, b) => b.calculatedRating - a.calculatedRating)
}

export const getTutorById = (tutorId: string) => {
  return mockTutorInfo.find(tutor => tutor.id === tutorId)
}

// Review statistics
export const getReviewStats = () => {
  const totalReviews = mockReviews.filter(r => r.isApproved).length
  const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
  const fiveStarReviews = mockReviews.filter(r => r.rating === 5 && r.isApproved).length
  const recentReviews = getRecentReviews(7).length

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    fiveStarPercentage: Math.round((fiveStarReviews / totalReviews) * 100),
    recentReviews
  }
}