'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import StudentSidebar from '@/components/student/StudentSidebar';

export default function StudentLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <div className="min-h-screen flex">
        <StudentSidebar />
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </ProtectedRoute>
  );
}