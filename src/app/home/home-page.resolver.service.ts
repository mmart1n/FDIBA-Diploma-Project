import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AdminManageHomePageActions from '../admin-panel/manage-home-page/store/admin-manage-home-page.actions';
import * as AdminManageStateAndSemestersActions from '../admin-panel/manage-state-and-semesters/store/admin-manage-state-and-semesters.actions';
import { Actions } from '@ngrx/effects';

@Injectable({ providedIn: 'root' })
export class HomePageResolverService implements Resolve<any> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.store.dispatch(new AdminManageHomePageActions.FetchSiteStateStart());
    this.store.dispatch(new AdminManageStateAndSemestersActions.FetchSemestersStart());
    return true;
  }
}
