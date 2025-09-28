'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CalendarIntegration from '@/components/CalendarIntegration';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  const fetchUpcomingSessions = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/sessions?upcoming=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Filter to show sessions that have spots available
        const availableSessions = (data.sessions || [])
          .filter(session => session.currentParticipants < session.maxParticipants)
          .slice(0, 5); // Show only first 5
        setUpcomingSessions(availableSessions);
      }
    } catch (error) {
      console.error('Failed to fetch upcoming sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.email}</p>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-blue-900">Available Sessions</h3>
            <span className="text-2xl">📚</span>
          </div>
          <p className="text-3xl font-bold text-blue-700 mb-1">{upcomingSessions.length}</p>
          <p className="text-blue-600 text-sm font-medium">Sessions you can join</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-green-900">Session Types</h3>
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-3xl font-bold text-green-700 mb-1">{[...new Set(upcomingSessions.map(s => s.sessionType))].length}</p>
          <p className="text-green-600 text-sm font-medium">Different types available</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-purple-900">Course Types</h3>
            <span className="text-2xl">📖</span>
          </div>
          <p className="text-3xl font-bold text-purple-700 mb-1">{[...new Set(upcomingSessions.map(s => s.courseType))].length}</p>
          <p className="text-purple-600 text-sm font-medium">Subjects available</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-orange-900">Total Spots</h3>
            <span className="text-2xl">🎪</span>
          </div>
          <p className="text-3xl font-bold text-orange-700 mb-1">{upcomingSessions.reduce((acc, s) => acc + (s.maxParticipants - s.currentParticipants), 0)}</p>
          <p className="text-orange-600 text-sm font-medium">Available spots</p>
        </div>
      </div>

      {/* Calendar Integration */}
      <div className="mb-8">
        <CalendarIntegration />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Available Sessions</h2>
              <a
                href="/student/smart-quad"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All →
              </a>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map(session => {
                  const availableSpots = session.maxParticipants - session.currentParticipants;
                  const isAlmostFull = availableSpots <= 2;
                  const isFull = availableSpots === 0;

                  return (
                    <div key={session.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all hover:border-blue-200 bg-gradient-to-r from-white to-gray-50">
                      <div className="flex flex-col lg:flex-row justify-between items-start mb-3 gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${
                              session.sessionType === 'ONE_TO_ONE' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                              session.sessionType === 'SMART_QUAD' ? 'bg-green-50 text-green-800 border-green-200' :
                              'bg-purple-50 text-purple-800 border-purple-200'
                            }`}>
                              {session.sessionType === 'ONE_TO_ONE' ? '1:1 Session' :
                               session.sessionType === 'SMART_QUAD' ? 'Smart Quad' : 'Masterclass'}
                            </span>
                            <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-50 text-gray-700 border border-gray-200">
                              {session.courseType.replace('_', ' ')}
                            </span>
                            {isAlmostFull && !isFull && (
                              <span className="px-3 py-1 text-sm font-medium rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                                ⚠️ Almost Full
                              </span>
                            )}
                            {isFull && (
                              <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-50 text-red-700 border border-red-200">
                                🔴 Full
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right lg:text-center lg:min-w-[80px] shrink-0">
                          <p className={`text-2xl font-bold mb-1 ${
                            isFull ? 'text-red-600' :
                            isAlmostFull ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {availableSpots}
                          </p>
                          <p className="text-sm text-gray-500">spots left</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <span className="mr-1">📅</span>
                            <span className="font-medium">
                              {new Date(session.startTime).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">⏰</span>
                            <span className="font-medium">
                              {new Date(session.startTime).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">👥</span>
                            <span className="font-medium">
                              {session.currentParticipants}/{session.maxParticipants}
                            </span>
                          </div>
                        </div>

                        <a
                          href="/student/smart-quad"
                          className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${
                            isFull
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          {isFull ? 'Session Full' : 'View Details'}
                        </a>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isFull ? 'bg-red-500' :
                              isAlmostFull ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(session.currentParticipants / session.maxParticipants) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No available sessions at the moment.</p>
                <p className="text-sm">Check back later or contact your tutor.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Session Types</h2>
            <div className="space-y-3">
              <a href="/student/smart-quad" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <span className="mr-3 text-2xl">👥</span>
                <div>
                  <div className="font-semibold text-gray-900">One-to-One</div>
                  <div className="text-sm text-gray-600">Personal tutoring</div>
                </div>
              </a>
              <a href="/student/smart-quad" className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <span className="mr-3 text-2xl">🎯</span>
                <div>
                  <div className="font-semibold text-gray-900">Smart Quad</div>
                  <div className="text-sm text-gray-600">Small group learning</div>
                </div>
              </a>
              <a href="/student/smart-quad" className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <span className="mr-3 text-2xl">🎓</span>
                <div>
                  <div className="font-semibold text-gray-900">Masterclass</div>
                  <div className="text-sm text-gray-600">Expert workshops</div>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
            <div className="space-y-3">
              <a href="/student/calendar" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="mr-3 text-xl">📅</span>
                <span className="font-medium">View Calendar</span>
              </a>
              <a href="/student/materials" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="mr-3 text-xl">📚</span>
                <span className="font-medium">Study Materials</span>
              </a>
              <a href="/student/progress" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="mr-3 text-xl">📈</span>
                <span className="font-medium">Track Progress</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}