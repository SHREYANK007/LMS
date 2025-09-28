'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  // Define all menu items with their feature keys
  const allMenuItems = [
    { href: '/student', label: 'Dashboard', icon: '📊', alwaysShow: true },
    { href: '/student/calendar', label: 'Calendar', icon: '📅', featureKey: 'calendar' },
    { href: '/student/smart-quad', label: 'Available Sessions', icon: '🎯', featureKey: 'smart_quad' },
    { href: '/student/materials', label: 'Materials', icon: '📚', featureKey: 'materials' },
    { href: '/student/progress', label: 'Progress', icon: '📈', featureKey: 'progress_tracking' },
    { href: '/student/one-to-one', label: 'One-to-One', icon: '👥', featureKey: 'one_to_one' },
    { href: '/student/masterclass', label: 'Masterclass', icon: '🎓', featureKey: 'masterclass' },
    { href: '/student/reviews', label: 'Reviews', icon: '⭐', alwaysShow: true },
    { href: '/student/support', label: 'Support', icon: '🎧', alwaysShow: true },
    { href: '/student/profile', label: 'Profile', icon: '👤', alwaysShow: true },
  ];

  // Filter menu items based on enabled features
  const menuItems = allMenuItems.filter(item => {
    // Always show items marked as alwaysShow
    if (item.alwaysShow) return true;

    // If no feature key, show by default
    if (!item.featureKey) return true;

    // Check if the feature is enabled for the user
    return user?.enabledFeatures?.includes(item.featureKey);
  });

  return (
    <div className="w-64 bg-green-900 text-white h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Student Portal</h2>
        <p className="text-sm text-green-200">{user?.email}</p>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-3 text-sm hover:bg-green-800 transition-colors ${
              pathname === item.href ? 'bg-green-800 border-l-4 border-yellow-400' : ''
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