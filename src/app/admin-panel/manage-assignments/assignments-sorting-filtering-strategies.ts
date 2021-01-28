import { DefaultSortingStrategy, FilteringStrategy, IFilteringExpression } from 'igniteui-angular';

export class SimpleFilteringStrategy extends FilteringStrategy {
  constructor(private subjects: any, private users: any, private specialties: any) {
    super();
  }
  public findMatchByExpression(rec: any, expr: IFilteringExpression): boolean {
    let cond = expr.condition;
    let val;
    if (expr.fieldName === "specialtyId") {
      let specialty = this.specialties.find(specialty => specialty.id === rec[expr.fieldName]);
      if (specialty) {
        val = specialty.name;
      }
    } else if (expr.fieldName === "userId") {
      let user = this.users.find(user => user.id === rec[expr.fieldName])
      if (user) {
        val = user.firstName + ' ' + user.lastName;
      }
    } else if (expr.fieldName === "subjectId") {
      let subject = this.subjects.find(subject => subject.id === rec[expr.fieldName]);
      if (subject) {
        val = subject.subjectName;
      }
    }
    else {
      val = rec[expr.fieldName];
    }
    return cond.logic(val, expr.searchVal, expr.ignoreCase);
  }
}
export class SpecialtiesSortingStrategy extends DefaultSortingStrategy {
  constructor(private subjects: any[], private specialties: any[]) {
    super();
  }
  public compareValues(a: number, b: number): any {
    let subject1 = this.subjects.find(subject => subject.id === a);
    let subject2 = this.subjects.find(subject => subject.id === b);
    if (subject1 && subject2) {
      let specialty1 = this.specialties.find(specialty => specialty.id === subject1.specialtyId);
      let specialty2 = this.specialties.find(specialty => specialty.id === subject2.specialtyId);
      if (specialty1 && specialty2) {
        a = specialty1.name.toLowerCase();
        b = specialty2.name.toLowerCase();
      }
    }
    return super.compareValues(a, b);
  }
}

export class UsersSortingStrategy extends DefaultSortingStrategy {
  constructor(private users: any[]) {
    super();
  }
  public compareValues(a: number, b: number): any {
    let user1 = this.users.find(user => user.id === a);
    let user2 = this.users.find(user => user.id === b);
    if (user1 && user2) {
      user1 = user1.firstName.toLowerCase() + ' ' + user1.lastName.toLowerCase();
      user2 = user2.firstName.toLowerCase() + ' ' + user2.lastName.toLowerCase();
    }
    return super.compareValues(user1, user2);
  }
}

export class SubjectsSortingStrategy extends DefaultSortingStrategy {
  constructor(private subjects: any[]) {
    super();
  }
  public compareValues(a: number, b: number): any {
    let subject1 = this.subjects.find(subject => subject.id === a);
    let subject2 = this.subjects.find(subject => subject.id === b);
    if (subject1 && subject2) {
      a = subject1.subjectName.toLowerCase();
      b = subject2.subjectName.toLowerCase();
    }
    return super.compareValues(a, b);
  }
}

export type AssignmentsSortingAndFilteringStrategies =
  | SimpleFilteringStrategy
  | SpecialtiesSortingStrategy
  | UsersSortingStrategy
  | SubjectsSortingStrategy;
