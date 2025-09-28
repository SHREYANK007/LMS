'use client'

import { useState } from 'react'
import { X, AlertTriangle, Calendar, Users } from 'lucide-react'

export default function CancelSessionModal({ isOpen, onClose, onConfirm, session }) {
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !session) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!reason.trim()) {
      alert('Please provide a cancellation reason')
      return
    }

    setIsSubmitting(true)
    await onConfirm(session.id, reason)
    setIsSubmitting(false)
    setReason('')
    onClose()
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setReason('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full m-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Cancel Session</h2>
              <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 mb-1">Calendar Events Will Be Updated</p>
              <p className="text-amber-700">
                Both the tutor's and student's Google Calendar events will be marked as cancelled.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Session Details</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Subject:</strong> {session.subject}</p>
            <p><strong>Student:</strong> {session.student?.name || session.student?.email}</p>
            {session.tutor && (
              <p><strong>Tutor:</strong> {session.tutor?.name || session.tutor?.email}</p>
            )}
            <p><strong>Date:</strong> {new Date(session.preferredDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {session.preferredTime}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cancellation Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
              placeholder="Please provide a reason for cancellation..."
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be visible to both the student and tutor
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-700">
                <strong>Impact:</strong> Both student and tutor will be notified of the cancellation.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-colors disabled:opacity-50"
            >
              Keep Session
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Cancelling...' : 'Cancel Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}