import { Routes } from '@angular/router';
import { AtsPage } from './pages/ats/ats';
import { EditPage } from './pages/edit/edit';
import { HomePage } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'edit', component: EditPage },
  { path: 'ats', component: AtsPage },
];
