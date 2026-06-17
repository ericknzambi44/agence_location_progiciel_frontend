import { apiClient } from '@/lib/api-client';
import { Bien, BienCreation } from '../types/bien.types';

/**
 * Service de communication avec l'API Stock.
 * Toutes les méthodes retournent une Promise contenant la réponse Axios.
 */
export const stockService = {
  /**
   * Récupère la liste de tous les biens.
   */
  getAll: () => apiClient.get<Bien[]>('/stock/biens/'),

  /**
   * Récupère un bien par son ID.
   */
  getById: (id: string) => apiClient.get<Bien>(`/stock/biens/${id}/`),

  /**
   * Crée un nouveau bien.
   */
  create: (data: BienCreation) => apiClient.post<Bien>('/stock/biens/', data),

  /**
   * Change l'état d'un bien.
   */
  changerEtat: (id: string, etat: Bien['etat']) =>
    apiClient.patch(`/stock/biens/${id}/changer_etat/`, { etat }),

  /**
   * Vérifie la disponibilité sur une période donnée.
   */
  getDisponibles: (debut: string, fin: string) =>
    apiClient.get<Bien[]>(`/stock/biens/disponibles/?debut=${debut}&fin=${fin}`),
};