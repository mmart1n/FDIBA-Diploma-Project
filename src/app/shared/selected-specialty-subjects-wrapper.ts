import { Directive } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest, Subscription } from "rxjs";
import * as fromApp from '../store/app.reducer';

@Directive()
export abstract class SelectedSpecialtySubjectsWrapper {
  public allSpecialties;
  public allSubjects;
  public allAssignments;
  public allUsers;
  public failedAssignments;

  public isLoading = true;
  public currentUser;
  public activeSemester;
  public coursesAmount = 0;
  public selectedSpecialty: any;

  private subscription: Subscription;
  public connectionFailedMessage: string;
  public responseMessage: string;

  public selectedSpecialtySubjects: any[];
  public selectedSpecialtyAssignments: any[];

  public selectedSpecialtySubjectsByCourses: Array<any[]>;
  public selectedSpecialtyAssignmentsByCourses: Array<any[]>;

  protected store: Store<fromApp.AppState>;

  constructor() {
  }

  public ngOnInit(): void {
    this.subscription = combineLatest(this.store.select('adminManageStateAndSemesters'), this.store.select('adminManageAssignments'), this.store.select('adminManageSpecialties'), this.store.select('adminManageSubjects'), this.store.select('adminManageUsers'), this.store.select('auth'))
      .subscribe(([semestersState, assignmentsState, specialtiesState, subjectState, usersState, authState]) => {
        if (!!semestersState.connectionFailedError || !!assignmentsState.connectionFailedError || !!specialtiesState.connectionFailedError || !!subjectState.connectionFailedError || !!usersState.connectionFailedError || !!authState.responseMessage) {
          this.connectionFailedMessage = 'Connection to the backend has failed! Please reload the page and try again!';
          this.isLoading = false;
          (document.getElementsByClassName('page-footer')[0] as any).style.visibility = "visible";
          return;
        } else {
          this.connectionFailedMessage = null;
          this.isLoading = semestersState.loading || specialtiesState.loading || subjectState.loading || authState.loading || assignmentsState.loading || usersState.loading;
        }
        if (semestersState.semesters.length !== 0 && specialtiesState.specialties.length !== 0 && subjectState.subjects.length !== 0 && usersState.users.length !== 0 && authState.user) {
          this.allSpecialties = specialtiesState.specialties;
          this.currentUser = authState.user;
          this.allSubjects = subjectState.subjects;
          this.allAssignments = assignmentsState.assignments;
          this.failedAssignments = assignmentsState.failedAssignments;
          this.allUsers = usersState.users;
          this.activeSemester = semestersState.semesters.find(x => x.active === true);
          this.handleSelection([true, this.allSpecialties[0]]);
        }
        if (!this.isLoading) {
          (document.getElementsByClassName('page-footer')[0] as any).style.visibility = "visible";
        } else {
          (document.getElementsByClassName('page-footer')[0] as any).style.visibility = "hidden";
        }
      });
  }

  public handleSelection(shouldContinue: any[]): void {
    this.selectedSpecialty = shouldContinue[1];
    this.coursesAmount = shouldContinue[1].coursesAmount;
    this.setSelectedSpecialtySubjects();
    this.setSelectedSpecialtyAssignments();
  }

  public setSelectedSpecialtyAssignments(): void {
    // Get all assignments within the selected specialty
    this.selectedSpecialtyAssignments = this.allAssignments.filter(assignment => {
      let subject = this.selectedSpecialtySubjects.find(subject => subject.id === assignment.subjectId);
      if (subject) {
        return this.currentUser.userId === assignment.userId;
      } else {
        return false;
      }
    });

    this.failedAssignments = this.failedAssignments.filter(assignment => this.currentUser.userId === assignment.user.id);
    if (this.failedAssignments.length) {
      this.responseMessage = "The assignments for the following subjects have failed:<br>" + Array.from(this.failedAssignments.map(ass => ass.subject.name)).join('<br>');
    } else {
      this.responseMessage = null;
    }

    // Devide the selected specialty subjects by courses
    this.selectedSpecialtyAssignmentsByCourses = new Array(this.coursesAmount);
    this.selectedSpecialtyAssignments.forEach(assignment => {
      let subject = this.selectedSpecialtySubjects.find(y => y.id === assignment.subjectId);
      if (!this.selectedSpecialtyAssignmentsByCourses[subject.course - 1]) {
        this.selectedSpecialtyAssignmentsByCourses[subject.course - 1] = [];
      }
      this.selectedSpecialtyAssignmentsByCourses[subject.course - 1].push({ ...assignment, userId: this.currentUser.userId });
    });
  }

  public setSelectedSpecialtySubjects(): void {
    // Get all subjects within the selected specialty
    this.selectedSpecialtySubjects = this.allSubjects.filter(subject => subject.semesterId === this.activeSemester.id && subject.specialtyId === this.selectedSpecialty.id);
    // Devide the selected specialty subjects by courses
    this.selectedSpecialtySubjectsByCourses = new Array(this.coursesAmount);
    this.selectedSpecialtySubjects.forEach(subject => {
      if (!this.selectedSpecialtySubjectsByCourses[subject.course - 1]) {
        this.selectedSpecialtySubjectsByCourses[subject.course - 1] = [];
      }
      this.selectedSpecialtySubjectsByCourses[subject.course - 1].push(subject);
    });
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    (document.getElementsByClassName('page-footer')[0] as any).style.visibility = "visible";
  }
}
