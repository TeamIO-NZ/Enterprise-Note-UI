export default class User {
  constructor(name: string, password: string, loggedIn: boolean, token: string, email: string, gender: string, id: number, userSettings: number) {
    this.name = name;
    this.password = password;
    this.loggedIn = loggedIn;
    this.token = token;
    this.email = email;
    this.gender = gender;
    this.id = id;
    this.userSettings = userSettings
  }
  name: string;
  password: string;
  loggedIn: boolean;
  token: string;
  email: string;
  gender: string;
  id: number
  userSettings: number
}
