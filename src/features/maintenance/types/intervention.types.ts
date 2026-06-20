export interface Technicien {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  cout_horaire: number;
}

export interface PieceDetachee {
  id: string;
  reference: string;
  nom: string;
  prix_unitaire: number;
  stock: number;
}

export interface Intervention {
  id: string;
  bien_id: string;
  technicien_id: string | null;
  date_debut: string;
  date_fin: string;
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'annulee';
  cout_total?: number;
  pieces_utilisees?: Array<[PieceDetachee, number]>; 
}

export type InterventionCreation = Omit<Intervention, 'id' | 'statut' | 'cout_total'>;

export interface AjoutPieceData {
  piece_id: string;
  quantite: number;
}

export type PieceCreation = Omit<PieceDetachee, 'id'>;