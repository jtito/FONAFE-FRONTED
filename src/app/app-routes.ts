import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './theme/auth/auth.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'pages'
      },
      {
        path: 'pages',
        loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
      }
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'pages'
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutes { }
