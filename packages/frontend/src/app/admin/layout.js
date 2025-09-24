'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="min-h-screen flex">
        <AdminSidebar />
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </ProtectedRoute>
  );
}