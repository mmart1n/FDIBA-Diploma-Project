import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { clear } from 'console';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenExpirationTimer: any;
  private tokenExpirationWarningTimer: any;
  public openWarningDialog = new EventEmitter<any>();

  constructor(private store: Store<fromApp.AppState>, private http: HttpClient) { }

  public setLogoutTimer(expiresIn: Date) {
    let expirationTime = expiresIn.getTime() - new Date().getTime();
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationTime);
    this.tokenExpirationWarningTimer = setTimeout(() => {
      this.openWarningDialog.emit();
    }, expirationTime - 120000);
  }

  public clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    if (this.tokenExpirationWarningTimer) {
      clearTimeout(this.tokenExpirationWarningTimer);
      this.tokenExpirationWarningTimer = null;
    }
  }

}

