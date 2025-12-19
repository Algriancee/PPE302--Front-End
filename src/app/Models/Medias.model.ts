
import { Joueur } from './Joueurs.model';

export interface Media {
  id?: number;
  type: string; // VIDEO, CV, etc.
  url: string;
  description?: string;
  dateUpload?: string; // ISO date string
  joueur?: { id: number };
}