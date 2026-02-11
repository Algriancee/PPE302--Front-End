import { Routes } from '@angular/router';
import { PageAccueilleComponent } from './dashboard/page-accueille/page-accueille.component';
import { PageAdminComponent } from './dashboard/page-admin/page-admin.component';
import { PageAgentsComponent } from './dashboard/page-agents/page-agents.component';
import { PageJoueursComponent } from './dashboard/page-joueurs/page-joueurs.component';
import { ConnexionComponent } from './authentification/connexion/connexion.component';
import { InscriptionComponent } from './authentification/inscription/inscription.component';
import { roleGuard } from './guards/role.guard';


export const routes: Routes = [

       { path: 'Accueille', component: PageAccueilleComponent },
    { path: 'Page-joueurs', component: PageJoueursComponent },
    { path: 'page-Agents', component: PageAgentsComponent },
    { path: 'Page-Admins', component: PageAdminComponent },
    { path: 'Connexion', component: ConnexionComponent },
    { path: 'Inscription', component: InscriptionComponent },


     



    
    /*
      {
        path: 'connexion', 
        loadComponent: () =>
          import('./authentification/connexion/connexion.component').then(
            (m) => m.ConnexionComponent
          ),
      },
      {
        path: 'inscription',
        loadComponent: () =>
          import('./authentification/inscription/inscription.component').then(
            (m) => m.InscriptionComponent
          ),
      },
      {
        path: 'Eleve-dashboard',
        loadComponent: () =>
          import('./dashboard/page-joueurs/page-joueurs.component').then(
            (m) => m.PageJoueursComponent
          ),
        canActivate: [roleGuard],
        data: { allowedRoles: ['JOUEURS'] },
      },
      {
        path: 'parent-dashboard',
        loadComponent: () =>
          import('./dashboard/page-agents/page-agents.component').then(
            (m) => m.PageAgentsComponent
          ),
        canActivate: [roleGuard],
        data: { allowedRoles: ['AGENTS'] },
      },
      {
        path: 'enseignant-dashboard',
        loadComponent: () =>
          import('./dashboard/page-admin/page-admin.component').then(
            (m) => m.PageAdminComponent 
          ),
        canActivate: [roleGuard],
        data: { allowedRoles: ['ADMIN'] },
      },*/
      
    ];





