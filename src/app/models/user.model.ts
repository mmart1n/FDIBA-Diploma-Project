export class User {

  public username: string;
  public userId: number;
  public firstName: string;
  public middleName: string;
  public lastName: string;
  public isAdmin: boolean;
  private _token: string;
  private _tokenExpirationDate: Date;

  constructor(username: string, userId: number, firstName: string, middleName: string, lastName: string, isAdmin: boolean, token: string, tokenExpirationDate: Date) {
    this.username = username;
    this.userId = userId;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.isAdmin = isAdmin;
    this._token = token;
    this._tokenExpirationDate = tokenExpirationDate;

  }

  get token() {
    if (!this._tokenExpirationDate || new Date() >= this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  get tokenExpirationDate() {
    return this._tokenExpirationDate;
  }

}
