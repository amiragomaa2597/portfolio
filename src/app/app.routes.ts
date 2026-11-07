import { Routes } from '@angular/router';
import { siteGateGuard } from './auth/site-gate.guard';
import { AtsPage } from './pages/ats/ats';
import { EditPage } from './pages/edit/edit';
import { GatePage } from './pages/gate/gate';
import { HomePage } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'gate', component: GatePage },
  { path: 'edit', component: EditPage, canActivate: [siteGateGuard] },
  { path: 'ats', component: AtsPage, canActivate: [siteGateGuard] },
];
