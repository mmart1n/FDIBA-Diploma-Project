import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  signInForm: FormGroup;
  resetPasswordForm: FormGroup;
  isLoading: boolean;
  storeSub: Subscription;
  message: string;

  constructor(private store: Store<fromApp.AppState>, private authService: AuthService) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe((authState) => {
      this.isLoading = authState.loading;
      this.message = authState.responseMessage;
    });
    this.signInForm = new FormGroup({
      'userEmail': new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
      'userPassword': new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
    this.resetPasswordForm = new FormGroup({
      'userEmail': new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
    });
  }

  onSignin(): void {
    this.isLoading = true;
    this.store.dispatch(new AuthActions.LoginStart(
      { username: this.signInForm.get('userEmail').value, password: this.signInForm.get('userPassword').value })
    );
  }

  onResetPassword(alert): void {
    this.store.dispatch(new AuthActions.ResetPasswordStart(this.resetPasswordForm.get('userEmail').value));
    this.onCloseDialog(alert);
  }

  onCloseDialog(alert): void {
    alert.close();
    this.resetPasswordForm.reset();
  }

  handleError(): void {
    this.store.dispatch(new AuthActions.ClearMessage());
  }

  showPass(field): void {
    field.type = "text";
  }

  hidePass(field): void {
    field.type = "password";
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
    if (this.message) {
      this.handleError();
    }
  }

}
