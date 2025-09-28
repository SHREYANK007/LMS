'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="min-h-screen">
        <AdminSidebar />
        <main className="admin-main-content bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}