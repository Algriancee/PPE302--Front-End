
import { Joueur } from './Joueurs.model';

export interface ProfilJoueur {
  id?: number;
  biographie?: string;
  parcours?: string;
  palmares?: string;
  joueur?: Joueur;
}