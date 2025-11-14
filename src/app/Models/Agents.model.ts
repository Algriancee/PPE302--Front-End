import { User } from './User.model';
import { Recherche } from './Recherche.model';

export interface Agent extends User {
  nomAgence?: string;
  licence?: string;
  adresseAgence?: string;
  paysAgence?: string;
  recherches?: Recherche[];
}