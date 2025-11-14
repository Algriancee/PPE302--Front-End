
export interface RegisterRequest {
  //id?: number;
  nom: string;
  prenoms: string;
  email: string;
  password?: string;
  telephone: string;
  dateInscription?: string; // ISO date string
  //status?: 'ONLINE' |'OFFLINE'; // ou enum si tu veux
  role: string  //'JOUEURS' | 'AGENTS' |'ADMIN'|'USER';
}