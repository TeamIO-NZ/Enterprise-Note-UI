export default class User{
    constructor(name:string,password:string,loggedIn:boolean,token:string){
        this.name = name;
        this.password = password;
        this.loggedIn = loggedIn;
        this.token = token;
    }
    name:string;
    password:string;
    loggedIn:boolean;
    token:string;
}