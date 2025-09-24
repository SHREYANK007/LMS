'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();

  const cards = [
    {
      title: 'User Management',
      description: 'Create new student & tutor accounts, manage existing users',
      href: '/admin/users',
      icon: '👥',
      color: 'bg-blue-500',
      highlight: true,
    },
    {
      title: 'Sessions',
      description: 'View and manage all tutoring sessions',
      href: '/admin/sessions',
      icon: '📅',
      color: 'bg-green-500',
    },
    {
      title: 'Analytics',
      description: 'View system analytics and performance reports',
      href: '/admin/analytics',
      icon: '📈',
      color: 'bg-purple-500',
    },
    {
      title: 'Settings',
      description: 'Configure system settings and preferences',
      href: '/admin/settings',
      icon: '⚙️',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block hover:transform hover:scale-105 transition-transform duration-200"
          >
            <div className={`bg-white rounded-lg shadow-md p-6 ${card.highlight ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mb-4`}>
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {card.title}
                {card.highlight && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Primary</span>}
              </h3>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}