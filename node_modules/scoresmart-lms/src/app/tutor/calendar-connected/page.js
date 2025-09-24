'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CalendarConnectedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'true') {
      setStatus('success');
      // Redirect to Smart Quad page after 3 seconds
      setTimeout(() => {
        router.push('/tutor/smart-quad');
      }, 3000);
    } else if (error === 'true') {
      setStatus('error');
    } else {
      setStatus('unknown');
    }
  }, [searchParams, router]);

  const handleGoToSmartQuad = () => {
    router.push('/tutor/smart-quad');
  };

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Connection</h2>
          <p className="text-gray-600">Connecting your Google Calendar...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-md p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Successfully Connected!</h2>
          <p className="text-gray-600 mb-6">
            Your Google Calendar is now connected. Smart Quad sessions will automatically create calendar events with Meet links.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleGoToSmartQuad}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 font-medium"
            >
              Create Smart Quad Session
            </button>
            <p className="text-sm text-gray-500">
              Redirecting to Smart Quad page in a few seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-md p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connection Failed</h2>
          <p className="text-gray-600 mb-6">
            We couldn't connect your Google Calendar. This might be because you denied permission or there was a technical issue.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/tutor/smart-quad')}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/tutor')}
              className="w-full text-gray-700 bg-gray-100 py-2 px-4 rounded-md hover:bg-gray-200 font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Unknown Status</h2>
        <p className="text-gray-600 mb-4">Something unexpected happened.</p>
        <button
          onClick={() => router.push('/tutor')}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}