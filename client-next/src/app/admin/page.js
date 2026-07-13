"use client";
import AdminDashboard from '../../views/AdminDashboard';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
