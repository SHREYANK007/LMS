'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Link, Check, AlertCircle } from 'lucide-react'

interface CalendarIntegrationProps {
  onConnectionChange?: (connected: boolean) => void
}

export default function CalendarIntegration({ onConnectionChange }: CalendarIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      console.log('Checking calendar connection...', { apiUrl, tokenExists: !!token })

      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${apiUrl}/auth/google/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Calendar API response:', { status: response.status, ok: response.ok })

      if (response.ok) {
        const data = await response.json()
        console.log('Calendar connection data:', data)
        const connected = data.connected || false
        setIsConnected(connected)
        onConnectionChange?.(connected)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Calendar API error:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
    } catch (err) {
      console.error('Error checking calendar connection:', err)
      setError(err.message || 'Failed to check calendar connection')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('No authentication token found')
      }

      console.log('Initiating calendar connection...')

      const response = await fetch(`${apiUrl}/auth/google/connect`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Connect API response:', { status: response.status, ok: response.ok })

      if (response.ok) {
        const data = await response.json()
        console.log('Connect response data:', data)

        if (data.authUrl) {
          // Open authorization URL in a new window
          const authWindow = window.open(data.authUrl, '_blank', 'width=500,height=600')

          // Poll for completion (you might want to implement a better callback system)
          const pollTimer = setInterval(() => {
            if (authWindow?.closed) {
              clearInterval(pollTimer)
              // Re-check connection status after a short delay
              setTimeout(checkConnection, 1000)
            }
          }, 1000)
        } else {
          throw new Error('No authorization URL received')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Connect API error:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
    } catch (err) {
      console.error('Error connecting calendar:', err)
      setError(err.message || 'Failed to connect calendar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const response = await fetch(`${apiUrl}/auth/google/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setIsConnected(false)
        onConnectionChange?.(false)
      } else {
        setError('Failed to disconnect calendar')
      }
    } catch (err) {
      console.error('Error disconnecting calendar:', err)
      setError('Failed to disconnect calendar')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <span className="text-gray-600">Checking calendar connection...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Google Calendar</h3>
            <p className="text-gray-600 text-sm">
              {isConnected
                ? 'Your calendar is connected. Sessions will automatically create calendar events with Meet links.'
                : 'Connect your Google Calendar to automatically create events with Meet links for your sessions.'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <div className="flex items-center gap-2 text-green-600 mr-3">
                <Check className="h-5 w-5" />
                <span className="text-sm font-medium">Connected</span>
              </div>
              <button
                onClick={handleDisconnect}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-1 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Link className="h-4 w-4 mr-2" />
              {isLoading ? 'Connecting...' : 'Connect Calendar'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {isConnected && (
        <div className="mt-4 bg-green-50 p-3 rounded-md">
          <h4 className="text-sm font-medium text-green-800 mb-2">Benefits of Calendar Integration:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Automatic calendar events for all your sessions</li>
            <li>• Google Meet links generated automatically</li>
            <li>• Reminders and notifications</li>
            <li>• Easy access to session details</li>
          </ul>
        </div>
      )}
    </div>
  )
}