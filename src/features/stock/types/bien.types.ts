/**
 * Représente un bien (article louable) tel que retourné par l'API.
 */
export interface Bien {
  id: string;
  reference: string;
  nom: string;
  description?: string;
  prix_unitaire_ht: number;
  date_achat?: string; // format ISO YYYY-MM-DD
  etat: 'disponible' | 'en_maintenance' | 'endommage' | 'archive';
  devise?: string
}

/**
 * Données nécessaires pour créer un bien (sans id et etat).
 */
export type BienCreation = Omit<Bien, 'id' | 'etat'>;

/**
 * Données pour changer l'état.
 */
export interface ChangerEtatData {
  etat: Bien['etat'];
}