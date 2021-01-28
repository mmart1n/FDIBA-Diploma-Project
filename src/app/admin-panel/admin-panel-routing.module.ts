import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageStateAndSemestersComponent } from './manage-state-and-semesters/manage-state-and-semesters.component';
import { ManageSpecialtiesComponent } from './manage-specialties/manage-specialties.component';
import { ManageSubjectsComponent } from './manage-subjects/manage-subjects.component';
import { ManageAssignmentsComponent } from './manage-assignments/manage-assignments.component';
import { ManageUsersResolverService } from './manage-users/manage-users.resolver.service';
import { ManageSpecialtiesResolverService } from './manage-specialties/manage-specialties.resolver.service';
import { ManageStateAndSemestersResolverService } from './manage-state-and-semesters/manage-state-and-semesters.resolver.service';
import { ManageAssignmentsResolverService } from './manage-assignments/manage-assignments.resolver.service';
import { ManageSubjectsResolverService } from './manage-subjects/manage-subjects.resolver.service';
import { CanDeactivateGuard } from '../shared/can-deactivate-guard.service';
import { ManageHomePageResolverService } from './manage-home-page/manage-home-page.resolver.service';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    children: [
      { path: '', redirectTo: 'manage-assignments' },
      { path: 'manage-assignments', component: ManageAssignmentsComponent, resolve: [ManageAssignmentsResolverService], canDeactivate: [CanDeactivateGuard] },
      { path: 'manage-state-and-semesters', component: ManageStateAndSemestersComponent, resolve: [ManageStateAndSemestersResolverService], canDeactivate: [CanDeactivateGuard] },
      { path: 'manage-specialties', component: ManageSpecialtiesComponent, resolve: [ManageSpecialtiesResolverService], canDeactivate: [CanDeactivateGuard] },
      { path: 'manage-subjects', component: ManageSubjectsComponent, resolve: [ManageSubjectsResolverService], canDeactivate: [CanDeactivateGuard] },
      { path: 'manage-users', component: ManageUsersComponent, resolve: [ManageUsersResolverService], canDeactivate: [CanDeactivateGuard] },
      {
        path: 'manage-home-page',
        resolve: [ManageHomePageResolverService],
        loadChildren: () =>
          import('./manage-home-page/manage-home-page.module').then((m) => m.ManageHomePageModule),
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelRoutingModule { }
