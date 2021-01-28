import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { IgxGridComponent, SortingDirection } from 'igniteui-angular';

@Component({
  selector: 'app-existing-assignments',
  templateUrl: './existing-assignments.component.html',
  styleUrls: ['./existing-assignments.component.scss']
})
export class ExistingAssignmentsComponent implements AfterViewInit {
  @ViewChild(IgxGridComponent, { static: true }) public grid: IgxGridComponent;
  @Input() set assignments(assignments) {
    this.data = assignments;
    this.ref.detectChanges();
    if (this.grid) {
      this.grid.reflow();
    }
  }

  public data;

  constructor(private ref: ChangeDetectorRef) { }

  public ngAfterViewInit(): void {
    this.grid.sortingExpressions = [
      {
        dir: SortingDirection.Asc, fieldName: "subjectId",
        ignoreCase: true
      }, {
        dir: SortingDirection.Asc, fieldName: "userId",
        ignoreCase: true
      }];
    this.grid.cdr.detectChanges();
  }

}
