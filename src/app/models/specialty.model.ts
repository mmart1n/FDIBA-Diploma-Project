export class Specialty {

  public specialtyId: number;
  public specialtyName: string;
  public specialtyBachelor: boolean;
  public coursesAmount: number;

  constructor(specialtyId: number, specialtyName: string, specialtyBachelor: boolean, coursesAmount: number){
    this.specialtyId = specialtyId;
    this.specialtyName = specialtyName;
    this.specialtyBachelor = specialtyBachelor;
    this.coursesAmount = coursesAmount;
  }

}
