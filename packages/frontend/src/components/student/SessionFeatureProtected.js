'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { AlertTriangle } from 'lucide-react'

export default function SessionFeatureProtected({ children }) {
  const router = useRouter()
  const { user } = useAuth()

  // If user is not loaded yet, show loading
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // If user is not a student, render children (tutors/admins have access)
  if (user.role !== 'STUDENT') {
    return children
  }

  // Check if user has access to ANY session-related feature
  const sessionFeatures = ['smart_quad', 'one_to_one', 'masterclass']
  const hasSessionAccess = sessionFeatures.some(feature =>
    user.enabledFeatures?.includes(feature)
  )

  // If user doesn't have access to any session features
  if (!hasSessionAccess) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center border border-orange-200">
          <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Sessions Not Available
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have access to any <strong>session features</strong> (Smart Quad, One-to-One, or Masterclass).
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please contact your administrator to enable session features for your account.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => router.back()}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => router.push('/student')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // User has access to at least one session feature, render children
  return children
}