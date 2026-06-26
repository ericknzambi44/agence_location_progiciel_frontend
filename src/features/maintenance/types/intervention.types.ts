/**
 * Types pour le module Maintenance.
 * Correspondent aux entités du backend et aux données échangées via l'API.
 */

/**
 * Une pièce utilisée dans une intervention, avec sa quantité.
 * Ce format est retourné par le backend via le sérialiseur.
 */
export interface PieceUtilisee {
  id: string;
  reference: string;
  nom: string;
  prix_unitaire: number;
  quantite: number;
}

/**
 * Technicien (depuis maintenance_technicien).
 */
export interface Technicien {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  cout_horaire: number;
}

/**
 * Pièce détachée (stock).
 */
export interface PieceDetachee {
  id: string;
  reference: string;
  nom: string;
  prix_unitaire: number;
  stock: number;
}

/**
 * Intervention de maintenance.
 * Le champ pieces_utilisees est un tableau d'objets (format sérialisé).
 */
export interface Intervention {
  id: string;
  bien_id: string;
  technicien_id: string | null;
  date_debut: string;          // ISO datetime
  date_fin: string;
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'annulee';
  cout_total?: number;         // présent après terminaison ou calcul
  pieces_utilisees?: PieceUtilisee[];   // liste des pièces avec quantités
}

/**
 * Données nécessaires pour planifier une nouvelle intervention.
 */
export type InterventionCreation = Omit<Intervention, 'id' | 'statut' | 'cout_total' | 'pieces_utilisees'>;

/**
 * Payload pour ajouter une pièce à une intervention.
 */
export interface AjoutPieceData {
  piece_id: string;
  quantite: number;
}

/**
 * Données pour créer une nouvelle pièce détachée.
 */
export type PieceCreation = Omit<PieceDetachee, 'id'>;