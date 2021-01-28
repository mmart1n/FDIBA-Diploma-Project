import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { IgxGridComponent, IgxDialogComponent, IgxSwitchComponent, IgxToastComponent } from 'igniteui-angular';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { Semester } from 'src/app/models/semester.model';
import { CanDeactivateGuard } from 'src/app/shared/can-deactivate-guard.service';
import { HandleTransactions } from 'src/app/shared/handle-transactions';
import * as fromApp from '../../store/app.reducer';
import * as AdminManageStateAndSemestersActions from './store/admin-manage-state-and-semesters.actions';
import * as AdminManageHomePageActions from '../manage-home-page/store/admin-manage-home-page.actions';
@Component({
  selector: 'app-manage-semesters',
  templateUrl: './manage-state-and-semesters.component.html',
  styleUrls: ['./manage-state-and-semesters.component.scss']
})
export class ManageStateAndSemestersComponent extends HandleTransactions implements OnInit, OnDestroy, CanDeactivateGuard {

  @ViewChild("gridRowEditTransaction", { read: IgxGridComponent, static: true }) public grid: IgxGridComponent;
  @ViewChild('stateChangeDialog', { static: true }) public stateChangeDialog: IgxDialogComponent;
  @ViewChild('activeSemesterChangeDialog', { static: true }) public activeSemesterChangeDialog: IgxDialogComponent;
  @ViewChild('dialogGrid', { read: IgxGridComponent, static: true }) public dialogGrid: IgxGridComponent;
  @ViewChild("toast", { static: true }) public toast: IgxToastComponent;
  @ViewChild(IgxSwitchComponent, { static: true }) public switch: IgxSwitchComponent;

  public siteState = false;
  public activeSemesterId: number;
  public newActiveSemester: any;

  public data: any[];
  public lastID: number;
  public connectionFailedMessage: string;
  public responseMessage: string;
  public failedSemesters: Semester[];
  private subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>, private ref: ChangeDetectorRef) {
    super();
  }

  public ngOnInit(): void {
    this.transactionsData = this.grid.transactions.getAggregatedChanges(true);
    this.transactionsSubscription = this.grid.transactions.onStateUpdate.subscribe(() => {
      this.transactionsData = this.grid.transactions.getAggregatedChanges(true);
    });
    this.subscription = combineLatest(this.store.select('adminManageStateAndSemesters'), this.store.select('adminManageHomePage'))
      .subscribe(([semestersState, homePageState]) => {
        this.connectionFailedMessage = semestersState.connectionFailedError;
        this.data = semestersState.semesters;
        this.grid.isLoading = semestersState.loading;
        this.failedSemesters = semestersState.failedSemesters;
        this.siteState = homePageState.currentState.working;
        this.data.forEach(x => {
          if (x.active) {
            this.activeSemesterId = x.id;
            this.ref.detectChanges();
          }
        });
        if (this.failedSemesters.length) {
          const arr = this.failedSemesters.reduce((a, b) => {
            a.push(b.semesterName);
            return a;
          }, []);
          this.responseMessage = "The modifications for the following semesters have failed:<br>" + Array.from(arr).join('<br>');
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

  public removeSorting(event): void {
    this.grid.columns.forEach(col => {
      if (!(col.field === event.fieldName)) {
        if (col.field) {
          this.grid.clearSort(col.field);
        }
      }
    });
  }

  public handleSelection(event): void {
    this.newActiveSemester = this.data.find(x => x.id === event.newSelection.value);
    event.cancel = true;
    this.activeSemesterChangeDialog.open();
  }

  public onStateConfirmationCanceled(): void {
    this.switch.checked = this.siteState;
    this.stateChangeDialog.close();
  }

  public onStateConfirmationAccepted(): void {
    this.stateChangeDialog.close();
    this.store.dispatch(new AdminManageHomePageActions.ChangeSiteStateStart(!this.siteState));
  }

  public onSemesterConfirmationCanceled(): void {
    this.activeSemesterChangeDialog.close();
  }

  public onSemesterConfirmationAccepted() {
    let confirmationStatus = confirm('Do you want to delete all current assignments and to change the current active semester?');
    if (confirmationStatus) {
      this.store.dispatch(new AdminManageStateAndSemestersActions.ChangeActiveSemesterStart(this.newActiveSemester.id));
      this.activeSemesterChangeDialog.close();
      this.store.dispatch(new AdminManageStateAndSemestersActions.FetchSemestersStart());
    }
  }

  public handleError(): void {
    this.store.dispatch(new AdminManageStateAndSemestersActions.ClearMessage());
  }

  public addRow(): void {
    this.grid.endEdit(false);
    this.grid.addRow({
      id: this.lastID++,
      name: '',
      semesterPeriod: '',
      active: false
    });
    this.grid.cdr.detectChanges();
    this.grid.navigateTo(this.grid.dataView.length - 1);
  }

  public handleTransactionsData(event: boolean): void {
    if (event) {
      this.store.dispatch(new AdminManageStateAndSemestersActions.ManageSemestersStart(this.transactionsData));
    }
    this.grid.transactions.clear();
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

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.hasTransactions || this.activeSemesterChangeDialog.state === 'open' || this.stateChangeDialog.state === 'open') {
      return confirm('Do you want to discard the changes you made and go back?');
    } else {
      return true;
    }
  }

}
