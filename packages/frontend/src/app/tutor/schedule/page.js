'use client';

import { useState, useEffect } from 'react';
import SessionDetailsModal from '../../../components/tutor/SessionDetailsModal';

export default function TutorSchedulePage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, today, upcoming, past
  const [sessionTypeFilter, setSessionTypeFilter] = useState('all'); // all, ONE_TO_ONE, SMART_QUAD, MASTERCLASS
  const [courseTypeFilter, setCourseTypeFilter] = useState('all'); // all, PTE, IELTS, etc.

  useEffect(() => {
    fetchSessions();
  }, []);

  // Re-fetch sessions when the page becomes visible (helpful after creating sessions)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, refreshing sessions...');
        fetchSessions();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      console.log('Fetching sessions for tutor');

      // Backend now automatically filters sessions by tutor
      const url = `${apiUrl}/sessions`;

      console.log('Sessions API URL (showing ALL sessions for debugging):', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Sessions API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Sessions API response data:', data);
        setSessions(data.sessions || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Sessions API error:', errorData);
        setError('Failed to load sessions');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setShowDetailsModal(true);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const getDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime - startTime;
    const minutes = Math.round(durationMs / (1000 * 60));
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      ONGOING: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status.toLowerCase()}
      </span>
    );
  };

  const getCourseTypeColor = (courseType) => {
    const colors = {
      PTE: 'bg-blue-50 text-blue-700',
      IELTS: 'bg-green-50 text-green-700',
      TOEFL: 'bg-purple-50 text-purple-700',
      GENERAL_ENGLISH: 'bg-orange-50 text-orange-700',
      BUSINESS_ENGLISH: 'bg-indigo-50 text-indigo-700',
      ACADEMIC_WRITING: 'bg-pink-50 text-pink-700'
    };
    return colors[courseType] || 'bg-gray-50 text-gray-700';
  };

  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Time filter
    let timeMatch = true;
    switch (filter) {
      case 'today':
        timeMatch = sessionDate >= today && sessionDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'upcoming':
        timeMatch = sessionDate >= now;
        break;
      case 'past':
        timeMatch = sessionDate < now;
        break;
      default:
        timeMatch = true;
    }

    // Session type filter
    const sessionTypeMatch = sessionTypeFilter === 'all' || session.sessionType === sessionTypeFilter;

    // Course type filter
    const courseTypeMatch = courseTypeFilter === 'all' || session.courseType === courseTypeFilter;

    return timeMatch && sessionTypeMatch && courseTypeMatch;
  });

  const getSessionStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const todaySessions = sessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      return sessionDate >= today && sessionDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    });

    const weekSessions = sessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      return sessionDate >= today && sessionDate < nextWeek;
    });

    const totalParticipants = sessions.reduce((acc, s) => acc + s.currentParticipants, 0);

    return {
      today: todaySessions.length,
      week: weekSessions.length,
      participants: totalParticipants,
      total: sessions.length
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = getSessionStats();

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-600 mt-2">Manage your teaching schedule and upcoming sessions</p>
        </div>
        <button
          onClick={() => {
            console.log('Manual refresh triggered');
            fetchSessions();
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          disabled={loading}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Cards with improved clarity */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-blue-900">Today's Sessions</h3>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-3xl font-bold text-blue-700 mb-1">{stats.today}</p>
          <p className="text-blue-600 text-sm font-medium">Scheduled for today</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-green-900">This Week</h3>
            <span className="text-2xl">🗓️</span>
          </div>
          <p className="text-3xl font-bold text-green-700 mb-1">{stats.week}</p>
          <p className="text-green-600 text-sm font-medium">Sessions this week</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-purple-900">Active Students</h3>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-3xl font-bold text-purple-700 mb-1">{stats.participants}</p>
          <p className="text-purple-600 text-sm font-medium">Enrolled students</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-indigo-900">Total Sessions</h3>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-bold text-indigo-700 mb-1">{stats.total}</p>
          <p className="text-indigo-600 text-sm font-medium">All time sessions</p>
        </div>
      </div>

      {/* Session Type Notice */}
      {sessionTypeFilter === 'ONE_TO_ONE' && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-purple-600 text-lg">ℹ️</div>
            <div>
              <h3 className="text-purple-800 font-semibold mb-1">About One-to-One Sessions</h3>
              <p className="text-purple-700 text-sm">
                One-to-one sessions are managed separately from your schedule. These sessions are assigned to you by administrators when students request them.
                <a href="/tutor/sessions" className="underline hover:no-underline ml-1">View your assigned one-to-one sessions here</a>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="space-y-4 mb-6">
        {/* Time Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Time:</span>
          {[
            { key: 'all', label: 'All Sessions' },
            { key: 'today', label: 'Today' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'past', label: 'Past' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Session Type Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Session Type:</span>
          {[
            { key: 'all', label: 'All Types' },
            { key: 'ONE_TO_ONE', label: 'One-to-One' },
            { key: 'SMART_QUAD', label: 'Smart Quad' },
            { key: 'MASTERCLASS', label: 'Masterclass' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSessionTypeFilter(key)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                sessionTypeFilter === key
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Course Type Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Course Type:</span>
          {[
            { key: 'all', label: 'All Courses' },
            { key: 'PTE', label: 'PTE' },
            { key: 'IELTS', label: 'IELTS' },
            { key: 'TOEFL', label: 'TOEFL' },
            { key: 'GENERAL_ENGLISH', label: 'General English' },
            { key: 'BUSINESS_ENGLISH', label: 'Business English' },
            { key: 'ACADEMIC_WRITING', label: 'Academic Writing' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCourseTypeFilter(key)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                courseTypeFilter === key
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded border border-red-200">
          {error}
        </div>
      )}

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">
            {sessionTypeFilter === 'ONE_TO_ONE' ? '📖' : '📅'}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {sessionTypeFilter === 'ONE_TO_ONE' ? 'One-to-One Sessions' : 'No sessions found'}
          </h3>

          {sessionTypeFilter === 'ONE_TO_ONE' ? (
            <div>
              <p className="text-gray-600 mb-6">
                One-to-one sessions are managed separately from your schedule. These sessions are assigned to you by administrators when students request them.
              </p>
              <a
                href="/tutor/sessions"
                className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600 inline-flex items-center"
              >
                <span className="mr-2">📖</span>
                View One-to-One Sessions
              </a>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-6">
                {sessionTypeFilter === 'all'
                  ? 'You haven\'t created any sessions yet.'
                  : sessionTypeFilter === 'SMART_QUAD'
                  ? 'You haven\'t created any Smart Quad sessions yet.'
                  : sessionTypeFilter === 'MASTERCLASS'
                  ? 'You haven\'t created any Masterclass sessions yet.'
                  : `No sessions found for ${filter === 'today' ? 'today' : filter} sessions.`
                }
              </p>
              {sessionTypeFilter !== 'ONE_TO_ONE' && (
                <div className="flex gap-3 justify-center">
                  <a
                    href="/tutor/smart-quad"
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 inline-flex items-center"
                  >
                    <span className="mr-2">+</span>
                    Create Smart Quad Session
                  </a>
                  {sessionTypeFilter === 'all' && (
                    <a
                      href="/tutor/sessions"
                      className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600 inline-flex items-center"
                    >
                      <span className="mr-2">📖</span>
                      View One-to-One Sessions
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredSessions.map(session => {
            const { date, time } = formatDateTime(session.startTime);
            const duration = getDuration(session.startTime, session.endTime);

            return (
              <div
                key={session.id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:border-blue-200"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{session.title}</h3>
                      {getStatusBadge(session.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${session.sessionType === 'ONE_TO_ONE' ? 'bg-blue-100 text-blue-800 border border-blue-200' : session.sessionType === 'SMART_QUAD' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-purple-100 text-purple-800 border border-purple-200'}`}>
                        {session.sessionType === 'ONE_TO_ONE' ? '1:1 Session' : session.sessionType === 'SMART_QUAD' ? 'Smart Quad' : 'Masterclass'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCourseTypeColor(session.courseType)}`}>
                        {session.courseType.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2">{session.description || 'No description provided'}</p>

                    {/* Session Details */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2 text-lg">📅</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{date}</p>
                          <p className="text-xs text-gray-500">Session Date</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2 text-lg">⏰</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{time}</p>
                          <p className="text-xs text-gray-500">{duration} duration</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2 text-lg">👥</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {session.currentParticipants}/{session.maxParticipants}
                          </p>
                          <p className="text-xs text-gray-500">Participants</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2 text-lg">💺</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {session.maxParticipants - session.currentParticipants}
                          </p>
                          <p className="text-xs text-gray-500">Available spots</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Session capacity</span>
                        <span>{Math.round((session.currentParticipants / session.maxParticipants) * 100)}% filled</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            (session.maxParticipants - session.currentParticipants) <= 1 ? 'bg-red-500' :
                            (session.maxParticipants - session.currentParticipants) <= 2 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(session.currentParticipants / session.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 lg:min-w-[200px] shrink-0">
                    <button
                      onClick={() => handleSessionClick(session)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      ✏️ Edit Session
                    </button>

                    {session.meetLink && (
                      <a
                        href={session.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        📹 Join Meet
                      </a>
                    )}

                    {session.calendarEventUrl && (
                      <a
                        href={session.calendarEventUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-center bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
                      >
                        📅 View Calendar
                      </a>
                    )}

                    <div className="text-center text-xs text-gray-500">
                      {(session.maxParticipants - session.currentParticipants) <= 2 && (session.maxParticipants - session.currentParticipants) > 0 && (
                        <span className="text-orange-600 font-medium">⚠️ Almost full!</span>
                      )}
                      {(session.maxParticipants - session.currentParticipants) === 0 && (
                        <span className="text-red-600 font-medium">🔴 Session Full</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Session Details Modal */}
      {showDetailsModal && selectedSession && (
        <SessionDetailsModal
          session={selectedSession}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedSession(null);
          }}
          onUpdate={(updatedSession) => {
            setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
            setSelectedSession(updatedSession);
          }}
          onDelete={(deletedSessionId) => {
            setSessions(prev => prev.filter(s => s.id !== deletedSessionId));
            setShowDetailsModal(false);
            setSelectedSession(null);
          }}
        />
      )}
    </div>
  );
}