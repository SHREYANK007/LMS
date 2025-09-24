'use client';

import { useState, useEffect } from 'react';
import CreateSmartQuadModal from '../../../components/tutor/CreateSmartQuadModal';
import GoogleCalendarConnection from '../../../components/tutor/GoogleCalendarConnection';

export default function SmartQuadPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSessionCreated = (newSession) => {
    setSessions(prev => [newSession, ...prev]);
    setShowCreateModal(false);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Quad Sessions</h1>
          <p className="text-gray-600">Manage your group learning sessions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <span>+</span>
          Create Session
        </button>
      </div>

      {/* Google Calendar Connection */}
      <div className="mb-6">
        <GoogleCalendarConnection onConnectionChanged={setCalendarConnected} />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-800 rounded border border-red-200">
          {error}
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Smart Quad sessions yet</h3>
          <p className="text-gray-600 mb-6">Create your first group learning session to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Create Your First Session
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map(session => (
            <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{session.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{session.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <span>📅</span>
                      {formatDateTime(session.startTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <span>⏱️</span>
                      {Math.round((new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60))} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <span>👥</span>
                      {session.currentParticipants}/{session.maxParticipants} participants
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(session.status)}
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {session.courseType}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  {session.meetLink && (
                    <a
                      href={session.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
                    >
                      <span>📹</span>
                      Join Meeting
                    </a>
                  )}
                  {session.calendarEventUrl && (
                    <a
                      href={session.calendarEventUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-600 text-sm flex items-center gap-1"
                    >
                      <span>📅</span>
                      View Calendar
                    </a>
                  )}
                </div>

                <div className="flex gap-2">
                  <button className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 border border-gray-300 rounded">
                    Edit
                  </button>
                  <button className="text-red-500 hover:text-red-700 text-sm px-3 py-1 border border-red-300 rounded">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateSmartQuadModal
          onClose={() => setShowCreateModal(false)}
          onSessionCreated={handleSessionCreated}
        />
      )}
    </div>
  );
}