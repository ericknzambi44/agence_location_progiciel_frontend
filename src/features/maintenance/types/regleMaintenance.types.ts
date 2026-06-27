export type TypeRegleMaintenance = 'forfait' | 'remise' | 'majoration';

export interface RegleMaintenance {
  type: TypeRegleMaintenance;
  valeur: number;
  duree_min: number;          // heures
  duree_max?: number | null;  // heures, null = illimité
  periode_debut?: string | null; // ISO date
  periode_fin?: string | null;
  description?: string;
  active?: boolean;
}

export interface RegleMaintenanceApi extends RegleMaintenance {
  id?: string;
}

export type RegleMaintenanceList = RegleMaintenanceApi[];