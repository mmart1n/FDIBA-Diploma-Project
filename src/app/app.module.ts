import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxGridModule, IgxSelectModule, IgxDialogModule } from 'igniteui-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/store/auth.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import * as fromApp from './store/app.reducer';
import { TokenInterceptorService } from './token-interceptor.service';
import { environment } from 'src/environments/environment';
import { AppService } from './app.service';
import { UserAssignmentsEffects } from './user-panel/user-assignments/store/user-assignments.effects';
import { AdminManageUsersEffects } from './admin-panel/manage-users/store/admin-manage-users.effects';
import { UserChangePasswordEffects } from './user-panel/change-password/store/user-change-password.effects';
import { AdminManageSpecialtiesEffects } from './admin-panel/manage-specialties/store/admin-manage-specialties.effects';
import { AdminManageStateAndSemestersEffects } from './admin-panel/manage-state-and-semesters/store/admin-manage-state-and-semesters.effects';
import { AdminManageAssignmentsEffects } from './admin-panel/manage-assignments/store/admin-manage-assignments.effects';
import { AdminManageSubjectsEffects } from './admin-panel/manage-subjects/store/admin-manage-subjects.effects';
import { AdminManageHomePageEffects } from './admin-panel/manage-home-page/store/admin-manage-home-page.effects';
import { LogoutWarningComponent } from './logout-warning/logout-warning.component';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
import { FooterComponent } from './footer/footer.component';

export function initAppService(appService: AppService) {
  return () => appService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LogoutWarningComponent,
    ScrollTopComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    NgbModule,
    HammerModule,
    IgxGridModule,
    IgxSelectModule,
    IgxDialogModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects, UserChangePasswordEffects, UserAssignmentsEffects, AdminManageUsersEffects, AdminManageHomePageEffects,
      AdminManageSpecialtiesEffects, AdminManageStateAndSemestersEffects, AdminManageAssignmentsEffects,
      AdminManageSubjectsEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true,
  }, {
    provide: APP_INITIALIZER,
    useFactory: initAppService,
    deps: [AppService],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}

