'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import StudentSidebar from '@/components/student/StudentSidebar';

export default function StudentLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <div className="min-h-screen flex">
        <div className="fixed inset-y-0 left-0 z-10">
          <StudentSidebar />
        </div>
        <main className="flex-1 bg-gray-50 ml-64 overflow-y-auto">{children}</main>
      </div>
    </ProtectedRoute>
  );
}