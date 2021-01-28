import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  private semesterSub: Subscription;
  public siteState: boolean;
  public isAuthenticated = false;
  public isAdmin = false;
  public activeSemester: any;
  public collapsed = true;

  constructor(private store: Store<fromApp.AppState>) { }

  public ngOnInit(): void {
    this.userSub = this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = !user ? false : true;
        this.isAdmin = !user ? false : user.isAdmin;
      });

    this.semesterSub = combineLatest(this.store.select('adminManageStateAndSemesters'), this.store.select('adminManageHomePage'))
      .subscribe(([stateAndSemestersState, homePageState]) => {
        if (stateAndSemestersState.semesters.length) {
          this.activeSemester = stateAndSemestersState.semesters.find(x => x.active === true);
        }
        this.siteState = this.activeSemester ? homePageState.currentState.working : false;
      });
  }

  public ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.semesterSub) {
      this.semesterSub.unsubscribe();
    }
  }

  public onLogout(): void {
    this.store.dispatch(new AuthActions.Logout());
  }

  public collapseHeader(): void {
    this.collapsed = true;
  }

}
