'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function TutorSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const menuItems = [
    { href: '/tutor', label: 'Dashboard', icon: '📊' },
    { href: '/tutor/sessions', label: 'One-to-One', icon: '📖' },
    { href: '/tutor/schedule', label: 'Schedule', icon: '📅' },
    { href: '/tutor/smart-quad', label: 'Smart Quad', icon: '👥' },
    { href: '/tutor/materials', label: 'Materials', icon: '📚' },
    { href: '/tutor/support', label: 'Support', icon: '🎧' },
    { href: '/tutor/profile', label: 'Profile', icon: '👤' },
    { href: '/tutor/availability', label: 'Availability', icon: '🕐' },
  ];

  return (
    <div className="w-64 bg-blue-900 text-white h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Tutor Portal</h2>
        <p className="text-sm text-blue-200">{user?.email}</p>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-3 text-sm hover:bg-blue-800 transition-colors ${
              pathname === item.href ? 'bg-blue-800 border-l-4 border-yellow-400' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 p-4">
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}