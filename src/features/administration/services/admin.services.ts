import { apiClient } from '@/lib/api-client';
import { Agence, AgenceCreation, ModuleConfig, PermissionVerification } from '../types/admin.types';

/**
 * Service de communication avec l'API d'administration.
 * Respecte les endpoints REST définis dans AdminViewSet.
 */
export const adminService = {
  // --- Agences ---
  /**
   * Récupère la liste des agences actives.
   * Endpoint: GET /admin/ (utilise la méthode list du ViewSet)
   */
  getAgencesActives: () => apiClient.get<Agence[]>('/admin/'),

  /**
   * Crée une nouvelle agence.
   * Endpoint: POST /admin/
   */
  createAgence: (data: AgenceCreation) => apiClient.post<Agence>('/admin/', data),

  // --- Modules ---
  /**
   * Liste tous les modules configurables.
   * Endpoint: GET /admin/modules/
   */
  getModules: () => apiClient.get<ModuleConfig[]>('/admin/modules/'),

  /**
   * Liste les modules actifs uniquement.
   * Endpoint: GET /admin/modules/actifs/
   */
  getModulesActifs: () => apiClient.get<ModuleConfig[]>('/admin/modules/actifs/'),

  /**
   * Active un module.
   * Endpoint: POST /admin/modules/{id}/activer/
   */
  activerModule: (id: string) => apiClient.post(`/admin/modules/${id}/activer/`),

  /**
   * Désactive un module.
   * Endpoint: POST /admin/modules/{id}/desactiver/
   */
  desactiverModule: (id: string) => apiClient.post(`/admin/modules/${id}/desactiver/`),

  /**
   * Met à jour les paramètres d'un module.
   * Endpoint: PATCH /admin/modules/{id}/configurer/
   */
  configurerModule: (id: string, parametres: Record<string, any>) =>
    apiClient.patch(`/admin/modules/${id}/configurer/`, { parametres }),

  // --- Permissions ---
  /**
   * Vérifie si un employé possède une permission donnée.
   * Endpoint: POST /admin/verifier-permission/
   */
  verifierPermission: (data: PermissionVerification) =>
    apiClient.post<{ autorise: boolean }>('/admin/verifier-permission/', data),
};