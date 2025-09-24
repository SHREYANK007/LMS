'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Menu,
  X,
  ChevronDown,
  Building2,
  Zap
} from 'lucide-react'

interface SidebarProps {
  role: 'admin' | 'tutor' | 'student'
}

const sidebarConfigs = {
  admin: [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin', description: 'Dashboard & Analytics' },
    { icon: Users, label: 'Students', href: '/admin/students', description: 'Manage student accounts' },
    { icon: GraduationCap, label: 'Tutors', href: '/admin/tutors', description: 'Tutor management' },
    { icon: Calendar, label: 'Sessions', href: '/admin/sessions', description: 'Schedule overview' },
    { icon: Calendar, label: 'Availability', href: '/admin/availability', description: 'Tutor schedules' },
    { icon: BookOpen, label: 'Materials', href: '/admin/materials', description: 'Study resources' },
    { icon: Users, label: 'Masterclass', href: '/admin/masterclass', description: 'Group sessions' },
    { icon: MessageSquare, label: 'Announcements', href: '/admin/announcements', description: 'System notices' },
    { icon: FileText, label: 'FAQs', href: '/admin/faqs', description: 'Help content' },
    { icon: Star, label: 'Reviews', href: '/admin/reviews', description: 'Feedback system' },
    { icon: MessageSquare, label: 'Support', href: '/admin/feedback', description: 'Student queries' },
    { icon: DollarSign, label: 'Payments', href: '/admin/payments', description: 'Financial tracking' },
    { icon: FileBarChart, label: 'Analytics', href: '/admin/logs', description: 'System logs' },
    { icon: Settings, label: 'Settings', href: '/admin/settings', description: 'System configuration' }
  ],
  tutor: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/tutor', description: 'Overview & stats' },
    { icon: Calendar, label: 'Schedule', href: '/tutor/schedule', description: 'Manage availability' },
    { icon: BookOpen, label: 'Materials', href: '/tutor/materials', description: 'Course resources' },
    { icon: MessageSquare, label: 'Announcements', href: '/tutor/announcements', description: 'Class notices' },
    { icon: MessageSquare, label: 'Support', href: '/tutor/support', description: 'Student queries' },
    { icon: Settings, label: 'Profile', href: '/tutor/profile', description: 'Account settings' }
  ],
  student: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/student', description: 'Your overview' },
    { icon: Zap, label: 'Smart Quad', href: '/student/smart-quad', description: 'Group sessions' },
    { icon: GraduationCap, label: 'One-to-One', href: '/student/one-to-one', description: 'Private tutoring' },
    { icon: Users, label: 'Masterclass', href: '/student/masterclass', description: 'Expert sessions' },
    { icon: BookOpen, label: 'Materials', href: '/student/materials', description: 'Study resources' },
    { icon: MessageSquare, label: 'Announcements', href: '/student/announcements', description: 'Latest updates' },
    { icon: Star, label: 'Reviews', href: '/student/reviews', description: 'Rate your experience' },
    { icon: MessageSquare, label: 'Support', href: '/student/feedback', description: 'Get help' },
    { icon: FileText, label: 'Help', href: '/student/faq', description: 'FAQ & guides' },
    { icon: Settings, label: 'Profile', href: '/student/profile', description: 'Account settings' }
  ]
}

const roleConfig = {
  admin: {
    title: 'Admin Portal',
    subtitle: 'System Management',
    gradient: 'from-red-500 to-pink-600',
    bgGradient: 'from-red-50 to-pink-50'
  },
  tutor: {
    title: 'Tutor Portal',
    subtitle: 'Teaching Hub',
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50'
  },
  student: {
    title: 'Student Portal',
    subtitle: 'Learning Journey',
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50'
  }
}

export default function Sidebar({ role }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const menuItems = sidebarConfigs[role]
  const config = roleConfig[role]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`
        transition-all duration-300 ease-out h-screen flex flex-col
        ${isCollapsed ? 'w-20' : 'w-64'}
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
        lg:block
        ${isOpen ? 'block' : 'hidden'}
      `}>
        {/* Header */}
        <div className={`${isCollapsed ? 'px-4' : 'px-6'} py-6 border-b border-slate-700/50 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${config.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">ScoreSmart</h1>
                  <p className="text-xs text-slate-400 font-medium">{config.subtitle}</p>
                </div>
              </div>
            )}

            {/* Collapse Toggle (Desktop only) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-700/50 transition-colors duration-200"
            >
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isCollapsed ? 'rotate-90' : '-rotate-90'}`} />
            </button>
          </div>
        </div>

        {/* Role Badge */}
        {!isCollapsed && (
          <div className="px-6 pt-4 pb-2 flex-shrink-0">
            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${config.gradient} text-white shadow-sm`}>
              <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
              {config.title}
            </div>
          </div>
        )}

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-scroll" style={{ height: 'calc(100vh - 280px)' }}>
          <nav className={`${isCollapsed ? 'px-2' : 'px-4'} py-4 space-y-1`} style={{ minHeight: '600px' }}>
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
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
                    flex-shrink-0 transition-colors duration-200
                    ${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'}
                    ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}
                  `} />

                  {!isCollapsed && (
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.label}
                      </p>
                      <p className="text-xs ${isActive ? 'text-white/80' : 'text-slate-500'} truncate mt-0.5">
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
          </nav>
        </div>

        {/* Logout - Fixed at bottom */}
        <div className={`${isCollapsed ? 'px-2 py-4' : 'px-4 py-4'} border-t border-slate-700/50 flex-shrink-0`}>
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className={`
                group flex items-center rounded-xl transition-all duration-200
                ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}
                text-red-400 hover:bg-red-500/10 hover:text-red-300
              `}
              title={isCollapsed ? 'Logout' : undefined}
            >
              <LogOut className={`
                flex-shrink-0 transition-colors duration-200
                ${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'}
              `} />

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
            </Link>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}