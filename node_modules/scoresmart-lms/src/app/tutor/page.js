'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function TutorDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tutor Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Sessions</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">This Week</h3>
          <p className="text-3xl font-bold text-purple-600">0 sessions</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <a href="/tutor/schedule" className="block p-3 bg-blue-50 rounded hover:bg-blue-100">
            View Schedule →
          </a>
          <a href="/tutor/smart-quad" className="block p-3 bg-indigo-50 rounded hover:bg-indigo-100">
            Create Smart Quad Session →
          </a>
          <a href="/tutor/materials" className="block p-3 bg-green-50 rounded hover:bg-green-100">
            Manage Materials →
          </a>
          <a href="/tutor/availability" className="block p-3 bg-purple-50 rounded hover:bg-purple-100">
            Set Availability →
          </a>
        </div>
      </div>
    </div>
  );
}