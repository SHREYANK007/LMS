'use client';

import { useState } from 'react';

export default function CredentialsModal({ user, credentials, onClose }) {
  const [copied, setCopied] = useState(false);

  const credentialText = `
LMS Account Created Successfully

Name: ${user.name}
Email: ${user.email}
${credentials.generatedPassword ? `Password: ${credentials.password}` : 'Password: [Set by admin]'}
Role: ${user.role}
Course Type: ${user.courseType}

Login URL: ${window.location.origin}/auth/login

Please save these credentials securely and share them with the user.
${credentials.generatedPassword ? '\nIMPORTANT: This password will not be shown again!' : ''}
  `.trim();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(credentialText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadCredentials = () => {
    const blob = new Blob([credentialText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.name.replace(/\s+/g, '_')}_credentials.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-green-50">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">✓</span>
            </div>
            <h2 className="text-xl font-bold text-green-800">Account Created Successfully!</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              The {user.role.toLowerCase()} account has been created. Please save these credentials and share them with the user.
            </p>
          </div>

          {/* Credentials Display */}
          <div className="bg-gray-50 rounded-lg p-4 border mb-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
              </div>

              {credentials.generatedPassword && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Generated Password</label>
                  <p className="text-sm font-mono bg-yellow-50 px-2 py-1 rounded border border-yellow-200 text-gray-900">
                    {credentials.password}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    ⚠️ This password will not be shown again!
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Role</label>
                <p className="text-sm font-medium text-gray-900">{user.role}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Course Type</label>
                <p className="text-sm font-medium text-gray-900">{user.courseType}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Login URL</label>
                <p className="text-sm text-blue-600 font-mono">{window.location.origin}/auth/login</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={copyToClipboard}
              className={`w-full flex items-center justify-center px-4 py-2 rounded border ${
                copied
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <span className="mr-2">{copied ? '✓' : '📋'}</span>
              {copied ? 'Copied to Clipboard!' : 'Copy Credentials'}
            </button>

            <button
              onClick={downloadCredentials}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded hover:bg-gray-200"
            >
              <span className="mr-2">💾</span>
              Download as Text File
            </button>
          </div>

          {credentials.generatedPassword && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs text-yellow-800">
                <span className="font-medium">Important:</span> Make sure to save the generated password before closing this window.
                It cannot be retrieved later and will need to be reset if lost.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}