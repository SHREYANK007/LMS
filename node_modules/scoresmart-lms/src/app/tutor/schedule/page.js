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

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/smart-quad/tutor/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      } else {
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

    switch (filter) {
      case 'today':
        return sessionDate >= today && sessionDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      case 'upcoming':
        return sessionDate >= now;
      case 'past':
        return sessionDate < now;
      default:
        return true;
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
        <p className="text-gray-600 mt-2">Manage your teaching schedule and upcoming sessions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Sessions</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.today}</p>
          <p className="text-gray-500 text-sm">Scheduled sessions</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">This Week</h3>
          <p className="text-3xl font-bold text-green-600">{stats.week}</p>
          <p className="text-gray-500 text-sm">Total sessions</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Students</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.participants}</p>
          <p className="text-gray-500 text-sm">Enrolled students</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Sessions</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
          <p className="text-gray-500 text-sm">All time</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex space-x-4 mb-6">
        {[
          { key: 'all', label: 'All Sessions' },
          { key: 'today', label: 'Today' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'past', label: 'Past' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded border border-red-200">
          {error}
        </div>
      )}

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all'
              ? 'You haven\'t created any Smart Quad sessions yet.'
              : `No sessions found for ${filter === 'today' ? 'today' : filter} sessions.`
            }
          </p>
          <a
            href="/tutor/smart-quad"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 inline-flex items-center"
          >
            <span className="mr-2">+</span>
            Create Smart Quad Session
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredSessions.map(session => {
            const { date, time } = formatDateTime(session.startTime);
            const duration = getDuration(session.startTime, session.endTime);

            return (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session)}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                      {getStatusBadge(session.status)}
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCourseTypeColor(session.courseType)}`}>
                        {session.courseType}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">{session.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <span className="mr-2">📅</span>
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <span className="mr-2">⏰</span>
                        <span>{time}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <span className="mr-2">⏱️</span>
                        <span>{duration}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <span className="mr-2">👥</span>
                        <span>{session.currentParticipants}/{session.maxParticipants}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {session.meetLink && (
                      <a
                        href={session.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-green-500 hover:text-green-600 text-sm flex items-center gap-1 px-3 py-2 border border-green-200 rounded-md hover:bg-green-50"
                      >
                        <span>📹</span>
                        Join Meet
                      </a>
                    )}
                    {session.calendarEventUrl && (
                      <a
                        href={session.calendarEventUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1 px-3 py-2 border border-blue-200 rounded-md hover:bg-blue-50"
                      >
                        <span>📅</span>
                        Calendar
                      </a>
                    )}
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