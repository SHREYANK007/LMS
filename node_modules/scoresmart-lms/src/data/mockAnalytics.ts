import { Analytics } from '@/types'

export const mockAnalytics: Analytics = {
  totalUsers: 6,
  totalCourses: 3,
  totalRevenue: 45896.73,
  activeUsers: 5,
  courseCompletionRate: 68.5,
  averageRating: 4.8
}

export const mockChartData = {
  enrollmentTrends: [
    { month: 'Jan', enrollments: 12 },
    { month: 'Feb', enrollments: 19 },
    { month: 'Mar', enrollments: 28 },
    { month: 'Apr', enrollments: 45 },
    { month: 'May', enrollments: 67 },
    { month: 'Jun', enrollments: 84 },
    { month: 'Jul', enrollments: 92 },
    { month: 'Aug', enrollments: 105 },
    { month: 'Sep', enrollments: 134 },
    { month: 'Oct', enrollments: 156 },
    { month: 'Nov', enrollments: 178 },
    { month: 'Dec', enrollments: 189 }
  ],
  revenueData: [
    { month: 'Jan', revenue: 1250 },
    { month: 'Feb', revenue: 2100 },
    { month: 'Mar', revenue: 3800 },
    { month: 'Apr', revenue: 5200 },
    { month: 'May', revenue: 7800 },
    { month: 'Jun', revenue: 9200 },
    { month: 'Jul', revenue: 11500 },
    { month: 'Aug', revenue: 14200 },
    { month: 'Sep', revenue: 18600 },
    { month: 'Oct', revenue: 22300 },
    { month: 'Nov', revenue: 26800 },
    { month: 'Dec', revenue: 31200 }
  ],
  coursePopularity: [
    { name: 'Web Development', value: 40 },
    { name: 'Data Science', value: 35 },
    { name: 'React Development', value: 25 }
  ]
}