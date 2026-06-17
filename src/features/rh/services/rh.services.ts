import { apiClient } from '@/lib/api-client';
import { Employe, EmployeCreation, Pointage, PointageCreation } from '../types/employe.types';

export const rhService = {
  // --- Employés ---
  getAllActifs: () => apiClient.get<Employe[]>('/rh/employes/actifs/'),
  create: (data: EmployeCreation) => apiClient.post<Employe>('/rh/employes/', data),

  // --- Pointages ---
  createPointage: (data: PointageCreation) => apiClient.post<Pointage>('/rh/pointages/', data),
  getPointagesByEmployeAndDate: (employeId: string, date: string) =>
    apiClient.get<Pointage[]>(`/rh/employes/${employeId}/pointages/${date}/`),
};