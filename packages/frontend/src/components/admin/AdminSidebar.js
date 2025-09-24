'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import EnhancedCreateUserModal from './EnhancedCreateUserModal';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/sessions', label: 'Sessions', icon: '📅' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Admin Panel</h2>
        <p className="text-sm text-gray-400">{user?.email}</p>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-3 text-sm hover:bg-gray-800 transition-colors ${
              pathname === item.href ? 'bg-gray-800 border-l-4 border-blue-500' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {/* Quick Actions */}
        <div className="mt-8 px-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Quick Actions
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center px-3 py-2 text-sm text-green-400 hover:bg-gray-800 rounded-md transition-colors"
          >
            <span className="mr-3">➕</span>
            Create Account
          </button>
        </div>
      </nav>

      <div className="absolute bottom-0 w-64 p-4">
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      {showCreateModal && (
        <EnhancedCreateUserModal
          onClose={() => setShowCreateModal(false)}
          onUserCreated={() => {
            setShowCreateModal(false);
            // Optionally refresh user data if needed
          }}
        />
      )}
    </div>
  );
}