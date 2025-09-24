'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TutorSidebar from '@/components/tutor/TutorSidebar';

export default function TutorLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['TUTOR']}>
      <div className="min-h-screen flex">
        <TutorSidebar />
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </ProtectedRoute>
  );
}