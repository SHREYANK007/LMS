'use client';

import { useState } from 'react';

export default function SessionJoinModal({ session, onClose, onJoin }) {
  const [loading, setLoading] = useState(false);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
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
      PTE: 'bg-blue-50 text-blue-700',
      IELTS: 'bg-green-50 text-green-700',
      TOEFL: 'bg-purple-50 text-purple-700',
      GENERAL_ENGLISH: 'bg-orange-50 text-orange-700',
      BUSINESS_ENGLISH: 'bg-indigo-50 text-indigo-700',
      ACADEMIC_WRITING: 'bg-pink-50 text-pink-700'
    };
    return colors[courseType] || 'bg-gray-50 text-gray-700';
  };

  const handleJoin = async () => {
    try {
      setLoading(true);

      // For now, we'll simulate joining the session
      // In a real implementation, you'd call an API to register the student
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      // This would be an actual API call to join the session
      // const response = await fetch(`${apiUrl}/smart-quad/${session.id}/join`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });

      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert(`Successfully joined "${session.title}"! You will receive a confirmation email with the meeting details.`);
      onJoin();
    } catch (error) {
      console.error('Error joining session:', error);
      alert('Failed to join session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Smart Quad Session</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCourseTypeColor(session.courseType)}`}>
                {session.courseType}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl p-1"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Session Details */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{session.title}</h3>
            <p className="text-gray-600 mb-4">{session.description}</p>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <p className="text-gray-900">{formatDateTime(session.startTime)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <p className="text-gray-900">{getDuration(session.startTime, session.endTime)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tutor</label>
                <p className="text-gray-900 font-medium">{session.tutor.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                <p className="text-gray-900">
                  {session.currentParticipants}/{session.maxParticipants} participants
                  <span className="text-sm text-green-600 ml-2">({session.availableSpots} spots left)</span>
                </p>
              </div>
            </div>

            {/* Capacity Warning */}
            {session.availableSpots <= 2 && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-orange-500 mr-2">⚠️</span>
                  <div>
                    <h4 className="text-sm font-medium text-orange-800">Limited Spots Available</h4>
                    <p className="text-sm text-orange-700">
                      Only {session.availableSpots} spot{session.availableSpots === 1 ? '' : 's'} remaining. Join now to secure your place!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Meeting Details */}
            {session.meetLink && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-2">Meeting Information</h4>
                <p className="text-sm text-green-700 mb-3">
                  A Google Meet link has been created for this session. You'll receive the link in your confirmation email after joining.
                </p>
                <a
                  href={session.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
                >
                  📹 Preview Meet Link
                </a>
              </div>
            )}
          </div>

          {/* What to Expect */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">What to Expect</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Interactive group learning with expert tutor guidance</li>
              <li>• Small class size for personalized attention (max {session.maxParticipants} students)</li>
              <li>• Real-time practice and immediate feedback</li>
              <li>• Session recording will be available for review</li>
              <li>• Certificate of participation upon completion</li>
            </ul>
          </div>

          {/* Terms Notice */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Before You Join</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Please ensure you have a stable internet connection</li>
              <li>• Test your camera and microphone before the session</li>
              <li>• Join the meeting 5-10 minutes early to resolve any technical issues</li>
              <li>• Cancellation must be done at least 2 hours before the session</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {session.availableSpots === 1 ? (
                <span className="text-orange-600 font-medium">⚡ Last spot available!</span>
              ) : (
                <span>{session.availableSpots} spots remaining</span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleJoin}
                disabled={loading || session.availableSpots === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  loading || session.availableSpots === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Joining...
                  </div>
                ) : (
                  'Join Session'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}