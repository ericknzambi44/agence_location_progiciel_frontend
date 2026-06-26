import { apiClient } from '@/lib/api-client';
import { Client, ClientCreation, Contrat, ContratCreation } from '../types/location.types';
import { RegleTarificationList } from '../types/tarification.types';

export const locationService = {
  getClients: () => apiClient.get<Client[]>('/location/clients/'),
  createClient: (data: ClientCreation) => apiClient.post<Client>('/location/clients/', data),
  getContrats: () => apiClient.get<Contrat[]>('/location/contrats/'),
  createContrat: (data: ContratCreation) => apiClient.post<Contrat>('/location/contrats/', data),
  retournerContrat: (id: string) => apiClient.post(`/location/contrats/${id}/retourner/`),
  calculerMontant: (bien_id: string, date_debut: string, date_fin: string) =>
    apiClient.post<{ montant_total: number }>('/location/calculer-montant/', { bien_id, date_debut, date_fin }),
  // Ajouter ces méthodes au service existant

/**
 * Récupère toutes les règles de tarification
 */
getTarification: () => apiClient.get<RegleTarificationList>('/location/tarification/'),

/**
 * Remplace toutes les règles par une nouvelle liste
 */
setTarification: (regles: RegleTarificationList) =>
  apiClient.post<RegleTarificationList>('/location/tarification/', { regles }),

/**
 * Supprime une règle (à implémenter côté backend si besoin)
 * Pour l'instant, on peut la supprimer en renvoyant la liste sans elle
 */
// deleteRegle: (index: number) => ...


getContrat: (id: string) => apiClient.get<Contrat>(`/location/contrats/${id}/`),
};


