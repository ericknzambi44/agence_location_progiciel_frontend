import { apiClient } from '@/lib/api-client';
import { Intervention, InterventionCreation, PieceDetachee, AjoutPieceData } from '../types/intervention.types';

export const maintenanceService = {
  // --- Interventions ---
  getAll: () => apiClient.get<Intervention[]>('/maintenance/interventions/'),
  getById: (id: string) => apiClient.get<Intervention>(`/maintenance/interventions/${id}/`),
  create: (data: InterventionCreation) => apiClient.post<Intervention>('/maintenance/interventions/', data),
  demarrer: (id: string) => apiClient.post(`/maintenance/interventions/${id}/demarrer/`),
  ajouterPiece: (id: string, data: AjoutPieceData) =>
    apiClient.post(`/maintenance/interventions/${id}/ajouter_piece/`, data),
  terminer: (id: string) => apiClient.post<{ cout_total: number }>(`/maintenance/interventions/${id}/terminer/`),
  calculerCout: (id: string) => apiClient.get<{ cout_total: number }>(`/maintenance/interventions/${id}/cout/`),

  // --- Pièces détachées ---
  getAllPieces: () => apiClient.get<PieceDetachee[]>('/maintenance/pieces/'), // à vérifier si endpoint existe
};