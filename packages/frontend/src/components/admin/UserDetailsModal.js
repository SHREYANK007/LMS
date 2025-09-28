'use client';

export default function UserDetailsModal({ user, onClose }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCourseTypeLabel = (courseType) => {
    const courseTypes = {
      'PTE': 'PTE Academic',
      'IELTS': 'IELTS'
    };
    return courseTypes[courseType] || 'Not specified';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Personal Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-sm text-gray-900">{user.name || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Email Address</label>
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Role</label>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'TUTOR' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {user.role}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Course Type</label>
                <p className="text-sm text-gray-900">{getCourseTypeLabel(user.courseType)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-sm text-gray-900">{formatDate(user.dateOfBirth)}</p>
              </div>
            </div>

            {/* Contact & Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Contact & Account
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                <p className="text-sm text-gray-900">{user.phone || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Emergency Contact</label>
                <p className="text-sm text-gray-900">{user.emergencyContact || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Account Status</label>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Account Created</label>
                <p className="text-sm text-gray-900">{formatDateTime(user.createdAt)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-sm text-gray-900">{formatDateTime(user.updatedAt)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Last Login</label>
                <p className="text-sm text-gray-900">{formatDateTime(user.lastLogin)}</p>
              </div>
            </div>
          </div>

          {/* Account ID */}
          <div className="mt-6 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-500">Account ID</label>
              <p className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
                {user.id}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}