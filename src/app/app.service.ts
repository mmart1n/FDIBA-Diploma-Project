import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';
import * as AdminManageStateAndSemestersActions from './admin-panel/manage-state-and-semesters/store/admin-manage-state-and-semesters.actions';
import * as AdminManageHomePageActions from './admin-panel/manage-home-page/store/admin-manage-home-page.actions';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(private store: Store<fromApp.AppState>) { }

  init() {
    this.store.dispatch(new AuthActions.AutoLogin());
    this.store.dispatch(new AdminManageHomePageActions.FetchSiteStateStart());
    this.store.dispatch(new AdminManageStateAndSemestersActions.FetchSemestersStart());
  }
}
