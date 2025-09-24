'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Sessions</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Materials</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress</h3>
          <p className="text-3xl font-bold text-orange-600">0%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Session Types</h2>
          <div className="space-y-3">
            <a href="/student/one-to-one" className="block p-3 bg-blue-50 rounded hover:bg-blue-100">
              <span className="font-semibold">One-to-One</span>
              <p className="text-sm text-gray-600">Personal tutoring sessions</p>
            </a>
            <a href="/student/smart-quad" className="block p-3 bg-green-50 rounded hover:bg-green-100">
              <span className="font-semibold">Smart Quad</span>
              <p className="text-sm text-gray-600">Small group learning</p>
            </a>
            <a href="/student/masterclass" className="block p-3 bg-purple-50 rounded hover:bg-purple-100">
              <span className="font-semibold">Masterclass</span>
              <p className="text-sm text-gray-600">Expert-led workshops</p>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="space-y-3">
            <a href="/student/calendar" className="block p-3 bg-gray-50 rounded hover:bg-gray-100">
              View Calendar →
            </a>
            <a href="/student/materials" className="block p-3 bg-gray-50 rounded hover:bg-gray-100">
              Study Materials →
            </a>
            <a href="/student/progress" className="block p-3 bg-gray-50 rounded hover:bg-gray-100">
              Track Progress →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}