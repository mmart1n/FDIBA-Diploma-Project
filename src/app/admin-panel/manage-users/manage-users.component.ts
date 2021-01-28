import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { IgxGridComponent, IgxDialogComponent, IgxToastComponent, IGridEditEventArgs } from 'igniteui-angular';
import * as fromApp from '../../store/app.reducer';
import * as AdminManageUsersActions from './store/admin-manage-users.actions';
import { User } from 'src/app/models/user.model';
import { combineLatest, Subscription } from 'rxjs';
import { HandleTransactions } from 'src/app/shared/handle-transactions';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent extends HandleTransactions implements OnInit, OnDestroy {
  @ViewChild("gridRowEditTransaction", { read: IgxGridComponent, static: true }) public grid: IgxGridComponent;
  @ViewChild("toast", { static: true }) public toast: IgxToastComponent;
  @ViewChild(IgxDialogComponent, { static: true }) public dialog: IgxDialogComponent;

  public data: any[];
  public responseMessage: string;
  public connectionFailedMessage: string
  public failedUsers: User[];
  public adminId: number;
  public lastID: number;
  private subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {
    super();
  }

  public ngOnInit(): void {
    this.transactionsData = this.grid.transactions.getAggregatedChanges(true);
    this.transactionsSubscription = this.grid.transactions.onStateUpdate.subscribe(() => {
      this.transactionsData = this.grid.transactions.getAggregatedChanges(true);
    });
    this.subscription = combineLatest(this.store.select('adminManageUsers'), this.store.select('auth')).subscribe(([usersState, authState]) => {
      this.adminId = authState.user.userId;
      this.connectionFailedMessage = usersState.connectionFailedError;
      this.data = usersState.users;
      this.grid.isLoading = usersState.loading;
      this.failedUsers = usersState.failedUsers;
      if (this.failedUsers.length) {
        const arr = this.failedUsers.reduce((a, b) => {
          a.push(b.username);
          return a;
        }, []);
        this.responseMessage = "The modifications for the following users have failed:<br>" + Array.from(arr).join('<br>');
      } else {
        this.responseMessage = null;
      }
      if (this.data.length) {
        this.lastID = +this.data[this.data.length - 1].id + 1;
      } else {
        this.lastID = 100000000;
      }
    });
  }

  public onRowEditDone(ev: IGridEditEventArgs): void {
    if (ev.newValue) {
      // Check if the row has empty or invalid fields
      let res = false;
      if (Object.values(ev.newValue).some(o => o === null || o === undefined || o === '' || o < 0)) {
        res = true;
      }
      if (res) {
        this.showToast('Invalid! The record contains an empty field or negative number!', ev);
        return;
      }
      // Check if there is already an existing assignment with the same user and subject
      let modifiedData = this.getAggregatedData();
      modifiedData = modifiedData.filter((x: any) => {
        return x.username === ev.newValue.username
      });
      if (modifiedData.length > 0) {
        if (modifiedData[0].id !== ev.newValue.id) {
          this.showToast('A user registered with the same EMail already exists!', ev);
        }
      }
    }
  }

  public handleError(): void {
    this.store.dispatch(new AdminManageUsersActions.ClearMessage());
  }

  public addRow(): void {
    this.grid.endEdit(false);
    this.grid.addRow({
      id: this.lastID++,
      username: null,
      firstName: null,
      middleName: null,
      lastName: null,
      isAdmin: false
    });
    this.grid.cdr.detectChanges();
    this.grid.navigateTo(this.grid.dataView.length - 1);
  }

  public handleTransactionsData(event: boolean): void {
    if (event) {
      this.store.dispatch(new AdminManageUsersActions.ManageUsersStart(this.transactionsData));
    }
    this.grid.transactions.clear();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.transactionsSubscription) {
      this.transactionsSubscription.unsubscribe();
    }
    if (this.responseMessage || this.failedUsers.length) {
      this.handleError();
    }
  }

}
