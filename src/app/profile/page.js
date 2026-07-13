"use client";
import ProfilePage from '../../views/ProfilePage';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
