export interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'bank_transfer'
  provider: string
  last4?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  isActive: boolean
  createdAt: Date
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  currency: string
  type: 'payment' | 'refund' | 'subscription' | 'renewal'
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  paymentMethodId: string
  description: string
  metadata?: any
  createdAt: Date
  completedAt?: Date
}

export interface CalendarEvent {
  id: string
  title: string
  description: string
  startTime: Date
  endTime: Date
  type: 'session' | 'reminder' | 'deadline'
  userId: string
  sessionId?: string
  calendarProvider: 'google' | 'outlook' | 'apple'
  isSync: boolean
  createdAt: Date
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  type: 'welcome' | 'reminder' | 'confirmation' | 'notification'
  variables: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Mock payment methods
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'card',
    provider: 'Visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'pm_2',
    type: 'paypal',
    provider: 'PayPal',
    isDefault: false,
    isActive: true,
    createdAt: new Date('2024-01-05')
  },
  {
    id: 'pm_3',
    type: 'card',
    provider: 'MasterCard',
    last4: '8888',
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
    isActive: true,
    createdAt: new Date('2024-01-10')
  }
]

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'txn_1',
    userId: 'student1',
    amount: 150.00,
    currency: 'USD',
    type: 'payment',
    status: 'completed',
    paymentMethodId: 'pm_1',
    description: 'One-to-One PTE Session with Dr. Sarah Wilson',
    metadata: {
      sessionId: '3',
      tutorId: 'tutor1',
      sessionType: 'one-to-one'
    },
    createdAt: new Date('2024-01-15T10:30:00'),
    completedAt: new Date('2024-01-15T10:30:15')
  },
  {
    id: 'txn_2',
    userId: 'student1',
    amount: 80.00,
    currency: 'USD',
    type: 'payment',
    status: 'completed',
    paymentMethodId: 'pm_1',
    description: 'Smart Quad PTE Session',
    metadata: {
      sessionId: '1',
      tutorId: 'tutor1',
      sessionType: 'smart-quad'
    },
    createdAt: new Date('2024-01-14T14:20:00'),
    completedAt: new Date('2024-01-14T14:20:08')
  },
  {
    id: 'txn_3',
    userId: 'student2',
    amount: 120.00,
    currency: 'USD',
    type: 'payment',
    status: 'completed',
    paymentMethodId: 'pm_2',
    description: 'Masterclass: Advanced PTE Strategies',
    metadata: {
      sessionId: '4',
      tutorId: 'tutor3',
      sessionType: 'masterclass'
    },
    createdAt: new Date('2024-01-13T16:45:00'),
    completedAt: new Date('2024-01-13T16:45:12')
  },
  {
    id: 'txn_4',
    userId: 'student1',
    amount: 1600.00,
    currency: 'USD',
    type: 'subscription',
    status: 'completed',
    paymentMethodId: 'pm_1',
    description: 'PTE Complete Course Package (6 months)',
    metadata: {
      packageType: 'complete',
      duration: 6,
      courseType: 'PTE'
    },
    createdAt: new Date('2024-01-01T09:00:00'),
    completedAt: new Date('2024-01-01T09:00:05')
  },
  {
    id: 'txn_5',
    userId: 'student3',
    amount: 90.00,
    currency: 'USD',
    type: 'payment',
    status: 'pending',
    paymentMethodId: 'pm_3',
    description: 'NAATI Smart Quad Session',
    metadata: {
      sessionId: '2',
      tutorId: 'tutor2',
      sessionType: 'smart-quad'
    },
    createdAt: new Date('2024-01-16T11:15:00')
  }
]

// Mock calendar events
export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'cal_1',
    title: 'PTE Speaking Workshop - Smart Quad',
    description: 'Group session focusing on PTE speaking techniques with Dr. Sarah Wilson',
    startTime: new Date('2024-01-18T10:00:00'),
    endTime: new Date('2024-01-18T11:30:00'),
    type: 'session',
    userId: 'student1',
    sessionId: '1',
    calendarProvider: 'google',
    isSync: true,
    createdAt: new Date('2024-01-15T10:30:00')
  },
  {
    id: 'cal_2',
    title: 'Course Payment Reminder',
    description: 'Your PTE course subscription will expire in 7 days',
    startTime: new Date('2024-01-25T09:00:00'),
    endTime: new Date('2024-01-25T09:15:00'),
    type: 'reminder',
    userId: 'student1',
    calendarProvider: 'google',
    isSync: true,
    createdAt: new Date('2024-01-18T09:00:00')
  },
  {
    id: 'cal_3',
    title: 'One-to-One Session: Writing Focus',
    description: 'Private tutoring session with Prof. Michael Brown',
    startTime: new Date('2024-01-19T15:00:00'),
    endTime: new Date('2024-01-19T16:00:00'),
    type: 'session',
    userId: 'student1',
    sessionId: '3',
    calendarProvider: 'outlook',
    isSync: false,
    createdAt: new Date('2024-01-16T12:00:00')
  }
]

// Mock email templates
export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 'email_1',
    name: 'Welcome Email',
    subject: 'Welcome to ScoreSmart LMS - Your Learning Journey Begins!',
    htmlContent: `
      <h2>Welcome \{\{studentName\}\}!</h2>
      <p>We're excited to have you join ScoreSmart LMS for your \{\{courseType\}\} preparation.</p>
      <p>Your account has been activated and you can now access:</p>
      <ul>
        <li>Study materials</li>
        <li>Session booking</li>
        <li>Progress tracking</li>
      </ul>
      <a href="\{\{loginUrl\}\}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
        Get Started
      </a>
    `,
    textContent: 'Welcome \{\{studentName\}\}! Your ScoreSmart LMS account for \{\{courseType\}\} preparation is ready. Access your dashboard at \{\{loginUrl\}\}',
    type: 'welcome',
    variables: ['studentName', 'courseType', 'loginUrl'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'email_2',
    name: 'Session Reminder',
    subject: 'Upcoming Session: \{\{sessionTitle\}\} in 24 hours',
    htmlContent: `
      <h2>Session Reminder</h2>
      <p>Hi \{\{studentName\}\},</p>
      <p>This is a reminder that you have an upcoming session:</p>
      <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3>\{\{sessionTitle\}\}</h3>
        <p><strong>Date:</strong> \{\{sessionDate\}\}</p>
        <p><strong>Time:</strong> \{\{sessionTime\}\}</p>
        <p><strong>Tutor:</strong> \{\{tutorName\}\}</p>
        <p><strong>Type:</strong> \{\{sessionType\}\}</p>
      </div>
      <a href="\{\{joinUrl\}\}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
        Join Session
      </a>
    `,
    textContent: 'Session reminder: \{\{sessionTitle\}\} on \{\{sessionDate\}\} at \{\{sessionTime\}\} with \{\{tutorName\}\}. Join at \{\{joinUrl\}\}',
    type: 'reminder',
    variables: ['studentName', 'sessionTitle', 'sessionDate', 'sessionTime', 'tutorName', 'sessionType', 'joinUrl'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'email_3',
    name: 'Payment Confirmation',
    subject: 'Payment Confirmation - \{\{transactionId\}\}',
    htmlContent: `
      <h2>Payment Confirmed</h2>
      <p>Hi \{\{studentName\}\},</p>
      <p>Your payment has been successfully processed.</p>
      <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3>Transaction Details</h3>
        <p><strong>Amount:</strong> $\{\{amount\}\} \{\{currency\}\}</p>
        <p><strong>Description:</strong> \{\{description\}\}</p>
        <p><strong>Transaction ID:</strong> \{\{transactionId\}\}</p>
        <p><strong>Date:</strong> \{\{transactionDate\}\}</p>
      </div>
      <p>You can view your payment history in your dashboard.</p>
    `,
    textContent: 'Payment confirmed: $\{\{amount\}\} \{\{currency\}\} for \{\{description\}\}. Transaction ID: \{\{transactionId\}\}',
    type: 'confirmation',
    variables: ['studentName', 'amount', 'currency', 'description', 'transactionId', 'transactionDate'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

// Integration status and configuration
export const integrationConfig = {
  payments: {
    stripe: {
      isEnabled: true,
      publicKey: 'pk_test_...',
      webhookEndpoint: '/api/webhooks/stripe',
      supportedMethods: ['card', 'paypal', 'bank_transfer']
    },
    paypal: {
      isEnabled: true,
      clientId: 'paypal_client_id',
      environment: 'sandbox'
    }
  },
  calendar: {
    google: {
      isEnabled: true,
      clientId: 'google_client_id',
      apiKey: 'google_api_key',
      scopes: ['https://www.googleapis.com/auth/calendar']
    },
    outlook: {
      isEnabled: true,
      clientId: 'outlook_client_id',
      tenantId: 'outlook_tenant_id'
    }
  },
  email: {
    sendgrid: {
      isEnabled: true,
      apiKey: 'sendgrid_api_key',
      fromEmail: 'noreply@scoresmart.com',
      fromName: 'ScoreSmart LMS'
    },
    templates: {
      welcome: 'email_1',
      sessionReminder: 'email_2',
      paymentConfirmation: 'email_3'
    }
  },
  notifications: {
    push: {
      isEnabled: true,
      vapidPublicKey: 'vapid_public_key',
      vapidPrivateKey: 'vapid_private_key'
    },
    sms: {
      isEnabled: false,
      provider: 'twilio',
      accountSid: 'twilio_account_sid'
    }
  }
}

// Helper functions
export const getTransactionsByUser = (userId: string) => {
  return mockTransactions.filter(txn => txn.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export const getTransactionsByStatus = (status: Transaction['status']) => {
  return mockTransactions.filter(txn => txn.status === status)
}

export const getPaymentMethodsByUser = (userId: string) => {
  // In real app, this would filter by userId
  return mockPaymentMethods.filter(pm => pm.isActive)
}

export const getCalendarEventsByUser = (userId: string) => {
  return mockCalendarEvents.filter(event => event.userId === userId)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
}

export const getUpcomingEvents = (userId: string, days: number = 7) => {
  const now = new Date()
  const future = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000))

  return mockCalendarEvents.filter(event =>
    event.userId === userId &&
    event.startTime >= now &&
    event.startTime <= future
  ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
}

export const getEmailTemplate = (type: EmailTemplate['type']) => {
  return mockEmailTemplates.find(template => template.type === type && template.isActive)
}

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

export const getTransactionStats = (userId?: string) => {
  const transactions = userId ? getTransactionsByUser(userId) : mockTransactions
  const completedTransactions = transactions.filter(txn => txn.status === 'completed')

  return {
    total: transactions.length,
    completed: completedTransactions.length,
    pending: transactions.filter(txn => txn.status === 'pending').length,
    totalAmount: completedTransactions.reduce((sum, txn) => sum + txn.amount, 0),
    averageAmount: completedTransactions.length > 0
      ? completedTransactions.reduce((sum, txn) => sum + txn.amount, 0) / completedTransactions.length
      : 0
  }
}

// Mock integration service functions (would be real API calls in production)
export const mockIntegrationServices = {
  payments: {
    processPayment: async (amount: number, paymentMethodId: string, description: string) => {
      // Mock payment processing
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: `txn_${Date.now()}`,
            status: 'completed',
            amount,
            paymentMethodId,
            description
          })
        }, 2000)
      })
    },

    refundPayment: async (transactionId: string, amount?: number) => {
      // Mock refund processing
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: `rfnd_${Date.now()}`,
            originalTransactionId: transactionId,
            amount: amount || 0,
            status: 'completed'
          })
        }, 1500)
      })
    }
  },

  calendar: {
    createEvent: async (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
      // Mock calendar event creation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ...event,
            id: `cal_${Date.now()}`,
            createdAt: new Date(),
            isSync: true
          })
        }, 1000)
      })
    },

    syncCalendar: async (userId: string, provider: 'google' | 'outlook' | 'apple') => {
      // Mock calendar sync
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            eventsCount: Math.floor(Math.random() * 10) + 1,
            provider
          })
        }, 3000)
      })
    }
  },

  email: {
    sendEmail: async (to: string, templateType: EmailTemplate['type'], variables: Record<string, string>) => {
      // Mock email sending
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: `email_${Date.now()}`,
            to,
            templateType,
            status: 'sent',
            sentAt: new Date()
          })
        }, 500)
      })
    },

    sendBulkEmail: async (recipients: string[], templateType: EmailTemplate['type'], variables: Record<string, string>) => {
      // Mock bulk email sending
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: `bulk_${Date.now()}`,
            recipientCount: recipients.length,
            templateType,
            status: 'queued',
            queuedAt: new Date()
          })
        }, 800)
      })
    }
  }
}