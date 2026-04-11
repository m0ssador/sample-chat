'use client';

import React from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

export default function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}
