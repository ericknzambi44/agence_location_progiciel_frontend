import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rhService } from '../services/rh.services';
import { EmployeCreation, PointageCreation } from '../types/employe.types';

// --- Employés ---
export const useEmployesActifs = () => {
  return useQuery({
    queryKey: ['rh', 'employes'],
    queryFn: () => rhService.getAllActifs().then(res => res.data),
  });
};

export const useCreerEmploye = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EmployeCreation) => rhService.create(data).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rh', 'employes'] }),
  });
};

// --- Pointages ---
export const useEnregistrerPointage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PointageCreation) => rhService.createPointage(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rh', 'pointages'] });
    },
  });
};

export const usePointages = (employeId: string, date: string) => {
  return useQuery({
    queryKey: ['rh', 'pointages', employeId, date],
    queryFn: () => rhService.getPointagesByEmployeAndDate(employeId, date).then(res => res.data),
    enabled: !!employeId && !!date,
  });
};