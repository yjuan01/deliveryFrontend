import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { usuario, logado } = useAuth();

  if (!logado) return <Navigate to="/login" replace />;
  if (usuario?.role !== 'admin') return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AdminRoute;
