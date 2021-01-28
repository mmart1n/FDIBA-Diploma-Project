export class Semester {

  public semesterId: number;
  public semesterName: string;
  public semesterPeriod: string;
  public isActive: boolean;

  constructor(semesterId: number, semesterName: string, semesterPeriod: string, isActive: boolean) {
    this.semesterId = semesterId;
    this.semesterName = semesterName;
    this.semesterPeriod = semesterPeriod;
    this.isActive = isActive;
  }

}
