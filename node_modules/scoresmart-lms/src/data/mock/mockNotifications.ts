import { Session } from '@/types'

export interface Notification {
  id: string
  userId: string
  type: 'session_reminder' | 'payment_due' | 'course_update' | 'system_update' | 'achievement' | 'message'
  title: string
  message: string
  data?: any
  isRead: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'academic' | 'financial' | 'system' | 'social'
  createdAt: Date
  readAt?: Date
  expiresAt?: Date
  actionUrl?: string
  actionLabel?: string
}

export interface NotificationPreferences {
  userId: string
  emailNotifications: {
    sessionReminders: boolean
    paymentDue: boolean
    courseUpdates: boolean
    systemUpdates: boolean
    achievements: boolean
    messages: boolean
  }
  pushNotifications: {
    sessionReminders: boolean
    paymentDue: boolean
    courseUpdates: boolean
    systemUpdates: boolean
    achievements: boolean
    messages: boolean
  }
  inAppNotifications: {
    sessionReminders: boolean
    paymentDue: boolean
    courseUpdates: boolean
    systemUpdates: boolean
    achievements: boolean
    messages: boolean
  }
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly'
  quietHours: {
    enabled: boolean
    startTime: string
    endTime: string
  }
  updatedAt: Date
}

export interface SystemAlert {
  id: string
  type: 'maintenance' | 'outage' | 'security' | 'feature' | 'emergency'
  title: string
  message: string
  severity: 'info' | 'warning' | 'error' | 'success'
  isActive: boolean
  startTime: Date
  endTime?: Date
  affectedServices: string[]
  actionRequired: boolean
  actionUrl?: string
  actionLabel?: string
}

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    userId: 'student1',
    type: 'session_reminder',
    title: 'Session Starting Soon',
    message: 'Your PTE Speaking Workshop with Dr. Sarah Wilson starts in 30 minutes.',
    data: {
      sessionId: '1',
      tutorId: 'tutor1',
      startTime: new Date('2024-01-18T10:00:00')
    },
    isRead: false,
    priority: 'high',
    category: 'academic',
    createdAt: new Date('2024-01-18T09:30:00'),
    actionUrl: '/student/smart-quad',
    actionLabel: 'Join Session'
  },
  {
    id: 'notif_2',
    userId: 'student1',
    type: 'payment_due',
    title: 'Payment Reminder',
    message: 'Your course subscription will expire in 7 days. Please renew to continue accessing materials.',
    data: {
      amount: 1600,
      currency: 'USD',
      dueDate: new Date('2024-01-25T00:00:00')
    },
    isRead: false,
    priority: 'medium',
    category: 'financial',
    createdAt: new Date('2024-01-18T08:00:00'),
    actionUrl: '/student/payments',
    actionLabel: 'Make Payment'
  },
  {
    id: 'notif_3',
    userId: 'student1',
    type: 'achievement',
    title: 'Congratulations! 🎉',
    message: 'You\'ve completed 10 sessions! You\'re making excellent progress toward your PTE goals.',
    data: {
      achievementType: 'session_milestone',
      count: 10,
      badge: 'dedicated_learner'
    },
    isRead: true,
    priority: 'low',
    category: 'academic',
    createdAt: new Date('2024-01-17T15:00:00'),
    readAt: new Date('2024-01-17T16:30:00')
  },
  {
    id: 'notif_4',
    userId: 'student1',
    type: 'course_update',
    title: 'New Study Materials Available',
    message: 'Dr. Sarah Wilson has uploaded new PTE Speaking practice materials to your course.',
    data: {
      courseId: 'pte_complete',
      materialType: 'practice_tests',
      tutorId: 'tutor1'
    },
    isRead: false,
    priority: 'medium',
    category: 'academic',
    createdAt: new Date('2024-01-16T14:20:00'),
    actionUrl: '/student/materials',
    actionLabel: 'View Materials'
  },
  {
    id: 'notif_5',
    userId: 'student1',
    type: 'message',
    title: 'New Message from Tutor',
    message: 'Dr. Sarah Wilson sent you feedback on your recent writing assessment.',
    data: {
      messageId: 'msg_123',
      senderId: 'tutor1',
      senderName: 'Dr. Sarah Wilson'
    },
    isRead: false,
    priority: 'medium',
    category: 'social',
    createdAt: new Date('2024-01-15T11:45:00'),
    actionUrl: '/student/messages',
    actionLabel: 'Read Message'
  },
  {
    id: 'notif_6',
    userId: 'student1',
    type: 'system_update',
    title: 'Platform Update',
    message: 'New features added: Enhanced progress tracking and improved video quality for sessions.',
    data: {
      version: '2.1.0',
      features: ['progress_tracking', 'video_quality']
    },
    isRead: true,
    priority: 'low',
    category: 'system',
    createdAt: new Date('2024-01-14T09:00:00'),
    readAt: new Date('2024-01-14T10:15:00')
  },
  {
    id: 'notif_7',
    userId: 'student2',
    type: 'session_reminder',
    title: 'Session Reminder',
    message: 'Your NAATI Translation session with Prof. Michael Brown is tomorrow at 3:00 PM.',
    data: {
      sessionId: '6',
      tutorId: 'tutor2',
      startTime: new Date('2024-01-19T15:00:00')
    },
    isRead: false,
    priority: 'medium',
    category: 'academic',
    createdAt: new Date('2024-01-18T15:00:00'),
    actionUrl: '/student/one-to-one',
    actionLabel: 'View Details'
  },
  {
    id: 'notif_8',
    userId: 'student1',
    type: 'course_update',
    title: 'Score Improvement Tips',
    message: 'Based on your recent performance, here are personalized tips to improve your PTE score.',
    data: {
      improvementAreas: ['speaking_fluency', 'reading_speed'],
      recommendedActions: ['practice_daily', 'book_extra_sessions']
    },
    isRead: false,
    priority: 'medium',
    category: 'academic',
    createdAt: new Date('2024-01-13T12:00:00'),
    actionUrl: '/student/progress',
    actionLabel: 'View Tips'
  }
]

// Mock notification preferences
export const mockNotificationPreferences: NotificationPreferences[] = [
  {
    userId: 'student1',
    emailNotifications: {
      sessionReminders: true,
      paymentDue: true,
      courseUpdates: true,
      systemUpdates: false,
      achievements: true,
      messages: true
    },
    pushNotifications: {
      sessionReminders: true,
      paymentDue: true,
      courseUpdates: false,
      systemUpdates: false,
      achievements: true,
      messages: true
    },
    inAppNotifications: {
      sessionReminders: true,
      paymentDue: true,
      courseUpdates: true,
      systemUpdates: true,
      achievements: true,
      messages: true
    },
    frequency: 'immediate',
    quietHours: {
      enabled: true,
      startTime: '22:00',
      endTime: '07:00'
    },
    updatedAt: new Date('2024-01-15T10:00:00')
  }
]

// Mock system alerts
export const mockSystemAlerts: SystemAlert[] = [
  {
    id: 'alert_1',
    type: 'maintenance',
    title: 'Scheduled Maintenance',
    message: 'We\'ll be performing system maintenance on Sunday, January 21st from 2:00 AM to 4:00 AM EST. Some features may be temporarily unavailable.',
    severity: 'warning',
    isActive: true,
    startTime: new Date('2024-01-21T02:00:00'),
    endTime: new Date('2024-01-21T04:00:00'),
    affectedServices: ['video_sessions', 'file_uploads'],
    actionRequired: false
  },
  {
    id: 'alert_2',
    type: 'feature',
    title: 'New Feature: Progress Analytics',
    message: 'Track your learning progress with detailed analytics and personalized insights now available in your dashboard.',
    severity: 'success',
    isActive: true,
    startTime: new Date('2024-01-15T00:00:00'),
    affectedServices: ['dashboard', 'progress_tracking'],
    actionRequired: false,
    actionUrl: '/student/progress',
    actionLabel: 'Explore Now'
  },
  {
    id: 'alert_3',
    type: 'security',
    title: 'Security Update',
    message: 'We\'ve enhanced our security measures. Please review your account settings and enable two-factor authentication.',
    severity: 'warning',
    isActive: true,
    startTime: new Date('2024-01-10T00:00:00'),
    affectedServices: ['authentication', 'account_security'],
    actionRequired: true,
    actionUrl: '/settings/security',
    actionLabel: 'Update Security'
  }
]

// Helper functions
export const getNotificationsByUser = (userId: string) => {
  return mockNotifications.filter(notification => notification.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export const getUnreadNotifications = (userId: string) => {
  return getNotificationsByUser(userId).filter(notification => !notification.isRead)
}

export const getNotificationsByType = (userId: string, type: Notification['type']) => {
  return getNotificationsByUser(userId).filter(notification => notification.type === type)
}

export const getNotificationsByCategory = (userId: string, category: Notification['category']) => {
  return getNotificationsByUser(userId).filter(notification => notification.category === category)
}

export const getNotificationsByPriority = (userId: string, priority: Notification['priority']) => {
  return getNotificationsByUser(userId).filter(notification => notification.priority === priority)
}

export const getActiveSystemAlerts = () => {
  return mockSystemAlerts.filter(alert => alert.isActive)
}

export const getSystemAlertsBySeverity = (severity: SystemAlert['severity']) => {
  return mockSystemAlerts.filter(alert => alert.severity === severity && alert.isActive)
}

export const getUserNotificationPreferences = (userId: string) => {
  return mockNotificationPreferences.find(prefs => prefs.userId === userId)
}

export const markNotificationAsRead = (notificationId: string) => {
  const notification = mockNotifications.find(n => n.id === notificationId)
  if (notification && !notification.isRead) {
    notification.isRead = true
    notification.readAt = new Date()
  }
  return notification
}

export const markAllNotificationsAsRead = (userId: string) => {
  const userNotifications = getNotificationsByUser(userId)
  userNotifications.forEach(notification => {
    if (!notification.isRead) {
      notification.isRead = true
      notification.readAt = new Date()
    }
  })
  return userNotifications
}

export const getNotificationStats = (userId: string) => {
  const userNotifications = getNotificationsByUser(userId)
  const unreadCount = userNotifications.filter(n => !n.isRead).length
  const todayCount = userNotifications.filter(n => {
    const today = new Date()
    const notificationDate = n.createdAt
    return notificationDate.toDateString() === today.toDateString()
  }).length

  return {
    total: userNotifications.length,
    unread: unreadCount,
    today: todayCount,
    highPriority: userNotifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length
  }
}

// Mock real-time notification service
export const mockNotificationService = {
  subscribe: (userId: string, callback: (notification: Notification) => void) => {
    // Mock subscription - in real app this would use WebSockets or SSE
    console.log(`Subscribed to notifications for user: ${userId}`)

    // Simulate receiving a new notification every 30 seconds (for demo)
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: `notif_${Date.now()}`,
        userId,
        type: 'system_update',
        title: 'Real-time Notification',
        message: 'This is a simulated real-time notification for demo purposes.',
        isRead: false,
        priority: 'low',
        category: 'system',
        createdAt: new Date(),
      }
      callback(newNotification)
    }, 30000)

    return () => {
      clearInterval(interval)
      console.log(`Unsubscribed from notifications for user: ${userId}`)
    }
  },

  sendNotification: async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    // Mock sending notification
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date()
    }

    mockNotifications.unshift(newNotification)
    return newNotification
  },

  markAsRead: async (notificationId: string) => {
    return markNotificationAsRead(notificationId)
  },

  markAllAsRead: async (userId: string) => {
    return markAllNotificationsAsRead(userId)
  },

  deleteNotification: async (notificationId: string) => {
    const index = mockNotifications.findIndex(n => n.id === notificationId)
    if (index > -1) {
      const deleted = mockNotifications.splice(index, 1)[0]
      return deleted
    }
    return null
  },

  updatePreferences: async (userId: string, preferences: Partial<NotificationPreferences>) => {
    const userPrefs = getUserNotificationPreferences(userId)
    if (userPrefs) {
      Object.assign(userPrefs, preferences, { updatedAt: new Date() })
      return userPrefs
    }
    return null
  }
}

// Notification type configurations
export const notificationTypeConfig = {
  session_reminder: {
    icon: '🔔',
    color: 'blue',
    title: 'Session Reminder',
    description: 'Upcoming session notifications'
  },
  payment_due: {
    icon: '💳',
    color: 'yellow',
    title: 'Payment Due',
    description: 'Payment and billing reminders'
  },
  course_update: {
    icon: '📚',
    color: 'green',
    title: 'Course Update',
    description: 'New materials and course changes'
  },
  system_update: {
    icon: '⚙️',
    color: 'gray',
    title: 'System Update',
    description: 'Platform updates and announcements'
  },
  achievement: {
    icon: '🏆',
    color: 'purple',
    title: 'Achievement',
    description: 'Milestones and accomplishments'
  },
  message: {
    icon: '💬',
    color: 'indigo',
    title: 'Message',
    description: 'Messages from tutors and support'
  }
}

// Priority level configurations
export const priorityConfig = {
  low: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '🔵',
    label: 'Low'
  },
  medium: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '🟡',
    label: 'Medium'
  },
  high: {
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: '🟠',
    label: 'High'
  },
  urgent: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: '🔴',
    label: 'Urgent'
  }
}