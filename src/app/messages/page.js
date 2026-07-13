"use client";
import MessagesPage from '../../views/MessagesPage';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <MessagesPage />
    </ProtectedRoute>
  );
}
