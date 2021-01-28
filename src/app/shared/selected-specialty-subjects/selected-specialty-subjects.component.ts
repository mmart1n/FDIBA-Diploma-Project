import { Component, Input, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IgxGridComponent, SortingDirection } from 'igniteui-angular';

@Component({
  selector: 'app-selected-specialty-subjects',
  templateUrl: './selected-specialty-subjects.component.html',
  styleUrls: ['./selected-specialty-subjects.component.scss']
})
export class SelectedSpecialtySubjectsComponent implements AfterViewInit {
  @ViewChild(IgxGridComponent, { static: true }) public grid: IgxGridComponent;
  @Input() set subjects(subjects) {
    this.data = subjects;
    this.ref.detectChanges();
    if (this.grid) {
      this.grid.reflow();
    }
  }

  public data;

  private upFontCondition = (rowData: any, columnKey: any): boolean => {
    return rowData[columnKey] <= 0;
  }

  private downFontCondition = (rowData: any, columnKey: any): boolean => {
    return rowData[columnKey] > 0;
  }

  public remaingHoursClasses = {
    downFont: this.downFontCondition,
    upFont: this.upFontCondition
  };

  constructor(private ref: ChangeDetectorRef) { }

  public ngAfterViewInit(): void {
    this.grid.sortingExpressions = [
      {
        dir: SortingDirection.Asc, fieldName: "subjectName",
        ignoreCase: true
      }];
    this.grid.cdr.detectChanges();
  }

}
