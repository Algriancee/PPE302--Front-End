
import { Agent } from './Agents.model';

export interface Recherche {
  id?: number;
  critere: string;
  dateRecherche?: string;
  agents?: Agent;
}