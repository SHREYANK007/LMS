'use client';

import { useState, useEffect } from 'react';

export default function GoogleCalendarConnection({ onConnectionChanged }) {
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    email: null,
    loading: true
  });
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/auth/google/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConnectionStatus({
          connected: data.connected,
          email: data.email,
          loading: false
        });
        onConnectionChanged?.(data.connected);
      } else {
        setConnectionStatus(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
      setConnectionStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const handleConnect = async () => {
    try {
      setConnecting(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/auth/google/connect`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      } else {
        const errorData = await response.json();
        alert(`Failed to connect: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      alert('Failed to connect to Google Calendar. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Calendar? This will disable automatic calendar event creation for your sessions.')) {
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/auth/google/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setConnectionStatus({
          connected: false,
          email: null,
          loading: false
        });
        onConnectionChanged?.(false);
      } else {
        const errorData = await response.json();
        alert(`Failed to disconnect: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      alert('Failed to disconnect. Please try again.');
    }
  };

  if (connectionStatus.loading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-3"></div>
          <span className="text-gray-600">Checking Google Calendar connection...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <span className="mr-2">📅</span>
            Google Calendar Integration
          </h3>

          {connectionStatus.connected ? (
            <div>
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">
                  Connected to: <span className="font-medium text-gray-900">{connectionStatus.email}</span>
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Your Smart Quad sessions will automatically create Google Calendar events with Meet links.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Not connected</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Connect your Google Calendar to automatically create events and Meet links for your sessions.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        {connectionStatus.connected ? (
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 text-sm font-medium"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm font-medium flex items-center"
          >
            {connecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </>
            ) : (
              <>
                <span className="mr-2">🔗</span>
                Connect Google Calendar
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}