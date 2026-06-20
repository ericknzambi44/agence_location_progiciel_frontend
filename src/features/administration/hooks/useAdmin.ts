import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin.services';
import { AgenceCreation, PermissionVerification } from '../types/admin.types';

// --- Agences ---
export const useAgencesActives = () => {
  return useQuery({
    queryKey: ['admin', 'agences'],
    queryFn: async () => {
      const response = await adminService.getAgencesActives();
      // La réponse est directement un tableau (pas de wrapper pagination)
      return response.data;
    },
  });
};

export const useCreerAgence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AgenceCreation) => adminService.createAgence(data).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'agences'] }),
  });
};

// --- Modules ---
export const useModules = () => {
  return useQuery({
    queryKey: ['admin', 'modules'],
    queryFn: async () => {
      const response = await adminService.getModules();
      return response.data;
    },
  });
};

export const useModulesActifs = () => {
  return useQuery({
    queryKey: ['admin', 'modules', 'actifs'],
    queryFn: async () => {
      const response = await adminService.getModulesActifs();
      return response.data;
    },
  });
};

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

export const useConfigurerModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, parametres }: { id: string; parametres: Record<string, any> }) =>
      adminService.configurerModule(id, parametres),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'modules'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'modules', 'actifs'] });
    },
  });
};

// --- Permissions ---
export const useVerifierPermission = () => {
  return useMutation({
    mutationFn: (data: PermissionVerification) =>
      adminService.verifierPermission(data).then(res => res.data.autorise),
  });
};