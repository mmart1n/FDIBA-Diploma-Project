import { Subject } from './subject.model';
import { User } from './user.model';


export class Assignment {
  public assignmentId: number;
  public subjectId: Subject;
  public userId: User;
  public lectureHours: number;
  public labExerciseHours: number;
  public seminarHours: number;
  public courseProjectHours: number;
  public examinationHours: number;

  constructor(assignmentId: number, subjectId: Subject, userId: User, lectureHours: number, labExerciseHours: number, seminarHours: number, courseProjectHours: number, examinationHours: number) {
    this.assignmentId = assignmentId;
    this.subjectId = subjectId.clone();
    this.userId = new User(userId.username, userId.userId, userId.firstName, userId.lastName, userId.lastName, userId.isAdmin, userId.token, userId.tokenExpirationDate);
    this.lectureHours = lectureHours;
    this.labExerciseHours = labExerciseHours;
    this.seminarHours = seminarHours;
    this.courseProjectHours = courseProjectHours;
    this.examinationHours = examinationHours;
  }
}
