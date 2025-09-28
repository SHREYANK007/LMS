'use client';

import { useState } from 'react';
import { AlertTriangle, Mail, Phone, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AccountDeactivatedModal() {
  const { logout } = useAuth();
  const [showContactInfo, setShowContactInfo] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Account Deactivated</h1>
          <p className="text-red-100 text-lg">Your account access has been temporarily suspended</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-6">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Your account has been deactivated by an administrator. This means you currently cannot access most features of the system.
            </p>
            <p className="text-gray-600">
              If you believe this is a mistake or need to regain access, please contact the administration team immediately.
            </p>
          </div>

          {/* Contact Information Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowContactInfo(!showContactInfo)}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 px-4 rounded-lg transition-colors font-medium"
            >
              {showContactInfo ? 'Hide Contact Information' : 'Show Contact Information'}
            </button>

            {showContactInfo && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Administration Contact:</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">admin@lms.com</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">Contact your institution</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Check Account Status Again
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm text-center">
              <strong>Note:</strong> This message will remain visible until your account is reactivated or you sign out.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}