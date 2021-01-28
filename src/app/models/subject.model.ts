import { Semester } from './semester.model';
import { Specialty } from './specialty.model';

export class Subject {
  public subjectId: number;
  public subjectName: string;
  public zip: boolean;
  public semesterId: Semester;
  public specialtyId: Specialty;
  public course: number;
  public lectureHours: number;
  public labExerciseHours: number;
  public seminarHours: number;
  public courseProjectHours: number;
  public examinationHours: number;
  public remainingLectureHours: number;
  public remainingLabExerciseHours: number;
  public remainingSeminarHours: number;
  public remainingCourseProjectHours: number;
  public remainingExaminationHours: number;

  constructor(
    subjectId: number,
    subjectName: string,
    zip: boolean,
    semesterId: Semester,
    specialtyId: Specialty,
    course: number,
    lectureHours: number,
    labExerciseHours: number,
    seminarHours: number,
    courseProjectHours: number,
    examinationHours: number,
    remainingLectureHours: number,
    remainingLabExerciseHours: number,
    remainingSeminarHours: number,
    remainingCourseProjectHours: number,
    remainingExaminationHours: number) {
    this.subjectId = subjectId;
    this.subjectName = subjectName;
    this.zip = zip;
    this.semesterId = new Semester(semesterId.semesterId, semesterId.semesterName, semesterId.semesterPeriod, semesterId.isActive);
    this.specialtyId = new Specialty(specialtyId.specialtyId, specialtyId.specialtyName, specialtyId.specialtyBachelor, specialtyId.coursesAmount);
    this.course = course;
    this.lectureHours = lectureHours;
    this.labExerciseHours = labExerciseHours;
    this.seminarHours = seminarHours;
    this.courseProjectHours = courseProjectHours;
    this.examinationHours = examinationHours;
    this.remainingLectureHours = remainingLectureHours;
    this.remainingLabExerciseHours = remainingLabExerciseHours;
    this.remainingSeminarHours = remainingSeminarHours;
    this.remainingCourseProjectHours = remainingCourseProjectHours;
    this.remainingExaminationHours = remainingExaminationHours;
  }

  clone(): Subject {
    const clone = new Subject(this.subjectId, this.subjectName, this.zip, this.semesterId, this.specialtyId, this.course, this.lectureHours, this.labExerciseHours,
      this.seminarHours, this.courseProjectHours, this.examinationHours, this.remainingLectureHours, this.remainingLabExerciseHours, this.remainingSeminarHours,
      this.remainingCourseProjectHours, this.remainingExaminationHours);

    return clone;
  }
}
