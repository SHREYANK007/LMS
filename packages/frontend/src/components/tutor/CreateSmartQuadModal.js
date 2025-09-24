'use client';

import { useState } from 'react';

const COURSE_TYPES = [
  { value: 'PTE', label: 'PTE Academic' },
  { value: 'IELTS', label: 'IELTS' },
  { value: 'TOEFL', label: 'TOEFL' },
  { value: 'GENERAL_ENGLISH', label: 'General English' },
  { value: 'BUSINESS_ENGLISH', label: 'Business English' },
  { value: 'ACADEMIC_WRITING', label: 'Academic Writing' }
];

export default function CreateSmartQuadModal({ onClose, onSessionCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseType: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    maxParticipants: 4
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.courseType) return 'Course type is required';
    if (!formData.startDate) return 'Start date is required';
    if (!formData.startTime) return 'Start time is required';
    if (!formData.endDate) return 'End date is required';
    if (!formData.endTime) return 'End time is required';

    // Validate date/time
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
    const now = new Date();

    if (startDateTime <= now) return 'Start time must be in the future';
    if (endDateTime <= startDateTime) return 'End time must be after start time';

    const durationHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
    if (durationHours < 0.5) return 'Session must be at least 30 minutes long';
    if (durationHours > 4) return 'Session cannot be longer than 4 hours';

    if (formData.maxParticipants < 2 || formData.maxParticipants > 6) {
      return 'Smart Quad sessions must have 2-6 participants';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      const startTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();
      const endTime = new Date(`${formData.endDate}T${formData.endTime}`).toISOString();

      const response = await fetch(`${apiUrl}/smart-quad/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          courseType: formData.courseType,
          startTime,
          endTime,
          maxParticipants: parseInt(formData.maxParticipants)
        })
      });

      const data = await response.json();

      if (response.ok) {
        onSessionCreated(data);
      } else {
        setError(data.error || 'Failed to create Smart Quad session');
      }
    } catch (err) {
      setError('Failed to create session. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Create Smart Quad Session</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., PTE Speaking Practice Session"
                maxLength={100}
              />
            </div>

            {/* Course Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Type *
              </label>
              <select
                value={formData.courseType}
                onChange={(e) => handleInputChange('courseType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select course type</option>
                {COURSE_TYPES.map(course => (
                  <option key={course.value} value={course.value}>
                    {course.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Participants */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Participants *
              </label>
              <select
                value={formData.maxParticipants}
                onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value={2}>2 students</option>
                <option value={3}>3 students</option>
                <option value={4}>4 students (recommended)</option>
                <option value={5}>5 students</option>
                <option value={6}>6 students</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe what will be covered in this session..."
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-blue-500 text-lg">📅</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">About Smart Quad Sessions</h3>
                <p className="text-sm text-blue-600 mt-1">
                  Smart Quad sessions are small group learning experiences designed for collaborative learning.
                  A Google Calendar event and Meet link will be automatically created for easy access.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-800 rounded border border-red-200">
              {error}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}