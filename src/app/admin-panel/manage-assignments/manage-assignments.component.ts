import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { IgxGridComponent, OverlaySettings, CloseScrollStrategy, IgxColumnComponent, IgxGridCellComponent, IgxToastComponent, IGridEditEventArgs } from 'igniteui-angular';
import { combineLatest, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as  AdminManageAssignmentsActions from './store/admin-manage-assignments.actions';
import * as AssignmentsSortingAndFilteringStrategies from './assignments-sorting-filtering-strategies';
import { HandleTransactions } from 'src/app/shared/handle-transactions';
import { Subject } from 'src/app/models/subject.model';

@Component({
  selector: 'app-manage-assignments',
  templateUrl: './manage-assignments.component.html',
  styleUrls: ['./manage-assignments.component.scss']
})
export class ManageAssignmentsComponent extends HandleTransactions implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("gridRowEditTransaction", { read: IgxGridComponent, static: true }) public grid: IgxGridComponent;
  @ViewChild("subjectsGrid", { read: IgxGridComponent, static: true }) public subjectsGrid: IgxGridComponent;
  @ViewChild("toast", { static: true }) public toast: IgxToastComponent;

  public allAssignments: any[];
  public allSpecialties: any[];
  public allSubjects: any[];
  public allUsers: any[];
  public failedAssignments: any[] = [];
  public responseMessage: string;
  public connectionFailedMessage: string;

  private activeSemester;
  private _selectedSpecialtySubjects: Subject[];
  public subjectsWithNotAllocatedHours: any[];

  public data: any[];
  public lastID: number;
  public customOverlaySettings: OverlaySettings;

  public filteringStrategy: AssignmentsSortingAndFilteringStrategies.SimpleFilteringStrategy;
  public subjectsSortingStrategy: AssignmentsSortingAndFilteringStrategies.SubjectsSortingStrategy;
  public specialtiesSortingStrategy: AssignmentsSortingAndFilteringStrategies.SpecialtiesSortingStrategy;
  public usersSortingStrategy: AssignmentsSortingAndFilteringStrategies.UsersSortingStrategy;

  private subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>, private ref: ChangeDetectorRef) {
    super();
  }

  public ngOnInit(): void {
    this.transactionsData = this.grid.transactions.getAggregatedChanges(true);
    this.transactionsSubscription = this.grid.transactions.onStateUpdate.subscribe(() => {
      this.transactionsData = this.grid.transactions.getAggregatedChanges(true);
    });
    this.subscription = combineLatest(this.store.select('adminManageStateAndSemesters'), this.store.select('adminManageAssignments'), this.store.select('adminManageSpecialties'), this.store.select('adminManageSubjects'), this.store.select('adminManageUsers'))
      .subscribe(([semestersState, assignmentsState, specialtiesState, subjectState, usersState]) => {
        if (semestersState.connectionFailedError || assignmentsState.connectionFailedError || specialtiesState.connectionFailedError || subjectState.connectionFailedError || usersState.connectionFailedError) {
          this.connectionFailedMessage = 'Connection to the backend has failed! Please reload the page and try again!';
          this.grid.isLoading = false;
          this.subjectsGrid.isLoading = this.grid.isLoading;
          this.data = [];
          return;
        } else {
          this.grid.isLoading = semestersState.loading || assignmentsState.loading || specialtiesState.loading || subjectState.loading || usersState.loading;
          this.subjectsGrid.isLoading = this.grid.isLoading;
          this.connectionFailedMessage = null;
        }
        if (semestersState.semesters.length !== 0 && specialtiesState.specialties.length !== 0 && subjectState.subjects.length !== 0 && usersState.users.length !== 0) {
          this.allSpecialties = specialtiesState.specialties;
          this.allUsers = usersState.users;
          this.allSubjects = subjectState.subjects;
          this.activeSemester = semestersState.semesters.find(x => x.active === true);
          this.subjectsWithNotAllocatedHours = this.allSubjects.filter(subject => subject.semesterId === this.activeSemester.id &&
            (subject.remainingLectureHours > 0 ||
              subject.remainingLabExerciseHours > 0 ||
              subject.remainingSeminarHours > 0 ||
              subject.remainingCourseProjectHours > 0 ||
              subject.remainingExaminationHours > 0));
          this.allAssignments = assignmentsState.assignments;
          this.failedAssignments = assignmentsState.failedAssignments;
          if (this.allAssignments.length) {
            this.initializeGrid();
          } else {
            this.data = [];
          }
          if (!this.data.length) {
            this.lastID = 0;
          } else {
            this.lastID = this.data[this.data.length - 1].assignmentId;
          }
          if (this.failedAssignments.length) {
            const arr = this.failedAssignments.reduce((a, b) => {
              let user = this.allUsers.find((u) => u.id === b.user.id);
              let subject = this.allSubjects.find((sub) => sub.id === b.subject.id);
              a.push(subject.subjectName + ' - ' + user.firstName + ' ' + user.lastName);
              return a;
            }, []);
            this.responseMessage = "The modifications for the following assignments have failed:<br>" + Array.from(arr).join('<br>');
          } else {
            this.responseMessage = null;
          }
        }
      });
  }

  public ngAfterViewInit(): void {
    this.customOverlaySettings = {
      scrollStrategy: new CloseScrollStrategy(this.grid.verticalScrollContainer.getScroll()),
      closeOnOutsideClick: true,
      modal: false,
    };
  }

  public initializeGrid(): void {
    this.data = [];
    this.allAssignments.forEach((assignment) => {
      let subject = this.allSubjects.find(subject => subject.id === assignment.subjectId);
      assignment = {
        ...assignment,
        specialtyId: subject && subject.specialtyId ? subject.specialtyId : null,
        course: subject && subject.course ? subject.course : null
      }
      this.data.push(assignment);
    });
    this.specialtiesSortingStrategy = new AssignmentsSortingAndFilteringStrategies.SpecialtiesSortingStrategy(this.allSubjects, this.allSpecialties); // DALI TAKA SE PRAVI
    this.usersSortingStrategy = new AssignmentsSortingAndFilteringStrategies.UsersSortingStrategy(this.allUsers); // DALI TAKA SE PRAVI
    this.subjectsSortingStrategy = new AssignmentsSortingAndFilteringStrategies.SubjectsSortingStrategy(this.allSubjects); // DALI TAKA SE PRAVI
    this.filteringStrategy = new AssignmentsSortingAndFilteringStrategies.SimpleFilteringStrategy(this.allSubjects, this.allUsers, this.allSpecialties); // DALI TAKA SE PRAVI
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
        return x.userId === ev.newValue.userId && x.subjectId === ev.newValue.subjectId
      });
      if (modifiedData.length > 0) {
        if (modifiedData[0].assignmentId !== ev.newValue.assignmentId) {
          this.showToast('This assignment already exists!', ev);
        }
      }
    }
  }

  public toggleColumn(col: IgxColumnComponent): void {
    col.pinned ? col.unpin() : col.pin();
  }

  public updateCell(event, cell: IgxGridCellComponent): void {
    cell.editValue = event;
    const courseCell = this.grid.getCellByColumn(cell.rowIndex, 'course');
    const subjectCell = this.grid.getCellByColumn(cell.rowIndex, 'subjectId');
    if (cell.column.field !== 'course') {
      courseCell.update(null);
    }
    subjectCell.update(null);
  }

  public shouldDisable(cell: IgxGridCellComponent): boolean {
    if (!cell.rowData.specialtyId) {
      return true;
    }
    if (cell.column.field === 'userId') {
      return false;
    } else if (cell.column.field === 'course' && cell.rowData.userId) {
      return false;
    } else if (cell.column.field === 'subjectId' && cell.rowData.userId && cell.rowData.course) {
      this.setSelectedSpecialtySubjects(cell);
      return false;
    }
    return true;
  }

  public addRow(): void {
    this.grid.endEdit(false);
    this.grid.addRow({
      assignmentId: ++this.lastID,
      specialtyId: null,
      userId: null,
      course: null,
      subjectId: '',
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
      this.store.dispatch(new AdminManageAssignmentsActions.ManageAssignmentsStart(this.transactionsData));
      this.subjectsWithNotAllocatedHours = [];
    }
    this.grid.transactions.clear();
  }

  public handleError(): void {
    this.store.dispatch(new AdminManageAssignmentsActions.ClearMessage());
  }

  public getUserById(collection: any[], id: number): string {
    if (id) {
      let user = collection.find(el => el.id === id);
      return user.firstName + ' ' + user.lastName;
    }
    return null;
  }

  public getSpecialtyById(id: number): string {
    if (id) {
      let specialty = this.allSpecialties.find(el => el.id === id);
      return specialty ? specialty.name : null;
    }
    return null;
  }

  public getArrayFromSpecialtyCourses(id: number): number[] {
    if (id) {
      let specialty = this.allSpecialties.find(el => el.id === id);
      return specialty ? Array.from({ length: specialty.coursesAmount }, (_, i) => i + 1) : null;
    }
    return null;
  }

  public getSubjectById(id: number): string {
    if (id) {
      let subject = this.allSubjects.find(el => el.id === id);
      return subject ? subject.subjectName : null;
    }
    return null;
  }

  public setSelectedSpecialtySubjects(cell: IgxGridCellComponent): void {
    this._selectedSpecialtySubjects = this.allSubjects.filter(subject => subject.semesterId === this.activeSemester.id && subject.specialtyId === cell.rowData.specialtyId && subject.course === cell.rowData.course);
  }

  public get selectedSpecialtySubjects(): any[] {
    return this._selectedSpecialtySubjects;
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.transactionsSubscription) {
      this.transactionsSubscription.unsubscribe();
    }
    if (this.responseMessage || this.connectionFailedMessage) {
      this.handleError();
    }
  }

}

// onOpen(cell) {
//   let btnBoundingClientRect = cell.nativeElement.getBoundingClientRect();
//   let bodyBoundingClientRect = this.grid.tbody.nativeElement.getBoundingClientRect();
//   let isTop = false;
//   isTop = btnBoundingClientRect.top - bodyBoundingClientRect.top >= bodyBoundingClientRect.bottom - btnBoundingClientRect.bottom ?
//     true : false;
//   let isLeft = false;
//   isLeft = btnBoundingClientRect.left - bodyBoundingClientRect.left >= bodyBoundingClientRect.right - btnBoundingClientRect.right ? true: false;
//   const posSettings: PositionSettings = {
//       verticalDirection: isTop ? VerticalAlignment.Top : VerticalAlignment.Bottom,
//       verticalStartPoint: isTop ? VerticalAlignment.Bottom : VerticalAlignment.Top,
//       horizontalDirection: isLeft ? HorizontalAlignment.Left : HorizontalAlignment.Center,
//       horizontalStartPoint: HorizontalAlignment.Center,
//       openAnimation: scaleInVerBottom,
//       closeAnimation: scaleOutVerBottom
//     }
//   posSettings.target = cell.nativeElement;
//   const overlaySettings: OverlaySettings = {
//       positionStrategy: new ConnectedPositioningStrategy(posSettings),
//       scrollStrategy: new CloseScrollStrategy(this.grid.verticalScrollContainer.getScroll()),
//       closeOnOutsideClick: true,
//       modal: false,
//   };
//     return overlaySettings;
// }
