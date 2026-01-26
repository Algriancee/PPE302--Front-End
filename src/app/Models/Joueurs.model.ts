
import { User } from './User.model';
import { ProfilJoueur } from './ProfilJoueurs.model';

import { Media } from './Medias.model';

export interface Joueur  {
  id?: number;
  nom: string;
  prenoms: string;
  dateNaissance?: string; // format ISO (ex: '2000-05-10')
  poste?: string;
  taille?: number;
  poids?: number;
  nationalite?: string;
  adresse?: string;
  piedFort?: string;
  niveau?: string;
  profil?: ProfilJoueur;
  medias?: Media[];
  user?: { id: number };
}