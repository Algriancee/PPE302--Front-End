
export interface User {
  id?: number;
  nom: string;
  prenoms: string;
  email: string;
  password?: string;
  telephone: string;
  dateInscription?: string; // ISO date string
  status?: 'ONLINE' |'OFFLINE'; // ou enum si tu veux
  role: 'JOUEURS' | 'AGENTS' |'ADMIN'|'USER';
}