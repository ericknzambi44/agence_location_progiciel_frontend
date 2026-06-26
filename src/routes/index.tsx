import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/auth/views/LoginPage';
import { RegisterPage } from '@/features/auth/views/RegisterPage';
import { ActivatePage } from '@/features/auth/views/ActivatePage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StockModule } from '@/features/stock/views/StockModule';
import { RHModule } from '@/features/rh/views/RHModule';
import { MaintenanceModule } from '@/features/maintenance/views/MaintenanceModule';
import { AdministrationModule } from '@/features/administration/views/AdministrationModule';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { MainLayout } from '@/components/layouts/ MainLayout';
import { LocationModule } from '@/features/location/views/LocationModule';

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
      { path: 'stock/*', element: <StockModule /> },
      { path: 'rh/*', element: <RHModule /> },
      { path: 'maintenance/*', element: <MaintenanceModule /> },
      { path: 'administration/*', element: <AdministrationModule /> },
      { path: 'location/*', element: <LocationModule /> },
    ],
  },
]);