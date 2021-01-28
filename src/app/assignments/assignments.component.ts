import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { IgxTabsComponent } from 'igniteui-angular';
import { SelectedSpecialtySubjectsWrapper } from '../shared/selected-specialty-subjects-wrapper';
import * as fromApp from '../store/app.reducer';
import * as AdminManageAssignmentsActions from '../admin-panel/manage-assignments/store/admin-manage-assignments.actions';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss']
})
export class AssignmentsComponent extends SelectedSpecialtySubjectsWrapper implements OnDestroy {
  @ViewChild(IgxTabsComponent, { read: IgxTabsComponent }) public tabs: IgxTabsComponent;

  constructor(protected store: Store<fromApp.AppState>) {
    super();
  }

  public itemSelected(): void {
    this.handleError();
  }

  public handleError(): void {
    if (this.responseMessage) {
      this.store.dispatch(new AdminManageAssignmentsActions.ClearMessage());
    }
  }

  public handleSelection(shouldContinue: any[]): void {
    if (this.selectedSpecialty !== shouldContinue[1]) {
      this.selectedSpecialty = shouldContinue[1];
      this.coursesAmount = shouldContinue[1].coursesAmount;
      if (this.tabs) {
        this.tabs.selectedIndex = 0;
      }
    }
    this.setSelectedSpecialtySubjects();
    this.setSelectedSpecialtyAssignments();
  }

  public ngOnDestroy(): void {
    this.handleError();
    super.ngOnDestroy();
  }
}
