import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserPanelComponent } from './user-panel.component';
import { UserAssignmentsComponent } from './user-assignments/user-assignments.component';
import { CanDeactivateGuard } from '../shared/can-deactivate-guard.service';
import { AuthAndStateGuard } from '../auth/authAndState.guard';
import { UserAssignmentsResolverService } from './user-assignments/user-assignments.resolver.service';

const routes: Routes = [
  {
    path: '',
    component: UserPanelComponent,
    children: [
      { path: '', redirectTo: 'change-password' },
      { path: 'my-assignments', component: UserAssignmentsComponent, resolve: [UserAssignmentsResolverService], canActivate: [AuthAndStateGuard], canDeactivate: [CanDeactivateGuard] },
      { path: 'change-password', component: ChangePasswordComponent, canDeactivate: [CanDeactivateGuard] },
      //   {
      //     path: ':id',
      //     component: RecipeDetailComponent,
      //     resolve: [RecipeResolverService],
      //   },
      //   {
      //     path: ':id/edit',
      //     component: RecipeEditComponent,
      //     resolve: [RecipeResolverService],
      //   },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPanelRoutingModule { }
