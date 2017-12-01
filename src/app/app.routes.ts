import { Routes } from '@angular/router';

import {AppComponent} from "./app.component";

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'BDSM', component: AppComponent},
  {path: 'Accounting', component: AppComponent},
  {path: 'QA', component: AppComponent},
  {path: 'Embedded', component: AppComponent},
  {path: 'Web', component: AppComponent},
  {path: 'Mobile', component: AppComponent},
  {path: 'ZGames', component: AppComponent},
  {path: 'CrossDevice', component: AppComponent},
  {path: 'HR', component: AppComponent}
];
