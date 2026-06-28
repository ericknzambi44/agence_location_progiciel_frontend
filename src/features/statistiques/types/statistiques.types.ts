export interface PeriodeInput {
  debut: string; // YYYY-MM-DD
  fin: string;
}

export interface RevenuParPeriode {
  periode_label: string;
  total: number;
}

export interface RevenuParBien {
  bien_id: string;
  nom: string;
  total_revenus: number;
  nb_contrats: number;
}

export interface RevenuParClient {
  client_id: string;
  total_depense: number;
  nb_contrats: number;
}

export interface ContratParPeriode {
  periode_label: string;
  total: number;
}

export interface ContratParStatut {
  actif: number;
  termine: number;
  annule: number;
}

export interface BienPopulaire {
  bien_id: string;
  nom: string;
  reference: string;
  nb_contrats: number;
  revenus: number;
}

export interface PiecePopulaire {
  piece_id: string;
  nom: string;
  reference: string;
  quantite_totale: number;
  cout_total: number;
}

export interface InterventionTechnicien {
  technicien_id: string | null;
  nom: string;
  nb_interventions: number;
  cout_total: number;
  duree_moyenne: number; // heures
}

export interface StatistiquesInterventions {
  nb_total: number;
  cout_moyen: number;
  duree_moyenne_heures: number;
  duree_min_heures: number;
  duree_max_heures: number;
  ecart_type_heures: number;
}

export interface ClientActif {
  client_id: string;
  nb_contrats: number;
  total_depense: number;
}

export interface Synthese {
  revenus: RevenuParPeriode[];
  contrats: ContratParPeriode[];
  contrats_statut: ContratParStatut;
  taux_occupation: number;
  biens_populaires: BienPopulaire[];
  pieces_populaires: PiecePopulaire[];
  interventions_techniciens: InterventionTechnicien[];
  clients_actifs: number;
  statistiques_interventions: StatistiquesInterventions;
}