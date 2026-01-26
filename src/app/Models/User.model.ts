import { Agent } from "./Agents.model";
import { Joueur } from "./Joueurs.model";

export interface User {
  id?: number;
  nomUtilisaeur: string;
  email: string;
  password?: string;
  telephone: string;
  dateInscription?: string; // ISO date string
  status?: 'ONLINE' |'OFFLINE'; // ou enum si tu veux
  role: 'JOUEURS' | 'AGENTS' |'ADMIN'|'USER';
  joueur?: Joueur;
  Agents?: Agent;
}