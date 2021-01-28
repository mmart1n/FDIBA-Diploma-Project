import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AuthAndStateGuard } from './auth/authAndState.guard';
import { NotAuthGuard } from './auth/not-auth.guard';
import { RoleGuard } from './auth/role.guard';
import { HomePageResolverService } from './home/home-page.resolver.service';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    resolve: [HomePageResolverService],
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'assignments',
    canActivate: [AuthAndStateGuard],
    resolve: [HomePageResolverService],
    loadChildren: () =>
      import('./assignments/assignments.module').then((m) => m.AssignmentsModule),
  },
  {
    path: 'preview-assignments',
    canActivate: [AuthAndStateGuard],
    resolve: [HomePageResolverService],
    loadChildren: () =>
      import('./preview-assignments/preview-assignments.module').then((m) => m.PreviewAssignmentsModule),
  },
  {
    path: 'user-panel',
    canActivate: [AuthGuard],
    resolve: [HomePageResolverService],
    loadChildren: () =>
      import('./user-panel/user-panel.module').then((m) => m.UserPanelModule),
  },
  {
    path: 'admin-panel',
    canActivate: [RoleGuard],
    resolve: [HomePageResolverService],
    data: {
      admin: true
    },
    loadChildren: () =>
      import('./admin-panel/admin-panel.module').then((m) => m.AdminPanelModule),
  },
  {
    path: 'sign-in',
    canActivate: [NotAuthGuard],
    resolve: [HomePageResolverService],
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
  },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled', relativeLinkResolution: 'legacy' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
