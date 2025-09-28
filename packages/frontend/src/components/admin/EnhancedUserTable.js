'use client';

export default function EnhancedUserTable({ users, onResetPassword, onDeleteUser, onViewDetails }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getCourseTypeLabel = (courseType) => {
    const courseTypes = {
      'PTE': 'PTE Academic',
      'IELTS': 'IELTS'
    };
    return courseTypes[courseType] || courseType || 'N/A';
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'TUTOR':
        return 'bg-green-100 text-green-800';
      case 'STUDENT':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User Details
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role & Course
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              {/* User Details */}
              <td className="px-4 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {user.name || 'No name set'}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="text-xs text-gray-400">
                    Created: {formatDate(user.createdAt)}
                  </div>
                </div>
              </td>

              {/* Role & Course */}
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="space-y-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                  <div className="text-sm text-gray-900">
                    {getCourseTypeLabel(user.courseType)}
                  </div>
                </div>
              </td>

              {/* Contact */}
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  <div>{user.phone || 'No phone'}</div>
                  <div className="text-xs text-gray-500">
                    DOB: {formatDate(user.dateOfBirth)}
                  </div>
                  {user.emergencyContact && (
                    <div className="text-xs text-gray-500">
                      Emergency: {user.emergencyContact}
                    </div>
                  )}
                </div>
              </td>

              {/* Status */}
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="space-y-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(user.isActive)}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="text-xs text-gray-500">
                    Last login: {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                  </div>
                </div>
              </td>

              {/* Actions */}
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => onViewDetails && onViewDetails(user)}
                    className="text-blue-600 hover:text-blue-900 text-xs"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onResetPassword(user.id)}
                    className="text-indigo-600 hover:text-indigo-900 text-xs"
                  >
                    Reset Password
                  </button>
                  {user.role !== 'ADMIN' && (
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 text-xs"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}