/**
 * Représente un employé (technicien, commercial, etc.)
 */
export interface Employe {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  date_embauche: string; // format ISO YYYY-MM-DD
  taux_horaire: number;
  poste: string;
  est_actif: boolean;
  role_id?: string | null;
}

export type EmployeCreation = Omit<Employe, 'id' | 'est_actif' | 'role_id'>;

export interface Pointage {
  id: string;
  employe_id: string;
  horodatage: string; // ISO datetime
  type: 'ENTRY' | 'EXIT';
  commentaire: string;
}

export type PointageCreation = Omit<Pointage, 'id'>;