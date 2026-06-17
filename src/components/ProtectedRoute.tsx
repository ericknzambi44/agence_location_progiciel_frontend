import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';

/**
 * Composant qui protège les routes nécessitant une authentification.
 * Si l'utilisateur n'est pas authentifié, il est redirigé vers la page de login.
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};