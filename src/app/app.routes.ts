import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  // ESTA ES LA RUTA QUE HACE QUE EL CLIC FUNCIONE:
  {
    path: 'detail/:id',
    loadComponent: () => import('./pages/detail/detail.page').then( m => m.DetailPage)
  },
];
