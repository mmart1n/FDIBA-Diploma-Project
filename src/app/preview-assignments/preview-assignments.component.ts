import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { SelectedSpecialtySubjectsWrapper } from '../shared/selected-specialty-subjects-wrapper';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-preview-assignments',
  templateUrl: './preview-assignments.component.html',
  styleUrls: ['./preview-assignments.component.scss']
})
export class PreviewAssignmentsComponent extends SelectedSpecialtySubjectsWrapper {

  constructor(protected store: Store<fromApp.AppState>) {
    super();
  }

  public setSelectedSpecialtyAssignments(): void {
    // Get all assignments within the selected specialty
    this.selectedSpecialtyAssignments = this.allAssignments.filter(assignment => {
      let subject = this.selectedSpecialtySubjects.find(subject => subject.id === assignment.subjectId);
      return !!subject;
    });

    // Devide the selected specialty subjects by courses
    this.selectedSpecialtyAssignmentsByCourses = new Array(this.coursesAmount);
    this.selectedSpecialtyAssignments.forEach(assignment => {
      let subject = this.selectedSpecialtySubjects.find(subject => subject.id === assignment.subjectId);
      let user = this.allUsers.find(user => user.id === assignment.userId);
      if (!this.selectedSpecialtyAssignmentsByCourses[subject.course - 1]) {
        this.selectedSpecialtyAssignmentsByCourses[subject.course - 1] = [];
      }
      this.selectedSpecialtyAssignmentsByCourses[subject.course - 1].push({ ...assignment, subjectId: subject.subjectName, userId: user.firstName + ' ' + user.lastName });
    });
  }

}
