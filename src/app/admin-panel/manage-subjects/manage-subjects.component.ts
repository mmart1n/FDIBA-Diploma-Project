import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { IgxGridComponent, OverlaySettings, CloseScrollStrategy, DefaultSortingStrategy, FilteringStrategy, IFilteringExpression, IgxToastComponent } from 'igniteui-angular';
import { combineLatest, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as  AdminManageSubjectsActions from './store/admin-manage-subjects.actions';
import { HandleTransactions } from 'src/app/shared/handle-transactions';

export class SimpleFilteringStrategy extends FilteringStrategy {
  constructor(private semesters: any, private specialties: any) {
    super();
  }

  public findMatchByExpression(rec: any, expr: IFilteringExpression): boolean {
    let cond = expr.condition;
    let val;
    if (expr.fieldName === "semesterId") {
      let semester = this.semesters.find(semester => semester.id === rec[expr.fieldName]);
      if (semester) {
        val = semester.name;
      }
    } else if (expr.fieldName === "specialtyId") {
      let specialty = this.specialties.find(specialty => specialty.id === rec[expr.fieldName])
      if (specialty) {
        val = specialty.name;
      }
    }
    else {
      val = rec[expr.fieldName];
    }
    return cond.logic(val, expr.searchVal, expr.ignoreCase);
  }
}

export class SemestersSortingStrategy extends DefaultSortingStrategy {
  constructor(private semesters: any[]) {
    super();
  }
  public compareValues(a: number, b: number): any {
    let semester1 = this.semesters.find(semester => semester.id === a);
    let semester2 = this.semesters.find(semester => semester.id === b);
    if (semester1 && semester2) {
      a = semester1.name.toLowerCase();
      b = semester2.name.toLowerCase();
    }
    return super.compareValues(a, b);
  }
}

export class SpecialtiesSortingStrategy extends DefaultSortingStrategy {
  constructor(private specialties: any[]) {
    super();
  }
  public compareValues(a: number, b: number): any {
    let specialty1 = this.specialties.find(specialty => specialty.id === a);
    let specialty2 = this.specialties.find(specialty => specialty.id === b);
    if (specialty1 && specialty2) {
      a = specialty1.name.toLowerCase();
      b = specialty2.name.toLowerCase();
    }
    return super.compareValues(a, b);
  }
}

@Component({
  selector: 'app-manage-subjects',
  templateUrl: './manage-subjects.component.html',
  styleUrls: ['./manage-subjects.component.scss']
})
export class ManageSubjectsComponent extends HandleTransactions implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("gridRowEditTransaction", { read: IgxGridComponent, static: true }) public grid: IgxGridComponent;
  @ViewChild("dialogGrid", { read: IgxGridComponent, static: true }) public dialogGrid: IgxGridComponent;
  @ViewChild("toast", { static: true }) public toast: IgxToastComponent;

  public data: any[];
  public semesters: any[];
  public specialties: any[];
  public lastID: number;
  public failedSubjects: any[] = [];
  public responseMessage: string;
  public connectionFailedMessage: string;
  public customOverlaySettings: OverlaySettings;
  private subscription: Subscription;

  public filteringStrategy: SimpleFilteringStrategy;
  public semestersSortingStrategy: SemestersSortingStrategy;
  public specialtiesSortingStrategy: SpecialtiesSortingStrategy;

  constructor(private store: Store<fromApp.AppState>) {
    super();
  }

  public ngOnInit(): void {
    this.transactionsData = this.grid.transactions.getAggregatedChanges(true);
    this.transactionsSubscription = this.grid.transactions.onStateUpdate.subscribe(() => {
      this.transactionsData = this.grid.transactions.getAggregatedChanges(true);
    });
    this.subscription = combineLatest(this.store.select('adminManageSpecialties'), this.store.select('adminManageStateAndSemesters'), this.store.select('adminManageSubjects'))
      .subscribe(([specialtiesState, semesterState, subjectState]) => {
        if (specialtiesState.connectionFailedError || semesterState.connectionFailedError || subjectState.connectionFailedError) {
          this.connectionFailedMessage = 'Connection to the backend has failed! Please reload the page and try again!';
          this.grid.isLoading = false;
          return;
        } else {
          this.grid.isLoading = semesterState.loading || specialtiesState.loading || subjectState.loading;
          this.connectionFailedMessage = null;
        }
        if (specialtiesState.specialties.length !== 0 && semesterState.semesters.length !== 0) {
          this.specialties = specialtiesState.specialties;
          this.semesters = semesterState.semesters;
          this.semestersSortingStrategy = new SemestersSortingStrategy(this.semesters); // DALI TAKA SE PRAVI
          this.specialtiesSortingStrategy = new SpecialtiesSortingStrategy(this.specialties); // DALI TAKA SE PRAVI
          this.filteringStrategy = new SimpleFilteringStrategy(this.semesters, this.specialties); // DALI TAKA SE PRAVI
          this.data = subjectState.subjects;
          this.failedSubjects = subjectState.failedSubjects;
          if (this.failedSubjects.length) {
            const arr = this.failedSubjects.reduce((a, b) => {
              a.push(b.name);
              return a;
            }, []);
            this.responseMessage = "The modifications for the following subjects have failed:<br>" + Array.from(arr).join('<br>');
          } else {
            this.responseMessage = null;
          }
          if (!this.data.length) {
            this.lastID = 0;
          } else {
            this.lastID = this.data[this.data.length - 1].id;
          }
        }
      });
  }

  public ngAfterViewInit(): void {
    this.customOverlaySettings = {
      scrollStrategy: new CloseScrollStrategy(this.grid.verticalScrollContainer.getScroll()),
      closeOnOutsideClick: true,
      modal: false
    };
  }

  public getNameById(collection: any[], id: number): string {
    return id ? collection.find(el => el.id === id).name : null;
  }

  public addRow(): void {
    this.grid.endEdit(false);
    this.grid.addRow({
      id: ++this.lastID,
      subjectName: '',
      zip: true,
      semesterId: null,
      specialtyId: null,
      course: 1,
      lectureHours: 0,
      labExerciseHours: 0,
      seminarHours: 0,
      courseProjectHours: 0,
      examinationHours: 0
    });
    this.grid.cdr.detectChanges();
    this.grid.navigateTo(this.grid.dataView.length - 1);
  }

  public handleTransactionsData(event: boolean): void {
    if (event) {
      this.store.dispatch(new AdminManageSubjectsActions.ManageSubjectsStart(this.transactionsData));
    }
    this.grid.transactions.clear();
  }

  public handleError(): void {
    this.store.dispatch(new AdminManageSubjectsActions.ClearMessage());
  }

  public getArrayFromSpecialtyCourses(id: number): number[] {
    if (id) {
      let specialty = this.specialties.find(el => el.id === id);
      return specialty ? Array.from({ length: specialty.coursesAmount }, (_, i) => i + 1) : null;
    }
    return null;
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
