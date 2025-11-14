
import { User } from './User.model';
import { ProfilJoueur } from './ProfilJoueurs.model';

import { Media } from './Medias.model';

export interface Joueur extends User {
  dateNaissance?: string; // format ISO (ex: '2000-05-10')
  poste?: string;
  taille?: number;
  poids?: number;
  nationalite?: string;
  adresse?: string;
  piedFort?: string;
  niveau?: string;
  profil?: ProfilJoueur[];
  medias?: Media[];
}