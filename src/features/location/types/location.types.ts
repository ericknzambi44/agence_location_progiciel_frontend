export interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  est_actif: boolean;
}

export type ClientCreation = Omit<Client, 'id' | 'est_actif'>;

export interface Contrat {
  id: string;
  client_id: string;
  bien_id: string;
  date_debut: string;
  date_fin: string;
  montant_total: number;
  statut: 'actif' | 'termine' | 'annule';
}

export type ContratCreation = Omit<Contrat, 'id' | 'statut' | 'montant_total'>;