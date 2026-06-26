import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { locationService } from '../services/location.services'; 
import { ClientCreation, ContratCreation, Client, Contrat } from '../types/location.types';
import { RegleTarificationList, RegleTarification } from '../types/tarification.types';

// ============================================================
//  CLIENTS
// ============================================================

/**
 * Hook pour récupérer la liste des clients.
 * - staleTime : 5 minutes
 * - retry : 2 tentatives en cas d'échec
 */
export const useClients = (options?: UseQueryOptions<Client[]>) => {
  return useQuery<Client[]>({
    queryKey: ['location', 'clients'],
    queryFn: () => locationService.getClients().then(res => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    ...options,
  });
};

/**
 * Hook pour créer un nouveau client.
 * Invalide la liste des clients après succès.
 */
export const useCreerClient = (options?: UseMutationOptions<Client, Error, ClientCreation>) => {
  const queryClient = useQueryClient();
  return useMutation<Client, Error, ClientCreation>({
    mutationFn: (data: ClientCreation) => locationService.createClient(data).then(res => res.data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['location', 'clients'] });
      options?.onSuccess?.(...args);
    },
    onError: options?.onError,
  });
};

// ============================================================
//  CONTRATS
// ============================================================

/**
 * Hook pour récupérer la liste des contrats actifs.
 */
export const useContrats = (options?: UseQueryOptions<Contrat[]>) => {
  return useQuery<Contrat[]>({
    queryKey: ['location', 'contrats'],
    queryFn: () => locationService.getContrats().then(res => res.data),
    staleTime: 2 * 60 * 1000,
    retry: 2,
    ...options,
  });
};

/**
 * Hook pour créer un nouveau contrat de location.
 * Invalide la liste des contrats après succès.
 */
export const useCreerContrat = (options?: UseMutationOptions<Contrat, Error, ContratCreation>) => {
  const queryClient = useQueryClient();
  return useMutation<Contrat, Error, ContratCreation>({
    mutationFn: (data: ContratCreation) => locationService.createContrat(data).then(res => res.data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['location', 'contrats'] });
      options?.onSuccess?.(...args);
    },
    onError: options?.onError,
  });
};

/**
 * Hook pour retourner un bien (terminer un contrat).
 */
export const useRetournerContrat = (options?: UseMutationOptions<void, Error, string>) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => locationService.retournerContrat(id).then(() => undefined),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['location', 'contrats'] });
      options?.onSuccess?.(...args);
    },
    onError: options?.onError,
  });
};

/**
 * Hook pour calculer le montant estimé d'une location.
 * Utilisé dans le formulaire de création de contrat.
 */
export const useCalculerMontant = (options?: UseMutationOptions<number, Error, { bien_id: string; date_debut: string; date_fin: string }>) => {
  return useMutation<number, Error, { bien_id: string; date_debut: string; date_fin: string }>({
    mutationFn: ({ bien_id, date_debut, date_fin }) =>
      locationService.calculerMontant(bien_id, date_debut, date_fin).then(res => res.data.montant_total),
    ...options,
  });
};

// ============================================================
//  RÈGLES DE TARIFICATION
// ============================================================

/**
 * Hook pour récupérer les règles de tarification actuelles.
 */
export const useReglesTarification = (options?: UseQueryOptions<RegleTarificationList>) => {
  return useQuery<RegleTarificationList>({
    queryKey: ['location', 'tarification'],
    queryFn: () => locationService.getTarification().then(res => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    ...options,
  });
};

/**
 * Hook pour mettre à jour les règles de tarification (remplacement complet).
 * Invalide le cache des règles après succès.
 */
export const useUpdateReglesTarification = (options?: UseMutationOptions<RegleTarificationList, Error, RegleTarificationList>) => {
  const queryClient = useQueryClient();
  return useMutation<RegleTarificationList, Error, RegleTarificationList>({
    mutationFn: (regles: RegleTarificationList) =>
      locationService.setTarification(regles).then(res => res.data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['location', 'tarification'] });
      options?.onSuccess?.(...args);
    },
    onError: options?.onError,
  });
};