'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  Target,
  Award,
  Clock,
  BarChart3,
  PieChart,
  Calendar,
  Zap,
  Star,
  Trophy,
  TrendingDown,
  Activity,
  BookOpen,
  Users,
  Brain,
  Download,
  RefreshCw,
  Eye,
  ChevronRight,
  Lightbulb,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react'
import {
  getLearningProgressByUser,
  getStudySessionsByUser,
  getAnalyticsSummary,
  mockAnalyticsService,
  type LearningProgress,
  type StudySession
} from '@/data/mock/mockAnalytics'
import RealTimeDashboard from '@/components/RealTimeDashboard'

export default function StudentProgressPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'goals' | 'analytics' | 'insights'>('overview')
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [progress, setProgress] = useState<LearningProgress | null>(null)
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [analytics, setAnalytics] = useState<any>(null)

  // Mock current student ID
  const currentStudentId = 'student1'

  useEffect(() => {
    const userProgress = getLearningProgressByUser(currentStudentId)
    const userSessions = getStudySessionsByUser(currentStudentId)
    const analyticsSummary = getAnalyticsSummary(currentStudentId)

    setProgress(userProgress || null)
    setSessions(userSessions)
    setAnalytics(analyticsSummary)
  }, [currentStudentId])

  if (!progress || !analytics) {
    return <div>Loading...</div>
  }

  const skillColors = {
    speaking: 'bg-blue-500',
    writing: 'bg-green-500',
    reading: 'bg-purple-500',
    listening: 'bg-yellow-500',
    translation: 'bg-indigo-500',
    interpretation: 'bg-pink-500'
  }

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'speaking':
        return <MessageSquare className="w-4 h-4" />
      case 'writing':
        return <BookOpen className="w-4 h-4" />
      case 'reading':
        return <Eye className="w-4 h-4" />
      case 'listening':
        return <Activity className="w-4 h-4" />
      case 'translation':
        return <Brain className="w-4 h-4" />
      case 'interpretation':
        return <Users className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const getMilestoneIcon = (category: string) => {
    switch (category) {
      case 'sessions':
        return <Calendar className="w-5 h-5" />
      case 'scores':
        return <Trophy className="w-5 h-5" />
      case 'skills':
        return <Target className="w-5 h-5" />
      case 'time':
        return <Clock className="w-5 h-5" />
      case 'consistency':
        return <Zap className="w-5 h-5" />
      default:
        return <Award className="w-5 h-5" />
    }
  }

  return (
    <div className="h-screen overflow-y-auto scrollbar-premium bg-gray-25">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learning Progress</h1>
              <p className="text-gray-600">Track your learning journey and performance analytics</p>
            </div>
          </div>

          {/* Overall Progress Card */}
          <div className="card-elevated bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-green-900">Overall Progress</h3>
                  <p className="text-green-700">{progress.courseType} Course</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-900">{progress.overallProgress}%</div>
                  <div className="flex items-center gap-1 text-green-700">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+{progress.improvement} points</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">{progress.completedSessions}</div>
                  <div className="text-sm text-green-700">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">{progress.totalHours}h</div>
                  <div className="text-sm text-green-700">Study Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">{progress.averageScore}</div>
                  <div className="text-sm text-green-700">Avg Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">{progress.streak}</div>
                  <div className="text-sm text-green-700">Day Streak</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-green-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress.overallProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Insights Banner */}
          {analytics.insights.length > 0 && (
            <div className="card-premium bg-blue-50 border-blue-200 mb-6">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Today's Insights</h4>
                    <p className="text-sm text-blue-700">{analytics.insights[0]}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'skills', label: 'Skills Analysis', icon: Target },
            { id: 'goals', label: 'Goals & Milestones', icon: Trophy },
            { id: 'analytics', label: 'Real-time Analytics', icon: Activity },
            { id: 'insights', label: 'AI Insights', icon: Brain }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Performance Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Progress */}
              <div className="card-elevated">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Weekly Progress</h3>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value as any)}
                      className="text-sm border-gray-300 rounded-lg"
                    >
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Sessions Goal</span>
                      <span className="font-semibold">{progress.weeklyProgress}/{progress.weeklyGoal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(progress.weeklyProgress / progress.weeklyGoal) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{Math.round((progress.weeklyProgress / progress.weeklyGoal) * 100)}% Complete</span>
                      <span>{progress.weeklyGoal - progress.weeklyProgress} sessions remaining</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Recent Sessions</h4>
                    <div className="space-y-2">
                      {analytics.recentSessions.slice(0, 3).map((session: StudySession) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{session.subject}</p>
                            <p className="text-xs text-gray-500">{session.startTime.toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-900">{session.duration}min</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs text-gray-500">{session.effectiveness}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Trends */}
              <div className="card-elevated">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Trends</h3>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-900">Score Improvement</p>
                          <p className="text-sm text-green-700">Consistent upward trend</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-green-900">+{analytics.trends.scoreImprovement}</span>
                        <p className="text-sm text-green-700">points</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Clock className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="font-semibold text-blue-900">Study Time Growth</p>
                          <p className="text-sm text-blue-700">Weekly increase</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-blue-900">+{analytics.trends.studyTimeGrowth}%</span>
                        <p className="text-sm text-blue-700">vs last week</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Zap className="w-8 h-8 text-purple-600" />
                        <div>
                          <p className="font-semibold text-purple-900">Consistency Score</p>
                          <p className="text-sm text-purple-700">Study regularity</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-purple-900">{analytics.trends.consistencyScore}%</span>
                        <p className="text-sm text-purple-700">excellent</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-16 gap-3 bg-blue-600 hover:bg-blue-700">
                    <Calendar className="w-5 h-5" />
                    Book Next Session
                  </Button>
                  <Button variant="outline" className="h-16 gap-3">
                    <Download className="w-5 h-5" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="h-16 gap-3">
                    <Target className="w-5 h-5" />
                    Set New Goal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6">
            {/* Skills Breakdown */}
            <div className="card-elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Skills Breakdown</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(progress.skillBreakdown).map(([skill, score]) => (
                    <div key={skill} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getSkillIcon(skill)}
                          <span className="font-medium text-gray-900 capitalize">{skill}</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            skillColors[skill as keyof typeof skillColors] || 'bg-gray-500'
                          }`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>
                          {score >= 80 ? 'Excellent' :
                           score >= 70 ? 'Good' :
                           score >= 60 ? 'Fair' : 'Needs Improvement'}
                        </span>
                        <span>{score >= 75 ? '🎯' : '📈'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skill Recommendations */}
            <div className="card-elevated">
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Personalized Recommendations</h4>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Strong Areas</p>
                      <p className="text-sm text-green-700">
                        {analytics.predictions.strongAreas.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Areas for Improvement</p>
                      <p className="text-sm text-yellow-700">
                        {analytics.predictions.improvementAreas.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Recommended Actions</p>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        {analytics.predictions.recommendedActions.map((action: string, index: number) => (
                          <li key={index}>• {action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            {/* Current Goals */}
            <div className="card-elevated">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Goals & Milestones</h3>
                  <Button className="gap-2">
                    <Target className="w-4 h-4" />
                    Set New Goal
                  </Button>
                </div>

                <div className="space-y-4">
                  {progress.milestones.map((milestone) => (
                    <div key={milestone.id} className="card-premium p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            milestone.isCompleted ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            {milestone.isCompleted ? (
                              <CheckCircle2 className="w-6 h-6 text-green-600" />
                            ) : (
                              getMilestoneIcon(milestone.category)
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{milestone.title}</h4>
                            <p className="text-gray-600 text-sm mb-3">{milestone.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-500">
                                Progress: {milestone.currentValue}/{milestone.targetValue}
                              </span>
                              <span className={`font-medium ${
                                milestone.isCompleted ? 'text-green-600' : 'text-blue-600'
                              }`}>
                                {milestone.isCompleted ? 'Completed' : `${Math.round((milestone.currentValue / milestone.targetValue) * 100)}%`}
                              </span>
                            </div>
                            {!milestone.isCompleted && (
                              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${(milestone.currentValue / milestone.targetValue) * 100}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {milestone.isCompleted && milestone.completedAt && (
                            <p className="text-sm text-green-600">
                              {milestone.completedAt.toLocaleDateString()}
                            </p>
                          )}
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            <Trophy className="w-3 h-3" />
                            {milestone.reward}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievement Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-premium text-center p-6">
                <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">Achievements</h4>
                <span className="text-2xl font-bold text-gray-900">
                  {progress.milestones.filter(m => m.isCompleted).length}
                </span>
                <p className="text-sm text-gray-600">Completed</p>
              </div>

              <div className="card-premium text-center p-6">
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">In Progress</h4>
                <span className="text-2xl font-bold text-gray-900">
                  {progress.milestones.filter(m => !m.isCompleted).length}
                </span>
                <p className="text-sm text-gray-600">Active Goals</p>
              </div>

              <div className="card-premium text-center p-6">
                <Zap className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">Streak</h4>
                <span className="text-2xl font-bold text-gray-900">{progress.streak}</span>
                <p className="text-sm text-gray-600">Days</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <RealTimeDashboard userId={currentStudentId} />
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* AI Predictions */}
            <div className="card-elevated">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">AI Performance Prediction</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-3">Expected Score</h4>
                    <div className="text-4xl font-bold text-purple-900 mb-2">
                      {analytics.predictions.expectedScore}
                    </div>
                    <div className="flex items-center gap-2 text-purple-700">
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${analytics.predictions.confidenceLevel}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{analytics.predictions.confidenceLevel}% confidence</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3">Readiness Date</h4>
                    <div className="text-2xl font-bold text-green-900 mb-2">
                      {analytics.predictions.readinessDate.toLocaleDateString()}
                    </div>
                    <p className="text-sm text-green-700">
                      Based on current progress and consistency
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personalized Insights */}
            <div className="card-elevated">
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Personalized Insights</h4>

                <div className="space-y-4">
                  {analytics.insights.map((insight: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                      <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p className="text-blue-900">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Study Recommendations */}
            <div className="card-elevated">
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Study Recommendations</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <h5 className="font-medium text-blue-900 mb-2">Optimal Study Time</h5>
                    <p className="text-sm text-blue-700">
                      Based on your performance patterns, you learn best between 10 AM - 12 PM and 2 PM - 4 PM.
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Session Duration</h5>
                    <p className="text-sm text-green-700">
                      Your optimal session length is 75 minutes with a 15-minute break for maximum retention.
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                    <h5 className="font-medium text-purple-900 mb-2">Learning Style</h5>
                    <p className="text-sm text-purple-700">
                      You respond best to interactive sessions with immediate feedback and visual learning aids.
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <h5 className="font-medium text-yellow-900 mb-2">Practice Focus</h5>
                    <p className="text-sm text-yellow-700">
                      Prioritize listening comprehension and speaking fluency for the fastest score improvement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}