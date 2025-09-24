'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Activity,
  Bell,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Zap,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Info,
  Eye,
  Calendar,
  MessageSquare,
  BookOpen,
  Target,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'
import {
  getNotificationsByUser,
  getUnreadNotifications,
  mockNotificationService
} from '@/data/mock/mockNotifications'

interface RealTimeStats {
  activeUsers: number
  sessionsToday: number
  completionRate: number
  averageScore: number
  systemHealth: 'excellent' | 'good' | 'fair' | 'poor'
  lastUpdate: Date
}

interface LiveActivity {
  id: string
  type: 'session_started' | 'session_completed' | 'material_accessed' | 'score_achieved' | 'user_joined'
  description: string
  timestamp: Date
  userId?: string
  data?: any
}

export default function RealTimeDashboard({ userId }: { userId: string }) {
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [stats, setStats] = useState<RealTimeStats>({
    activeUsers: 247,
    sessionsToday: 89,
    completionRate: 94.2,
    averageScore: 78.5,
    systemHealth: 'excellent',
    lastUpdate: new Date()
  })
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([])
  const [notifications, setNotifications] = useState(getNotificationsByUser(userId))
  const [unreadCount, setUnreadCount] = useState(getUnreadNotifications(userId).length)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update stats with slight variations
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        sessionsToday: prev.sessionsToday + Math.floor(Math.random() * 3),
        completionRate: Math.max(85, Math.min(99, prev.completionRate + (Math.random() - 0.5) * 2)),
        averageScore: Math.max(70, Math.min(95, prev.averageScore + (Math.random() - 0.5) * 3)),
        lastUpdate: new Date()
      }))

      // Add new live activity
      const activities = [
        'John D. started a PTE Speaking session',
        'Sarah M. completed Writing Assessment',
        'Mike R. accessed new study materials',
        'Lisa K. achieved a score of 85 in Reading',
        'Alex P. joined Smart Quad session',
        'Emma W. completed practice test',
        'David L. started One-to-One session'
      ]

      const newActivity: LiveActivity = {
        id: `activity_${Date.now()}`,
        type: 'session_started',
        description: activities[Math.floor(Math.random() * activities.length)],
        timestamp: new Date(),
        userId: `user_${Math.floor(Math.random() * 1000)}`
      }

      setLiveActivities(prev => [newActivity, ...prev.slice(0, 9)])
      setLastUpdate(new Date())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Subscribe to real-time notifications
  useEffect(() => {
    const unsubscribe = mockNotificationService.subscribe(userId, (notification) => {
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    return unsubscribe
  }, [userId])

  // Simulate connection status
  useEffect(() => {
    const connectionInterval = setInterval(() => {
      // Randomly simulate connection issues (5% chance)
      if (Math.random() < 0.05) {
        setIsConnected(false)
        setTimeout(() => setIsConnected(true), 2000)
      }
    }, 10000)

    return () => clearInterval(connectionInterval)
  }, [])

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'text-green-600'
      case 'good':
        return 'text-blue-600'
      case 'fair':
        return 'text-yellow-600'
      case 'poor':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'good':
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />
      case 'fair':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'poor':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Info className="w-4 h-4 text-gray-600" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'session_started':
        return <Users className="w-4 h-4 text-blue-600" />
      case 'session_completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'material_accessed':
        return <BookOpen className="w-4 h-4 text-purple-600" />
      case 'score_achieved':
        return <Target className="w-4 h-4 text-yellow-600" />
      case 'user_joined':
        return <Users className="w-4 h-4 text-indigo-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className={`card-premium p-4 ${
        isConnected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            <div>
              <p className={`font-medium ${
                isConnected ? 'text-green-900' : 'text-red-900'
              }`}>
                {isConnected ? 'Real-time Connected' : 'Connection Lost'}
              </p>
              <p className={`text-sm ${
                isConnected ? 'text-green-700' : 'text-red-700'
              }`}>
                {isConnected
                  ? `Last updated: ${lastUpdate.toLocaleTimeString()}`
                  : 'Attempting to reconnect...'
                }
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setLastUpdate(new Date())}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">{stats.activeUsers}</span>
              <TrendingUp className="w-4 h-4 text-green-600 inline ml-1" />
            </div>
          </div>
          <p className="text-xs font-medium text-gray-600">Active Users</p>
          <div className="mt-2 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600">Live</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">{stats.sessionsToday}</span>
              <TrendingUp className="w-4 h-4 text-green-600 inline ml-1" />
            </div>
          </div>
          <p className="text-xs font-medium text-gray-600">Sessions Today</p>
          <div className="mt-2 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-600">+{Math.floor(Math.random() * 5) + 1} this hour</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-purple-600" />
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">{stats.completionRate.toFixed(1)}%</span>
              <TrendingUp className="w-4 h-4 text-green-600 inline ml-1" />
            </div>
          </div>
          <p className="text-xs font-medium text-gray-600">Completion Rate</p>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-yellow-600" />
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">{stats.averageScore.toFixed(1)}</span>
              <TrendingUp className="w-4 h-4 text-green-600 inline ml-1" />
            </div>
          </div>
          <p className="text-xs font-medium text-gray-600">Avg Score</p>
          <div className="mt-2 flex items-center gap-1">
            {getHealthIcon(stats.systemHealth)}
            <span className={`text-xs font-medium ${getHealthColor(stats.systemHealth)}`}>
              {stats.systemHealth}
            </span>
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elevated">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="w-4 h-4" />
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {liveActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {activity.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              ))}
            </div>

            {liveActivities.length === 0 && (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="card-elevated">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                    {unreadCount}
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg ${
                  !notification.isRead ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                }`}>
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Bell className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      !notification.isRead ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.createdAt.toLocaleString()}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  )}
                </div>
              ))}
            </div>

            {notifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No notifications</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Health Monitor */}
      <div className="card-elevated">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            {getHealthIcon(stats.systemHealth)}
            <span className={`text-sm font-medium ${getHealthColor(stats.systemHealth)}`}>
              {stats.systemHealth.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900">Video Sessions</p>
              <p className="text-sm text-green-600">Operational</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">98% uptime</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900">File Storage</p>
              <p className="text-sm text-blue-600">Operational</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '99%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">99% uptime</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="font-semibold text-gray-900">Payment System</p>
              <p className="text-sm text-yellow-600">Degraded</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">85% uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}