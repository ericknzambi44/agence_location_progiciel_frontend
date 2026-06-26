export type TypeRegle = 'forfait' | 'remise' | 'majoration';

export interface RegleTarification {
  type: TypeRegle;
  valeur: number;
  duree_min: number;
  duree_max?: number | null;
  bien_id?: string | null;     
  categorie_id?: string | null;
  periode_debut?: string | null;
  periode_fin?: string | null;
  description?: string;
  active?: boolean;
}

export interface RegleTarificationApi extends RegleTarification {
  id?: string;
}

export type RegleTarificationList = RegleTarificationApi[];