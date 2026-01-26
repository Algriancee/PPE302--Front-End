import { User } from './User.model';
import { Recherche } from './Recherche.model';

export interface Agent {
  id?: number;
  nom: string;
  prenoms: string;
  nomAgence?: string;
  licence?: string;
  adresseAgence?: string;
  paysAgence?: string;
  //recherches?: Recherche[];
  user?: { id: number };
}