'use client';

import { useState, useEffect } from 'react';
import EnhancedCreateUserModal from '@/components/admin/EnhancedCreateUserModal';
import EnhancedUserTable from '@/components/admin/EnhancedUserTable';
import CredentialsModal from '@/components/admin/CredentialsModal';
import UserDetailsModal from '@/components/admin/UserDetailsModal';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterRole, setFilterRole] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [createdUserData, setCreatedUserData] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const query = filterRole === 'ALL' ? '' : `?role=${filterRole}`;
      const response = await fetch(`${apiUrl}/admin/users${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const handleUserCreated = (userData) => {
    setShowCreateModal(false);
    setCreatedUserData(userData);
    setShowCredentialsModal(true);
    fetchUsers();
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleResetPassword = async (userId) => {
    if (confirm('Reset password for this user? A new password will be generated.')) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('token');

        const response = await fetch(`${apiUrl}/admin/reset-password/${userId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });

        const data = await response.json();

        if (response.ok) {
          if (data.generatedPassword) {
            alert(`New password generated: ${data.generatedPassword}\nPlease save this password and share it with the user.`);
          } else {
            alert('Password reset successfully');
          }
        } else {
          alert(data.error || 'Failed to reset password');
        }
      } catch (err) {
        alert('Failed to reset password');
        console.error(err);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('token');

        const response = await fetch(`${apiUrl}/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok) {
          fetchUsers();
        } else {
          alert(data.error || 'Failed to delete user');
        }
      } catch (err) {
        alert('Failed to delete user');
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">User Management</h1>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterRole('ALL')}
              className={`px-4 py-2 rounded ${
                filterRole === 'ALL'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setFilterRole('STUDENT')}
              className={`px-4 py-2 rounded ${
                filterRole === 'STUDENT'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setFilterRole('TUTOR')}
              className={`px-4 py-2 rounded ${
                filterRole === 'TUTOR'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tutors
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowCreateModal('STUDENT')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Student
            </button>
            <button
              onClick={() => setShowCreateModal('TUTOR')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Create Tutor
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-800 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <EnhancedUserTable
          users={users}
          onResetPassword={handleResetPassword}
          onDeleteUser={handleDeleteUser}
          onViewDetails={handleViewDetails}
        />
      )}

      {showCreateModal && (
        <EnhancedCreateUserModal
          onClose={() => setShowCreateModal(false)}
          onUserCreated={handleUserCreated}
          defaultRole={showCreateModal}
        />
      )}

      {showCredentialsModal && createdUserData && (
        <CredentialsModal
          user={createdUserData.user}
          credentials={createdUserData.credentials}
          onClose={() => {
            setShowCredentialsModal(false);
            setCreatedUserData(null);
          }}
        />
      )}

      {showDetailsModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}