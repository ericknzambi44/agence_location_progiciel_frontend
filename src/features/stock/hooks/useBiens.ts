import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockService } from '../services/stock.services';
import { Bien, BienCreation } from '../types/bien.types';

/**
 * Hook pour récupérer la liste de tous les biens.
 */
export const useBiens = () => {
  return useQuery({
    queryKey: ['biens'],
    queryFn: () => stockService.getAll().then(res => res.data),
  });
};

/**
 * Hook pour récupérer un bien spécifique par ID.
 */
export const useBien = (id: string) => {
  return useQuery({
    queryKey: ['biens', id],
    queryFn: () => stockService.getById(id).then(res => res.data),
    enabled: !!id,
  });
};

/**
 * Hook pour créer un nouveau bien.
 * Invalide la liste des biens après succès.
 */
export const useCreerBien = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BienCreation) => stockService.create(data).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['biens'] }),
  });
};

/**
 * Hook pour changer l'état d'un bien.
 * Invalide les détails du bien et la liste.
 */
export const useChangerEtat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, etat }: { id: string; etat: Bien['etat'] }) =>
      stockService.changerEtat(id, etat).then(res => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['biens'] });
      queryClient.invalidateQueries({ queryKey: ['biens', variables.id] });
    },
  });
};

/**
 * Hook pour vérifier la disponibilité sur une période.
 */
export const useDisponibilite = (debut: string, fin: string) => {
  return useQuery({
    queryKey: ['biens', 'disponibles', debut, fin],
    queryFn: () => stockService.getDisponibles(debut, fin).then(res => res.data),
    enabled: !!debut && !!fin,
  });
};