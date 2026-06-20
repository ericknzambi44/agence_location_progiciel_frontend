/**
 * Agence – structure plate correspondant à l'API.
 */
export interface Agence {
  id: string;
  nom: string;
  adresse_ligne1: string;
  adresse_ligne2?: string;
  code_postal?: string;
  ville: string;
  pays: string;
  telephone: string;
  email: string;
  actif: boolean;
  date_creation: string; // ISO datetime
}

export type AgenceCreation = Omit<Agence, 'id' | 'actif' | 'date_creation'>;

/**
 * Module configurable
 */
export interface ModuleConfig {
  id: string;
  code: string;
  nom: string;
  description: string;
  active: boolean;
  ordre_affichage: number;
  parametres: Record<string, any>;
}

export interface PermissionVerification {
  employe_id: string;
  permission_code: string;
}