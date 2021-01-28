import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, skipWhile, take } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class AuthAndStateGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return combineLatest(this.store.select('auth'), this.store.select('adminManageHomePage')).pipe(
      skipWhile(([authState, homePageState]) => authState.loading || homePageState.loading),
      take(1),
      map(([authState, homePageState]) => {
        return [authState.user, homePageState.currentState.working];
      }),
      map((userAndState) => {
        const isAuth = !!userAndState[0];
        if (isAuth && userAndState[1]) {
          return true;
        }
        return this.router.createUrlTree(['/sign-in']);
      })
    );
  }
}
