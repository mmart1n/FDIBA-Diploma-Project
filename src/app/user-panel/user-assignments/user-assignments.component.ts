import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Store } from '@ngrx/store';
import { IgxGridComponent, IgxToastComponent } from "igniteui-angular";
import { Subscription } from 'rxjs';
import { CanDeactivateGuard } from 'src/app/shared/can-deactivate-guard.service';
import { HandleTransactions } from "src/app/shared/handle-transactions";
import * as fromApp from '../../store/app.reducer';
import * as ManageUsersActions from './store/user-assignments.actions';

@Component({
  selector: 'app-user-assignments',
  templateUrl: './user-assignments.component.html',
  styleUrls: ['./user-assignments.component.scss']
})
export class UserAssignmentsComponent extends HandleTransactions implements OnInit, OnDestroy, CanDeactivateGuard {

  @ViewChild("gridRowEditTransaction", { read: IgxGridComponent, static: true }) public grid: IgxGridComponent;
  @ViewChild("dialogGrid", { read: IgxGridComponent, static: true }) public dialogGrid: IgxGridComponent;
  @ViewChild("toast", { static: true }) public toast: IgxToastComponent;

  public assignments: any[] = [];
  public responseMessage: string;
  public connectionFailedMessage: string
  public failedAssignments: any[];
  public lastID: number;
  public subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {
    super();
  }

  public ngOnInit(): void {
    this.transactionsData = this.grid.transactions.getAggregatedChanges(true);
    this.transactionsSubscription = this.grid.transactions.onStateUpdate.subscribe(() => {
      this.transactionsData = this.grid.transactions.getAggregatedChanges(true);
    });
    this.subscription = this.store.select('userAssignments').subscribe((userAssignmentsState) => {
      this.connectionFailedMessage = userAssignmentsState.connectionFailedError;
      debugger;
      let data = userAssignmentsState.assignments;
      if (data.length) {
        this.mapData(data);
      } else {
        this.assignments = [];
      }
      this.grid.isLoading = userAssignmentsState.loading;
      this.failedAssignments = userAssignmentsState.failedAssignments;
      if (this.failedAssignments.length) {
        this.responseMessage = "The modifications for the following subjects have failed:<br>" + Array.from(this.failedAssignments.map(ass => ass.subject.name)).join('<br>');
      } else {
        this.responseMessage = null;
      }
      if (this.assignments.length) {
        this.lastID = +this.assignments[this.assignments.length - 1].id + 1;
      } else {
        this.lastID = 100000000;
      }
    });
  }

  public mapData(data: any[]) {
    this.assignments = [];
    data.forEach((assignment) => {
      assignment = {
        ...assignment,
        specialty: assignment.subject.specialty.name,
        course: assignment.subject.studyYear,
        bachelor: assignment.subject.specialty.bachelor,
        subjectName: assignment.subject.name
      };
      this.assignments.push(assignment);
    });
  }

  public removeSorting(event) {
    this.grid.columns.forEach(col => {
      if (!(col.field === event.fieldName)) {
        if (col.field) {
          this.grid.clearSort(col.field);
        }
      }
    });
  }

  public handleTransactionsData(event: boolean): void {
    if (event) {
      this.transactionsData.map((transaction) => {
        delete transaction.newValue.subjectName;
        delete transaction.newValue.bachelor;
        delete transaction.newValue.course;
        delete transaction.newValue.specialty;
        transaction.newValue.userId = transaction.newValue.user.id;
        transaction.newValue.subjectId = transaction.newValue.subject.id;
        delete transaction.newValue.user;
        delete transaction.newValue.subject;
      });
      this.store.dispatch(new ManageUsersActions.ManageUserAssignmentsStart(this.transactionsData));
    }
    this.grid.transactions.clear();
  }

  public handleError(): void {
    this.store.dispatch(new ManageUsersActions.ClearMessage());
  }

  public ngOnDestroy(): void {
    if (this.responseMessage || this.connectionFailedMessage) {
      this.handleError();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.transactionsSubscription) {
      this.transactionsSubscription.unsubscribe();
    }
  }

}
