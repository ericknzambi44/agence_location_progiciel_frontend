import { useQuery } from '@tanstack/react-query';
import { statistiquesService } from '../services/statistiques.services';
import { PeriodeInput } from '../types/statistiques.types';

export const useSynthese = (params: PeriodeInput) => {
  return useQuery({
    queryKey: ['statistiques', 'synthese', params],
    queryFn: () => statistiquesService.getSynthese(params).then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useRevenus = (params: PeriodeInput & { unite?: 'jour' | 'mois' | 'annee' }) => {
  return useQuery({
    queryKey: ['statistiques', 'revenus', params],
    queryFn: () => statistiquesService.getRevenus(params).then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useRevenusParBien = (params: PeriodeInput) => {
  return useQuery({
    queryKey: ['statistiques', 'revenus-par-bien', params],
    queryFn: () => statistiquesService.getRevenusParBien(params).then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useContrats = (params: PeriodeInput & { unite?: 'jour' | 'mois' | 'annee' }) => {
  return useQuery({
    queryKey: ['statistiques', 'contrats', params],
    queryFn: () => statistiquesService.getContrats(params).then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useContratsStatut = (params: PeriodeInput) => {
  return useQuery({
    queryKey: ['statistiques', 'contrats-statut', params],
    queryFn: () => statistiquesService.getContratsStatut(params).then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTauxOccupation = (params: PeriodeInput) => {
  return useQuery({
    queryKey: ['statistiques', 'taux-occupation', params],
    queryFn: () => statistiquesService.getTauxOccupation(params).then(res => res.data.taux),
    staleTime: 5 * 60 * 1000,
  });
};

export const useBiensPopulaires = (params: PeriodeInput & { limite?: number }) => {
  return useQuery({
    queryKey: ['statistiques', 'biens-populaires', params],
    queryFn: () => statistiquesService.getBiensPopulaires(params).then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePiecesPopulaires = (params: PeriodeInput & { limite?: number }) => {
  return useQuery({
    queryKey: ['statistiques', 'pieces-populaires', params],
    queryFn: () => statistiquesService.getPiecesPopulaires(params).then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useInterventionsTechniciens = (params: PeriodeInput) => {
  return useQuery({
    queryKey: ['statistiques', 'interventions-techniciens', params],
    queryFn: () => statistiquesService.getInterventionsTechniciens(params).then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useStatistiquesInterventions = (params: PeriodeInput) => {
  return useQuery({
    queryKey: ['statistiques', 'statistiques-interventions', params],
    queryFn: () => statistiquesService.getStatistiquesInterventions(params).then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useClientsActifs = (params: PeriodeInput) => {
  return useQuery({
    queryKey: ['statistiques', 'clients-actifs', params],
    queryFn: () => statistiquesService.getClientsActifs(params).then(res => res.data.nb_clients_actifs),
    staleTime: 5 * 60 * 1000,
  });
};

export const useClientsPlusActifs = (params: PeriodeInput & { limite?: number }) => {
  return useQuery({
    queryKey: ['statistiques', 'clients-plus-actifs', params],
    queryFn: () => statistiquesService.getClientsPlusActifs(params).then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
};