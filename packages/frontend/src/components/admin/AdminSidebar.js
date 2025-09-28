'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
  FileText,
  MessageSquare,
  Star,
  DollarSign,
  FileBarChart,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
  Plus
} from 'lucide-react';
import EnhancedCreateUserModal from './EnhancedCreateUserModal';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin', description: 'Dashboard & Analytics' },
    { icon: Users, label: 'Students', href: '/admin/students', description: 'Manage student accounts' },
    { icon: GraduationCap, label: 'Tutors', href: '/admin/tutors', description: 'Tutor management' },
    { icon: Calendar, label: 'Sessions', href: '/admin/sessions', description: 'Schedule overview' },
    { icon: Calendar, label: 'Session Requests', href: '/admin/session-requests', description: 'Student requests' },
    { icon: Calendar, label: 'Availability', href: '/admin/availability', description: 'Tutor schedules' },
    { icon: BookOpen, label: 'Materials', href: '/admin/materials', description: 'Study resources' },
    { icon: Users, label: 'Masterclass', href: '/admin/masterclass', description: 'Group sessions' },
    { icon: MessageSquare, label: 'Announcements', href: '/admin/announcements', description: 'System notices' },
    { icon: FileText, label: 'FAQs', href: '/admin/faqs', description: 'Help content' },
    { icon: Star, label: 'Reviews', href: '/admin/reviews', description: 'Feedback system' },
    { icon: MessageSquare, label: 'Support', href: '/admin/support', description: 'Student queries' },
    { icon: DollarSign, label: 'Payments', href: '/admin/payments', description: 'Financial tracking' },
    { icon: FileBarChart, label: 'Analytics', href: '/admin/logs', description: 'System logs' },
    { icon: Settings, label: 'Settings', href: '/admin/settings', description: 'System configuration' }
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 z-40 transition-all duration-300 ease-out h-screen flex flex-col
        ${isCollapsed ? 'w-20' : 'w-64'}
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
      `}>
        <style jsx global>{`
          .admin-main-content {
            margin-left: ${isCollapsed ? '5rem' : '16rem'};
            transition: margin-left 300ms ease-out;
          }
        `}</style>
        {/* Header */}
        <div className={`${isCollapsed ? 'px-4' : 'px-6'} py-6 border-b border-slate-700/50 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">ScoreSmart</h1>
                  <p className="text-xs text-slate-400 font-medium">System Management</p>
                </div>
              </div>
            )}

            {/* Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-700/50 transition-colors duration-200"
            >
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isCollapsed ? 'rotate-90' : '-rotate-90'}`} />
            </button>
          </div>
        </div>

        {/* Role Badge */}
        {!isCollapsed && (
          <div className="px-6 pt-4 pb-2 flex-shrink-0">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-sm">
              <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
              Admin Portal
            </div>
          </div>
        )}

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 280px)' }}>
          <nav className={`${isCollapsed ? 'px-2' : 'px-4'} py-4 space-y-1`} style={{ minHeight: '600px' }}>
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group flex items-center rounded-xl transition-all duration-200
                    ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className={`
                    flex-shrink-0 transition-colors duration-200 w-5 h-5
                    ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}
                  `} />

                  {!isCollapsed && (
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.label}
                      </p>
                      <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                        {item.description}
                      </p>
                    </div>
                  )}

                  {!isCollapsed && isActive && (
                    <div className="ml-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </Link>
              )
            })}

            {/* Quick Actions */}
            {!isCollapsed && (
              <div className="mt-8 px-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Quick Actions
                </h3>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full flex items-center px-3 py-2 text-sm text-green-400 hover:bg-slate-700/50 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4 mr-3" />
                  Create Account
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Logout - Fixed at bottom */}
        <div className={`${isCollapsed ? 'px-2 py-4' : 'px-4 py-4'} border-t border-slate-700/50 flex-shrink-0`}>
          <button
            onClick={logout}
            className={`
              group flex items-center rounded-xl transition-all duration-200 w-full
              ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}
              text-red-400 hover:bg-red-500/10 hover:text-red-300
            `}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="flex-shrink-0 transition-colors duration-200 w-5 h-5" />

            {!isCollapsed && (
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium">
                  Sign Out
                </p>
                <p className="text-xs text-red-400/70 mt-0.5">
                  End your session
                </p>
              </div>
            )}
          </button>
        </div>
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
    </>
  );
}