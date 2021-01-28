import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { EqualPasswordsValidator } from 'src/app/shared/equal-passwords.validator';
import * as fromApp from '../../store/app.reducer';
import * as UserChangePasswordActions from './store/user-change-password.actions';
import { Router } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/shared/can-deactivate-guard.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, AfterViewInit, OnDestroy, CanDeactivateGuard {

  changePasswordForm: FormGroup;
  storeSub: Subscription;
  message: string;
  isLoading: boolean;

  constructor(private store: Store<fromApp.AppState>, private router: Router) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('userChangePassword').subscribe((userChangePasswordState) => {
      this.message = userChangePasswordState.responseMessage;
      this.isLoading = userChangePasswordState.loading;
    });
    this.changePasswordForm = new FormGroup({
      'currPassword': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'newPassword': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'repeatedPassword': new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  ngAfterViewInit(): void {
    this.changePasswordForm.get('repeatedPassword').setValidators([Validators.required, Validators.minLength(6), EqualPasswordsValidator.checkPasswords('newPassword')]);
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    if (this.message) {
      this.handleError();
    }
  }

  onSubmit() {
    this.store.dispatch(new UserChangePasswordActions.ChangePasswordStart(
      {
        oldPassword: this.changePasswordForm.get('currPassword').value,
        newPassword: this.changePasswordForm.get('newPassword').value
      }
    ));
    this.changePasswordForm.reset();
  }

  handleError() {
    this.store.dispatch(new UserChangePasswordActions.ClearMessage());
  }

  showPass(field) {
    field.type = "text";
  }

  hidePass(field) {
    field.type = "password";
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.changePasswordForm.dirty) {
      return confirm('Do you want to discard the changes you made and go back?');
    } else {
      return true;
    }
  }

}
