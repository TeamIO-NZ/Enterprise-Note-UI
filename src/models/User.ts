export default class User{
    constructor(name:string,password:string,loggedIn:boolean){
        this.name = name;
        this.password = password;
        this.loggedIn = loggedIn;
    }
    name:string;
    password:string;
    loggedIn:boolean;
}