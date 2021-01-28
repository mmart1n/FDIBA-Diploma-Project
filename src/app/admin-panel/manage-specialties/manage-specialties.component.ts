import { Component, OnInit, ViewChild } from '@angular/core';
import { IgxGridComponent, IgxToastComponent } from 'igniteui-angular';
import { Observable, Subscription } from 'rxjs';
import { Specialty } from 'src/app/models/specialty.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AdminManageSpecialtiesActions from './store/admin-manage-specialties.actions';
import { HandleTransactions } from 'src/app/shared/handle-transactions';


@Component({
  selector: 'app-manage-specialties',
  templateUrl: './manage-specialties.component.html',
  styleUrls: ['./manage-specialties.component.scss']
})
export class ManageSpecialtiesComponent extends HandleTransactions implements OnInit {
  @ViewChild("gridRowEditTransaction", { read: IgxGridComponent, static: true }) public grid: IgxGridComponent;
  @ViewChild("dialogGrid", { read: IgxGridComponent, static: true }) public dialogGrid: IgxGridComponent;
  @ViewChild("toast", { static: true }) public toast: IgxToastComponent;

  public data: any[];
  public responseMessage: string;
  public connectionFailedMessage: string
  public failedSpecialties: Specialty[];
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
    this.subscription = this.store.select('adminManageSpecialties').subscribe((specialtiesState) => {
      this.connectionFailedMessage = specialtiesState.connectionFailedError;
      this.data = specialtiesState.specialties;
      this.grid.isLoading = specialtiesState.loading;
      this.failedSpecialties = specialtiesState.failedSpecialties;
      if (this.failedSpecialties.length) {
        const arr = this.failedSpecialties.reduce((a, b) => {
          a.push(b.specialtyName);
          return a;
        }, []);
        this.responseMessage = "The modifications for the following specialties have failed:<br>" + Array.from(arr).join('<br>');
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

  public handleError(): void {
    this.store.dispatch(new AdminManageSpecialtiesActions.ClearMessage());
  }

  public addRow(): void {
    this.grid.endEdit(false);
    this.grid.addRow({
      id: this.lastID++,
      name: '',
      bachelor: true,
      coursesAmount: 4,
    });
    this.grid.cdr.detectChanges();
    this.grid.navigateTo(this.grid.dataView.length - 1);
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

  public handleTransactionsData(event: boolean): void {
    if (event) {
      this.store.dispatch(new AdminManageSpecialtiesActions.ManageSpecialtiesStart(this.transactionsData));
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

}
