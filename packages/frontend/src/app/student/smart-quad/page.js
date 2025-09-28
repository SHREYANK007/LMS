'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SessionJoinModal from '../../../components/student/SessionJoinModal';
import FeatureProtected from '../../../components/student/FeatureProtected';

export default function StudentSmartQuadPage() {
  const searchParams = useSearchParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, today, this-week, by-course
  const [sessionTypeFilter, setSessionTypeFilter] = useState(searchParams?.get('sessionType') || 'SMART_QUAD'); // Default to SMART_QUAD sessions
  const [courseTypeFilter, setCourseTypeFilter] = useState(searchParams?.get('courseType') || 'all'); // all, PTE, IELTS, etc.

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const token = localStorage.getItem('token');

      // Fetch all upcoming sessions (not just smart-quad specific)
      const response = await fetch(`${apiUrl}/sessions?upcoming=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response Status:', response.status);
      console.log('API URL:', `${apiUrl}/sessions?upcoming=true`);
      console.log('Token:', token ? 'Present' : 'Missing');

      if (response.ok) {
        const data = await response.json();
        // Filter to only show sessions that have available spots and calculate available spots
        const availableSessions = (data.sessions || [])
          .filter(session => session.currentParticipants < session.maxParticipants)
          .map(session => ({
            ...session,
            availableSpots: session.maxParticipants - session.currentParticipants,
            tutor: {
              name: session.tutor?.email || session.tutor?.name || 'Unknown Tutor',
              email: session.tutor?.email || 'unknown@email.com'
            }
          }));
        setSessions(availableSessions);
      } else {
        setError('Failed to load available sessions');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = (session) => {
    setSelectedSession(session);
    setShowJoinModal(true);
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
      }),
      fullDate: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
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

  const getCourseTypeColor = (courseType) => {
    const colors = {
      PTE: 'bg-blue-50 text-blue-700 border-blue-200',
      IELTS: 'bg-green-50 text-green-700 border-green-200',
      TOEFL: 'bg-purple-50 text-purple-700 border-purple-200',
      GENERAL_ENGLISH: 'bg-orange-50 text-orange-700 border-orange-200',
      BUSINESS_ENGLISH: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      ACADEMIC_WRITING: 'bg-pink-50 text-pink-700 border-pink-200'
    };
    return colors[courseType] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getTimeUntilSession = (startTime) => {
    const now = new Date();
    const sessionStart = new Date(startTime);
    const diffMs = sessionStart - now;

    if (diffMs < 0) return 'Starting now';

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `In ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `In ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    }
  };

  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Time filter
    let timeMatch = true;
    switch (filter) {
      case 'today':
        timeMatch = sessionDate >= today && sessionDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'this-week':
        timeMatch = sessionDate >= today && sessionDate < nextWeek;
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

  const courseTypes = [...new Set(sessions.map(s => s.courseType))];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <FeatureProtected featureKey="smart_quad" featureName="Smart Quad Sessions">
      <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Smart Quad Sessions</h1>
            <p className="text-gray-600 mt-2">Join small group learning sessions (max 4 students) with expert tutors</p>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Available
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
              Almost Full
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Full
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center mb-4">
          <span className="text-lg font-semibold text-gray-900 mr-2">🔍</span>
          <h2 className="text-lg font-semibold text-gray-900">Filter Sessions</h2>
        </div>
        <div className="space-y-4">
        {/* Time Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Time:</span>
          {[
            { key: 'all', label: 'All Sessions' },
            { key: 'today', label: 'Today' },
            { key: 'this-week', label: 'This Week' }
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

        {/* Course Type Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Course:</span>
          {[
            { key: 'all', label: 'All Courses' },
            { key: 'PTE', label: 'PTE' },
            { key: 'NAATI', label: 'NAATI' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCourseTypeFilter(key)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                courseTypeFilter === key
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded border border-red-200">
          {error}
        </div>
      )}

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions available</h3>
          <p className="text-gray-600">
            {filter === 'all' && sessionTypeFilter === 'all' && courseTypeFilter === 'all'
              ? 'There are no available sessions at the moment.'
              : 'No sessions match your current filters. Try adjusting your filters or check back later.'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredSessions.map(session => {
            const { date, time, fullDate } = formatDateTime(session.startTime);
            const duration = getDuration(session.startTime, session.endTime);
            const timeUntil = getTimeUntilSession(session.startTime);

            return (
              <div
                key={session.id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:border-blue-200"
              >
                <div className="flex flex-col lg:flex-row justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{session.title}</h3>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${session.sessionType === 'ONE_TO_ONE' ? 'bg-blue-100 text-blue-800' : session.sessionType === 'SMART_QUAD' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                            {session.sessionType === 'ONE_TO_ONE' ? 'One-to-One' : session.sessionType === 'SMART_QUAD' ? 'Smart Quad' : 'Masterclass'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCourseTypeColor(session.courseType)}`}>
                            {session.courseType}
                          </span>
                          <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                            {timeUntil}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{session.availableSpots}</p>
                        <p className="text-sm text-gray-500">spots left</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2">{session.description}</p>

                    {/* Session Details */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">📅</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{date}</p>
                          <p className="text-xs text-gray-500">{fullDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">⏰</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{time}</p>
                          <p className="text-xs text-gray-500">{duration} duration</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">👨‍🏫</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{session.tutor?.name || session.tutor?.email || 'Unknown Tutor'}</p>
                          <p className="text-xs text-gray-500">Tutor</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">👥</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {session.currentParticipants}/{session.maxParticipants}
                          </p>
                          <p className="text-xs text-gray-500">Participants</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Session capacity</span>
                        <span>{Math.round((session.currentParticipants / session.maxParticipants) * 100)}% filled</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            session.availableSpots <= 1 ? 'bg-red-500' : session.availableSpots <= 2 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(session.currentParticipants / session.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 lg:ml-6 lg:min-w-[200px]">
                    <button
                      onClick={() => handleJoinSession(session)}
                      disabled={session.availableSpots === 0}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        session.availableSpots === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {session.availableSpots === 0 ? 'Session Full' : 'Join Session'}
                    </button>

                    {session.meetLink && (
                      <a
                        href={session.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 text-center text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        📹 Preview Meet Link
                      </a>
                    )}

                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        {session.availableSpots <= 2 && session.availableSpots > 0 && (
                          <span className="text-orange-600 font-medium">⚠️ Almost full!</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Join Session Modal */}
      {showJoinModal && selectedSession && (
        <SessionJoinModal
          session={selectedSession}
          onClose={() => {
            setShowJoinModal(false);
            setSelectedSession(null);
          }}
          onJoin={() => {
            // Refresh sessions to update participant counts
            fetchSessions();
            setShowJoinModal(false);
            setSelectedSession(null);
          }}
        />
      )}
    </div>
    </FeatureProtected>
  );
}