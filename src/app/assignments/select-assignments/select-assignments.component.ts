import { Component, OnInit, ViewChild, Input, AfterViewInit, ChangeDetectorRef, OnChanges } from "@angular/core";
import { IgxGridComponent, OverlaySettings, CloseScrollStrategy, SortingDirection, IgxToastComponent, IGridEditEventArgs } from "igniteui-angular";
import * as AssignmentsSortingAndFilteringStrategies from '../../admin-panel/manage-assignments/assignments-sorting-filtering-strategies';
import { HandleTransactions } from "src/app/shared/handle-transactions";
import * as AdminManageAssignmentsActions from '../../admin-panel/manage-assignments/store/admin-manage-assignments.actions';
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-select-assignments',
  templateUrl: './select-assignments.component.html',
  styleUrls: ['./select-assignments.component.scss']
})
export class SelectAssignmentsComponent extends HandleTransactions implements OnInit, AfterViewInit, OnChanges {

  @ViewChild(IgxGridComponent, { read: IgxGridComponent, static: true }) public grid: IgxGridComponent;
  @ViewChild("toast", { static: true }) public toast: IgxToastComponent;

  public data;
  public customOverlaySettings: OverlaySettings;
  public lastID;
  public subjectsSortingStrategy: AssignmentsSortingAndFilteringStrategies.SubjectsSortingStrategy;

  @Input() userId: number;
  @Input() subjects: any[];

  @Input() set assignments(assignments) {
    this.data = assignments;
    if (this.data === undefined || !this.data.length) {
      this.lastID = 0;
    } else {
      this.lastID = this.data[this.data.length - 1].assignmentId;
    }
  };

  constructor(private ref: ChangeDetectorRef, private store: Store) {
    super();
  }

  public ngOnInit(): void {
    this.transactionsData = this.grid.transactions.getAggregatedChanges(true);
    this.grid.transactions.onStateUpdate.subscribe(() => {
      this.transactionsData = this.grid.transactions.getAggregatedChanges(true);
    });
  }

  public ngAfterViewInit(): void {
    this.customOverlaySettings = {
      scrollStrategy: new CloseScrollStrategy(this.grid.verticalScrollContainer.getScroll()),
      closeOnOutsideClick: true,
      modal: false
    };
    this.grid.sortingExpressions = [
      {
        dir: SortingDirection.Asc, fieldName: "subjectId",
        ignoreCase: true, strategy: this.subjectsSortingStrategy
      }
    ];
    this.grid.cdr.detectChanges();
  }

  public ngOnChanges(): void {
    this.ref.detectChanges();
    if (this.grid && this.subjects && this.data) {
      this.grid.reflow();
      this.subjectsSortingStrategy = new AssignmentsSortingAndFilteringStrategies.SubjectsSortingStrategy(this.subjects);
    }
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
        return x.subjectId === ev.newValue.subjectId
      });
      if (modifiedData.length > 0) {
        if (modifiedData[0].assignmentId !== ev.newValue.assignmentId) {
          this.showToast('This assignment already exists!', ev);
        }
      }
    }
  }

  public addRow(): void {
    this.grid.endEdit(false);
    this.grid.addRow({
      assignmentId: ++this.lastID,
      userId: this.userId,
      subjectId: '',
      lectureHours: 0,
      labExerciseHours: 0,
      seminarHours: 0,
      courseProjectHours: 0,
      examinationHours: 0
    });
    this.grid.cdr.detectChanges();
  }

  public handleTransactionsData(event: boolean): void {
    if (event) {
      this.store.dispatch(new AdminManageAssignmentsActions.ManageAssignmentsStart(this.transactionsData));
    }
    this.grid.transactions.clear();
  }

  public getSubjectById(id: number): string {
    if (id && this.subjects && this.subjects.length) {
      let subject = this.subjects.find(el => el.id === id);
      return subject ? subject.subjectName : null;
    }
    return null;
  }

}
