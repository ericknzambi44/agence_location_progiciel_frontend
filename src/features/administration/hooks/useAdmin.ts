/**
 * Hooks React Query pour le module Administration.
 * Gère les appels API pour les agences, les modules et les permissions.
 * Tous les hooks sont typés et intègrent la gestion du cache et des mutations.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin.services';
import { AgenceCreation, PermissionVerification } from '../types/admin.types';

// ============================================================
//  AGENCES
// ============================================================

/**
 * Récupère la liste des agences actives.
 * La réponse est directement un tableau (pas de pagination).
 */
export const useAgencesActives = () => {
  return useQuery({
    queryKey: ['admin', 'agences'],
    queryFn: async () => {
      const response = await adminService.getAgencesActives();
      return response.data; // déjà un tableau
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Crée une nouvelle agence.
 * Invalide automatiquement la liste des agences après succès.
 */
export const useCreerAgence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AgenceCreation) =>
      adminService.createAgence(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'agences'] });
    },
  });
};

// ============================================================
//  MODULES
// ============================================================

/**
 * Récupère tous les modules configurables.
 */
export const useModules = () => {
  return useQuery({
    queryKey: ['admin', 'modules'],
    queryFn: async () => {
      const response = await adminService.getModules();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Récupère uniquement les modules actifs.
 */
export const useModulesActifs = () => {
  return useQuery({
    queryKey: ['admin', 'modules', 'actifs'],
    queryFn: async () => {
      const response = await adminService.getModulesActifs();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Active un module par son ID.
 * Invalide les deux listes (tous + actifs).
 */
export const useActiverModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.activerModule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'modules'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'modules', 'actifs'] });
    },
  });
};

/**
 * Désactive un module par son ID.
 * Invalide les deux listes.
 */
export const useDesactiverModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.desactiverModule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'modules'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'modules', 'actifs'] });
    },
  });
};

/**
 * Met à jour les paramètres d'un module.
 */
export const useConfigurerModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, parametres }: { id: string; parametres: Record<string, any> }) =>
      adminService.configurerModule(id, parametres),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'modules'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'modules', 'actifs'] });
      // Optionnel : invalider le détail du module si vous avez un useModule(id)
      queryClient.invalidateQueries({ queryKey: ['admin', 'modules', id] });
    },
  });
};

// ============================================================
//  PERMISSIONS
// ============================================================

/**
 * Vérifie si un employé possède une permission donnée.
 * Retourne true/false directement.
 */
export const useVerifierPermission = () => {
  return useMutation({
    mutationFn: (data: PermissionVerification) =>
      adminService.verifierPermission(data).then((res) => res.data.autorise),
  });
};