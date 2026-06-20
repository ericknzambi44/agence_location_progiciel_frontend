import { apiClient } from '@/lib/api-client';
import {
  Intervention,
  InterventionCreation,
  PieceDetachee,
  AjoutPieceData,
  Technicien,
  PieceCreation,
} from '../types/intervention.types';

/**
 * Service de communication avec l'API Maintenance.
 * Gère les interventions, les techniciens et les pièces détachées.
 */
export const maintenanceService = {
  // ============================================================
  //  INTERVENTIONS
  // ============================================================

  /**
   * Récupère la liste de toutes les interventions.
   * GET /maintenance/interventions/
   */
  getAll: () => apiClient.get<Intervention[]>('/maintenance/interventions/'),

  /**
   * Récupère une intervention par son ID.
   * GET /maintenance/interventions/{id}/
   */
  getById: (id: string) => apiClient.get<Intervention>(`/maintenance/interventions/${id}/`),

  /**
   * Planifie une nouvelle intervention.
   * POST /maintenance/interventions/
   */
  create: (data: InterventionCreation) =>
    apiClient.post<Intervention>('/maintenance/interventions/', data),

  /**
   * Démarre une intervention.
   * POST /maintenance/interventions/{id}/demarrer/
   */
  demarrer: (id: string) => apiClient.post(`/maintenance/interventions/${id}/demarrer/`),

  /**
   * Ajoute une pièce détachée à une intervention.
   * POST /maintenance/interventions/{id}/ajouter_piece/
   */
  ajouterPiece: (id: string, data: AjoutPieceData) =>
    apiClient.post(`/maintenance/interventions/${id}/ajouter_piece/`, data),

  /**
   * Termine une intervention et retourne le coût total.
   * POST /maintenance/interventions/{id}/terminer/
   */
  terminer: (id: string) =>
    apiClient.post<{ cout_total: number }>(`/maintenance/interventions/${id}/terminer/`),

  /**
   * Calcule le coût d'une intervention (sans la terminer).
   * GET /maintenance/interventions/{id}/cout/
   */
  calculerCout: (id: string) =>
    apiClient.get<{ cout_total: number }>(`/maintenance/interventions/${id}/cout/`),

  // ============================================================
  //  TECHNICIENS
  // ============================================================

  /**
   * Récupère la liste des techniciens disponibles (depuis maintenance_technicien).
   * GET /maintenance/interventions/techniciens/
   */
  getTechniciens: () => apiClient.get<Technicien[]>('/maintenance/interventions/techniciens/'),

  // ============================================================
  //  PIÈCES DÉTACHÉES
  // ============================================================

  /**
   * Récupère toutes les pièces détachées.
   * GET /maintenance/pieces/
   */
  getPieces: () => apiClient.get<PieceDetachee[]>('/maintenance/pieces/'),

  /**
   * Crée une nouvelle pièce détachée.
   * POST /maintenance/pieces/
   */
  createPiece: (data: PieceCreation) =>
    apiClient.post<PieceDetachee>('/maintenance/pieces/', data),

  /**
   * Met à jour partiellement une pièce détachée.
   * PATCH /maintenance/pieces/{id}/
   */
  updatePiece: (id: string, data: Partial<PieceCreation>) =>
    apiClient.patch<PieceDetachee>(`/maintenance/pieces/${id}/`, data),

  /**
   * Supprime une pièce détachée.
   * DELETE /maintenance/pieces/{id}/
   */
  deletePiece: (id: string) => apiClient.delete(`/maintenance/pieces/${id}/`),
  // --- Retirer une pièce d'une intervention ---
retirerPiece: (interventionId: string, pieceId: string) =>
  apiClient.delete(`/maintenance/interventions/${interventionId}/pieces/${pieceId}/`),
};