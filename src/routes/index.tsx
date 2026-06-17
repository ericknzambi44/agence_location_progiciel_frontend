import { createBrowserRouter, Navigate } from 'react-router-dom';
 
import { ActivatePage } from '@/features/auth/views/ActivatePage';
import { DashboardPage } from '@/features/dashboard/views/DashboardPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
  // pour le routing imbriqué, nous utiliserons un composant Switch ou nous importerons les routes directement
import { LoginPage } from '@/features/auth/views/LoginPage';
import { RegisterPage } from '@/features/auth/views/RegisterPage';
import { MainLayout } from '@/components/layouts/ MainLayout';
import { StockModule } from '@/features/stock/views/StockModule';
import { RHModule } from '@/features/rh/views/RHModule';
import { MaintenanceModule } from '@/features/maintenance/views/MaintenanceModule';
// Pour simplifier, nous allons utiliser un composant lazy-loaded pour chaque module.
// Nous allons créer un fichier d'index pour chaque module.

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/activate/:uid/:token',
    element: <ActivatePage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      // Importation des routes des modules
      { path: 'stock/*', element: <StockModule /> },
      { path: 'rh/*', element: <RHModule /> },
      { path: 'maintenance/*', element: <MaintenanceModule /> },
      // De la même manière pour les autres modules
    ],
  },
]);