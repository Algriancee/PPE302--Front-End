import { Routes } from '@angular/router';
import { PageAccueilleComponent } from './dashboard/page-accueille/page-accueille.component';
import { PageAdminComponent } from './dashboard/page-admin/page-admin.component';
import { PageAgentsComponent } from './dashboard/page-agents/page-agents.component';
import { PageJoueursComponent } from './dashboard/page-joueurs/page-joueurs.component';
import { ConnexionComponent } from './authentification/connexion/connexion.component';
import { InscriptionComponent } from './authentification/inscription/inscription.component';


export const routes: Routes = [

    { path: 'Accueille', component: PageAccueilleComponent },
    { path: 'Page-joueurs', component: PageJoueursComponent },
    { path: 'page-Agents', component: PageAgentsComponent },
    { path: 'Page-Admins', component: PageAdminComponent },
    { path: 'Connexion', component: ConnexionComponent },
    { path: 'Inscription', component: InscriptionComponent },
];


