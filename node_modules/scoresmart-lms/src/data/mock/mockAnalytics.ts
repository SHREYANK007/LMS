export interface LearningProgress {
  userId: string
  courseType: 'PTE' | 'NAATI' | 'BOTH'
  overallProgress: number
  skillBreakdown: {
    speaking: number
    writing: number
    reading: number
    listening: number
    translation?: number
    interpretation?: number
  }
  weeklyGoal: number
  weeklyProgress: number
  streak: number
  totalHours: number
  completedSessions: number
  averageScore: number
  improvement: number
  milestones: Milestone[]
  predictions: PerformancePrediction
  updatedAt: Date
}

export interface Milestone {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  isCompleted: boolean
  completedAt?: Date
  reward: string
  category: 'sessions' | 'scores' | 'skills' | 'time' | 'consistency'
}

export interface PerformancePrediction {
  expectedScore: number
  confidenceLevel: number
  readinessDate: Date
  recommendedActions: string[]
  strongAreas: string[]
  improvementAreas: string[]
}

export interface StudySession {
  id: string
  userId: string
  type: 'smart-quad' | 'one-to-one' | 'masterclass' | 'self-study'
  subject: string
  duration: number
  startTime: Date
  endTime: Date
  scores?: {
    speaking?: number
    writing?: number
    reading?: number
    listening?: number
  }
  feedback: string
  tutorId?: string
  materials: string[]
  notes: string
  effectiveness: number
}

export interface ActivityLog {
  id: string
  userId: string
  action: string
  category: 'learning' | 'system' | 'social' | 'assessment'
  details: any
  timestamp: Date
  ipAddress: string
  userAgent: string
  sessionId: string
}

export interface PerformanceMetrics {
  userId: string
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  startDate: Date
  endDate: Date
  metrics: {
    totalStudyTime: number
    sessionsAttended: number
    averageSessionDuration: number
    skillsImprovement: Record<string, number>
    goalCompletion: number
    engagementScore: number
    retentionRate: number
  }
  trends: {
    studyTimeGrowth: number
    scoreImprovement: number
    consistencyScore: number
  }
  comparisons: {
    previousPeriod: number
    peerAverage: number
    topPerformers: number
  }
}

// Mock learning progress data
export const mockLearningProgress: LearningProgress[] = [
  {
    userId: 'student1',
    courseType: 'PTE',
    overallProgress: 74,
    skillBreakdown: {
      speaking: 78,
      writing: 72,
      reading: 81,
      listening: 65
    },
    weeklyGoal: 10,
    weeklyProgress: 7,
    streak: 12,
    totalHours: 156,
    completedSessions: 23,
    averageScore: 76.5,
    improvement: 8.2,
    milestones: [
      {
        id: 'milestone_1',
        title: 'First 10 Sessions',
        description: 'Complete your first 10 learning sessions',
        targetValue: 10,
        currentValue: 10,
        isCompleted: true,
        completedAt: new Date('2024-01-10'),
        reward: 'Study Streak Badge',
        category: 'sessions'
      },
      {
        id: 'milestone_2',
        title: 'Speaking Specialist',
        description: 'Achieve 80+ average in Speaking modules',
        targetValue: 80,
        currentValue: 78,
        isCompleted: false,
        reward: 'Speaking Master Badge',
        category: 'scores'
      },
      {
        id: 'milestone_3',
        title: '100 Hours Dedication',
        description: 'Complete 100 hours of study time',
        targetValue: 100,
        currentValue: 156,
        isCompleted: true,
        completedAt: new Date('2024-01-15'),
        reward: 'Dedicated Learner Badge',
        category: 'time'
      }
    ],
    predictions: {
      expectedScore: 82,
      confidenceLevel: 85,
      readinessDate: new Date('2024-02-15'),
      recommendedActions: [
        'Focus on listening comprehension practice',
        'Schedule 2 more one-to-one sessions',
        'Complete advanced speaking exercises'
      ],
      strongAreas: ['Reading Comprehension', 'Written Discourse', 'Vocabulary'],
      improvementAreas: ['Listening', 'Pronunciation', 'Fluency']
    },
    updatedAt: new Date('2024-01-18')
  },
  {
    userId: 'student2',
    courseType: 'NAATI',
    overallProgress: 62,
    skillBreakdown: {
      speaking: 58,
      writing: 64,
      reading: 70,
      listening: 55,
      translation: 68,
      interpretation: 52
    },
    weeklyGoal: 8,
    weeklyProgress: 5,
    streak: 5,
    totalHours: 89,
    completedSessions: 14,
    averageScore: 61.8,
    improvement: 12.5,
    milestones: [
      {
        id: 'milestone_4',
        title: 'Translation Accuracy',
        description: 'Achieve 70+ accuracy in translation tasks',
        targetValue: 70,
        currentValue: 68,
        isCompleted: false,
        reward: 'Translation Expert Badge',
        category: 'scores'
      }
    ],
    predictions: {
      expectedScore: 75,
      confidenceLevel: 72,
      readinessDate: new Date('2024-03-01'),
      recommendedActions: [
        'Practice interpretation skills daily',
        'Improve cultural knowledge',
        'Focus on ethical standards'
      ],
      strongAreas: ['Translation Accuracy', 'Cultural Awareness'],
      improvementAreas: ['Interpretation Speed', 'Note-taking', 'Sight Translation']
    },
    updatedAt: new Date('2024-01-18')
  }
]

// Mock study sessions
export const mockStudySessions: StudySession[] = [
  {
    id: 'session_1',
    userId: 'student1',
    type: 'smart-quad',
    subject: 'PTE Speaking Workshop',
    duration: 90,
    startTime: new Date('2024-01-18T10:00:00'),
    endTime: new Date('2024-01-18T11:30:00'),
    scores: {
      speaking: 82,
      listening: 78
    },
    feedback: 'Excellent improvement in fluency and pronunciation. Focus on summarizing spoken text.',
    tutorId: 'tutor1',
    materials: ['speaking_templates.pdf', 'pronunciation_guide.mp3'],
    notes: 'Practiced read aloud and repeat sentence. Need to work on stress patterns.',
    effectiveness: 92
  },
  {
    id: 'session_2',
    userId: 'student1',
    type: 'one-to-one',
    subject: 'Writing Assessment Review',
    duration: 60,
    startTime: new Date('2024-01-17T15:00:00'),
    endTime: new Date('2024-01-17T16:00:00'),
    scores: {
      writing: 75
    },
    feedback: 'Good structure and vocabulary. Work on time management and conclusion development.',
    tutorId: 'tutor1',
    materials: ['writing_samples.pdf', 'essay_structure.docx'],
    notes: 'Reviewed essay writing techniques. Practice timed writing exercises.',
    effectiveness: 88
  },
  {
    id: 'session_3',
    userId: 'student1',
    type: 'self-study',
    subject: 'Reading Practice',
    duration: 45,
    startTime: new Date('2024-01-16T14:00:00'),
    endTime: new Date('2024-01-16T14:45:00'),
    scores: {
      reading: 85
    },
    feedback: 'Self-assessed practice session. Good comprehension of academic texts.',
    materials: ['reading_passages.pdf', 'vocabulary_list.xlsx'],
    notes: 'Completed 3 reading passages. Vocabulary building exercise.',
    effectiveness: 78
  }
]

// Mock activity logs
export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log_1',
    userId: 'student1',
    action: 'SESSION_ATTENDED',
    category: 'learning',
    details: {
      sessionId: 'session_1',
      sessionType: 'smart-quad',
      duration: 90,
      tutor: 'Dr. Sarah Wilson'
    },
    timestamp: new Date('2024-01-18T10:00:00'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_abc123'
  },
  {
    id: 'log_2',
    userId: 'student1',
    action: 'MATERIAL_ACCESSED',
    category: 'learning',
    details: {
      materialId: 'mat_123',
      materialType: 'pdf',
      fileName: 'speaking_templates.pdf',
      duration: 15
    },
    timestamp: new Date('2024-01-18T09:45:00'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_abc123'
  },
  {
    id: 'log_3',
    userId: 'student1',
    action: 'SCORE_ACHIEVED',
    category: 'assessment',
    details: {
      assessmentType: 'speaking',
      score: 82,
      maxScore: 90,
      improvement: 5
    },
    timestamp: new Date('2024-01-18T11:30:00'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_abc123'
  },
  {
    id: 'log_4',
    userId: 'student1',
    action: 'LOGIN',
    category: 'system',
    details: {
      loginMethod: 'email',
      success: true
    },
    timestamp: new Date('2024-01-18T09:30:00'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_abc123'
  }
]

// Mock performance metrics
export const mockPerformanceMetrics: PerformanceMetrics[] = [
  {
    userId: 'student1',
    period: 'weekly',
    startDate: new Date('2024-01-14'),
    endDate: new Date('2024-01-20'),
    metrics: {
      totalStudyTime: 12.5,
      sessionsAttended: 4,
      averageSessionDuration: 75,
      skillsImprovement: {
        speaking: 8,
        writing: 5,
        reading: 3,
        listening: 12
      },
      goalCompletion: 80,
      engagementScore: 92,
      retentionRate: 95
    },
    trends: {
      studyTimeGrowth: 15,
      scoreImprovement: 8.5,
      consistencyScore: 88
    },
    comparisons: {
      previousPeriod: 12,
      peerAverage: -5,
      topPerformers: -15
    }
  },
  {
    userId: 'student1',
    period: 'monthly',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    metrics: {
      totalStudyTime: 45.2,
      sessionsAttended: 18,
      averageSessionDuration: 78,
      skillsImprovement: {
        speaking: 12,
        writing: 8,
        reading: 6,
        listening: 15
      },
      goalCompletion: 85,
      engagementScore: 89,
      retentionRate: 94
    },
    trends: {
      studyTimeGrowth: 22,
      scoreImprovement: 12.3,
      consistencyScore: 85
    },
    comparisons: {
      previousPeriod: 25,
      peerAverage: 8,
      topPerformers: -12
    }
  }
]

// Helper functions
export const getLearningProgressByUser = (userId: string) => {
  return mockLearningProgress.find(progress => progress.userId === userId)
}

export const getStudySessionsByUser = (userId: string) => {
  return mockStudySessions.filter(session => session.userId === userId)
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
}

export const getActivityLogsByUser = (userId: string, limit?: number) => {
  const logs = mockActivityLogs.filter(log => log.userId === userId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  return limit ? logs.slice(0, limit) : logs
}

export const getPerformanceMetricsByUser = (userId: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
  return mockPerformanceMetrics.filter(metric => metric.userId === userId && metric.period === period)
}

export const calculateStreakDays = (sessions: StudySession[]) => {
  if (sessions.length === 0) return 0

  const sessionDates = sessions.map(s => s.startTime.toDateString())
  const uniqueDates = [...new Set(sessionDates)].sort()

  let streak = 0
  const today = new Date().toDateString()

  for (let i = uniqueDates.length - 1; i >= 0; i--) {
    const date = new Date(uniqueDates[i])
    const daysDiff = Math.floor((new Date(today).getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === streak) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export const getWeeklyProgress = (sessions: StudySession[], weeklyGoal: number) => {
  const now = new Date()
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
  weekStart.setHours(0, 0, 0, 0)

  const weekSessions = sessions.filter(session => session.startTime >= weekStart)
  return Math.min(weekSessions.length, weeklyGoal)
}

export const calculateSkillAverages = (sessions: StudySession[]) => {
  const skills = ['speaking', 'writing', 'reading', 'listening']
  const averages: Record<string, number> = {}

  skills.forEach(skill => {
    const scores = sessions
      .map(s => s.scores?.[skill as keyof typeof s.scores])
      .filter(score => score !== undefined) as number[]

    if (scores.length > 0) {
      averages[skill] = scores.reduce((sum, score) => sum + score, 0) / scores.length
    }
  })

  return averages
}

export const getPredictedPerformance = (progress: LearningProgress) => {
  const { skillBreakdown, averageScore, improvement, totalHours } = progress

  // Simple prediction algorithm based on current performance and trends
  const skillAverage = Object.values(skillBreakdown).reduce((sum, score) => sum + score, 0) / Object.values(skillBreakdown).length
  const hoursWeight = Math.min(totalHours / 200, 1) // Cap at 200 hours for full weight
  const improvementWeight = Math.min(improvement / 20, 1) // Cap at 20 points improvement

  const predictedScore = Math.round(
    skillAverage * 0.6 +
    averageScore * 0.3 +
    (hoursWeight * 10) +
    (improvementWeight * 5)
  )

  const confidence = Math.round(
    (hoursWeight * 40) +
    (improvementWeight * 30) +
    (skillAverage > 70 ? 30 : skillAverage * 0.43)
  )

  return {
    expectedScore: Math.min(predictedScore, 90),
    confidenceLevel: Math.min(confidence, 95)
  }
}

export const getInsights = (progress: LearningProgress, sessions: StudySession[]) => {
  const insights: string[] = []

  // Consistency insights
  if (progress.streak >= 7) {
    insights.push(`🔥 Amazing! You have a ${progress.streak}-day study streak!`)
  } else if (progress.streak < 3) {
    insights.push('📅 Try to study more consistently for better results')
  }

  // Performance insights
  const topSkill = Object.entries(progress.skillBreakdown)
    .sort(([,a], [,b]) => b - a)[0]
  insights.push(`🌟 Your strongest skill is ${topSkill[0]} (${topSkill[1]}%)`)

  // Improvement insights
  if (progress.improvement > 10) {
    insights.push(`📈 Excellent progress! You've improved by ${progress.improvement} points`)
  }

  // Goal insights
  const goalProgress = (progress.weeklyProgress / progress.weeklyGoal) * 100
  if (goalProgress >= 100) {
    insights.push('🎯 Weekly goal completed! Great job!')
  } else if (goalProgress >= 70) {
    insights.push('🎯 Almost there! You\'re close to your weekly goal')
  }

  return insights
}

// Analytics dashboard data
export const getAnalyticsSummary = (userId: string) => {
  const progress = getLearningProgressByUser(userId)
  const sessions = getStudySessionsByUser(userId)
  const metrics = getPerformanceMetricsByUser(userId, 'weekly')[0]

  if (!progress || !metrics) return null

  return {
    overview: {
      totalSessions: progress.completedSessions,
      totalHours: progress.totalHours,
      averageScore: progress.averageScore,
      improvement: progress.improvement,
      streak: progress.streak
    },
    goals: {
      weeklyTarget: progress.weeklyGoal,
      weeklyProgress: progress.weeklyProgress,
      completion: (progress.weeklyProgress / progress.weeklyGoal) * 100
    },
    skills: progress.skillBreakdown,
    trends: metrics.trends,
    predictions: progress.predictions,
    insights: getInsights(progress, sessions),
    recentSessions: sessions.slice(0, 5)
  }
}

// Mock real-time analytics service
export const mockAnalyticsService = {
  trackEvent: async (userId: string, event: string, properties: any) => {
    const log: ActivityLog = {
      id: `log_${Date.now()}`,
      userId,
      action: event,
      category: properties.category || 'system',
      details: properties,
      timestamp: new Date(),
      ipAddress: '192.168.1.100',
      userAgent: 'Mock User Agent',
      sessionId: `sess_${Date.now()}`
    }

    mockActivityLogs.unshift(log)
    return log
  },

  updateProgress: async (userId: string, updates: Partial<LearningProgress>) => {
    const progress = getLearningProgressByUser(userId)
    if (progress) {
      Object.assign(progress, updates, { updatedAt: new Date() })
      return progress
    }
    return null
  },

  logSession: async (session: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...session,
      id: `session_${Date.now()}`
    }

    mockStudySessions.unshift(newSession)
    return newSession
  },

  generateReport: async (userId: string, period: 'weekly' | 'monthly' | 'yearly') => {
    // Mock report generation
    return {
      id: `report_${Date.now()}`,
      userId,
      period,
      generatedAt: new Date(),
      summary: getAnalyticsSummary(userId),
      downloadUrl: `/api/reports/${userId}/${period}`
    }
  }
}