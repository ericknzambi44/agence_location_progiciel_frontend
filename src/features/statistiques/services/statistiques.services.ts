import { apiClient } from '@/lib/api-client';
import {
  Synthese,
  RevenuParPeriode,
  RevenuParBien,
  RevenuParClient,
  ContratParPeriode,
  ContratParStatut,
  BienPopulaire,
  PiecePopulaire,
  InterventionTechnicien,
  StatistiquesInterventions,
  ClientActif,
  PeriodeInput,
} from '../types/statistiques.types';

export const statistiquesService = {
  getSynthese: (params: PeriodeInput) =>
    apiClient.get<Synthese>('/statistiques/statistiques/synthese/', { params }),

  getRevenus: (params: PeriodeInput & { unite?: 'jour' | 'mois' | 'annee' }) =>
    apiClient.get<RevenuParPeriode[]>('/statistiques/statistiques/revenus/', { params }),

  getRevenusParBien: (params: PeriodeInput) =>
    apiClient.get<RevenuParBien[]>('/statistiques/statistiques/revenus-par-bien/', { params }),

  getRevenusParClient: (params: PeriodeInput) =>
    apiClient.get<RevenuParClient[]>('/statistiques/statistiques/revenus-par-client/', { params }),

  getContrats: (params: PeriodeInput & { unite?: 'jour' | 'mois' | 'annee' }) =>
    apiClient.get<ContratParPeriode[]>('/statistiques/statistiques/contrats/', { params }),

  getContratsStatut: (params: PeriodeInput) =>
    apiClient.get<ContratParStatut>('/statistiques/statistiques/contrats-statut/', { params }),

  getTauxOccupation: (params: PeriodeInput) =>
    apiClient.get<{ taux: number }>('/statistiques/statistiques/taux-occupation/', { params }),

  getBiensPopulaires: (params: PeriodeInput & { limite?: number }) =>
    apiClient.get<BienPopulaire[]>('/statistiques/statistiques/biens-populaires/', { params }),

  getPiecesPopulaires: (params: PeriodeInput & { limite?: number }) =>
    apiClient.get<PiecePopulaire[]>('/statistiques/statistiques/pieces-populaires/', { params }),

  getInterventionsTechniciens: (params: PeriodeInput) =>
    apiClient.get<InterventionTechnicien[]>('/statistiques/statistiques/interventions-techniciens/', { params }),

  getStatistiquesInterventions: (params: PeriodeInput) =>
    apiClient.get<StatistiquesInterventions>('/statistiques/statistiques/statistiques-interventions/', { params }),

  getClientsActifs: (params: PeriodeInput) =>
    apiClient.get<{ nb_clients_actifs: number }>('/statistiques/statistiques/clients-actifs/', { params }),

  getClientsPlusActifs: (params: PeriodeInput & { limite?: number }) =>
    apiClient.get<ClientActif[]>('/statistiques/statistiques/clients-plus-actifs/', { params }),
};