import { Navigate, Outlet } from 'react-router';
import { useSession } from '../session/useSession';

export function ProtectedRoute() {
  const { user } = useSession();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
