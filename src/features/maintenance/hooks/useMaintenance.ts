import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenanceService } from '../services/maintenance.services';
import {
  InterventionCreation,
  AjoutPieceData,
  PieceDetachee,
  PieceCreation,
} from '../types/intervention.types';
import { RegleMaintenanceList } from '../types/regleMaintenance.types';

// ============================================================
//  INTERVENTIONS
// ============================================================

export const useInterventions = () => {
  return useQuery({
    queryKey: ['maintenance', 'interventions'],
    queryFn: () => maintenanceService.getAll().then(res => res.data),
  });
};

export const useIntervention = (id: string) => {
  return useQuery({
    queryKey: ['maintenance', 'interventions', id],
    queryFn: () => maintenanceService.getById(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useCreerIntervention = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InterventionCreation) =>
      maintenanceService.create(data).then(res => res.data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'interventions'] }),
  });
};

export const useDemarrerIntervention = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => maintenanceService.demarrer(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'interventions', id] });
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'interventions'] });
    },
  });
};

export const useAjouterPiece = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AjoutPieceData }) =>
      maintenanceService.ajouterPiece(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'interventions', id] });
    },
  });
};

export const useTerminerIntervention = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => maintenanceService.terminer(id).then(res => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'interventions', id] });
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'interventions'] });
    },
  });
};

export const useCalculerCout = (id: string) => {
  return useQuery({
    queryKey: ['maintenance', 'interventions', id, 'cout'],
    queryFn: () => maintenanceService.calculerCout(id).then(res => res.data.cout_total),
    enabled: !!id,
  });
};

// ============================================================
//  TECHNICIENS
// ============================================================

export const useTechniciens = () => {
  return useQuery({
    queryKey: ['maintenance', 'techniciens'],
    queryFn: () => maintenanceService.getTechniciens().then(res => res.data),
  });
};

// ============================================================
//  PIÈCES DÉTACHÉES
// ============================================================

export const usePieces = () => {
  return useQuery({
    queryKey: ['maintenance', 'pieces'],
    queryFn: () => maintenanceService.getPieces().then(res => res.data),
  });
};

export const useCreerPiece = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PieceCreation) =>
      maintenanceService.createPiece(data).then(res => res.data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'pieces'] }),
  });
};

export const useModifierPiece = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PieceCreation> }) =>
      maintenanceService.updatePiece(id, data).then(res => res.data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'pieces'] }),
  });
};

export const useSupprimerPiece = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => maintenanceService.deletePiece(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'pieces'] }),
  });
};


export const useRetirerPiece = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ interventionId, pieceId }: { interventionId: string; pieceId: string }) =>
      maintenanceService.retirerPiece(interventionId, pieceId),
    onSuccess: (_, { interventionId }) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'interventions', interventionId] });
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'interventions'] });
    },
  });
};



export const useReglesMaintenance = () => {
  return useQuery({
    queryKey: ['maintenance', 'regles'],
    queryFn: () => maintenanceService.getReglesMaintenance().then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateReglesMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (regles: RegleMaintenanceList) =>
      maintenanceService.setReglesMaintenance(regles).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'regles'] });
    },
  });
};