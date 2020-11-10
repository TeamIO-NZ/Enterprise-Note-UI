export default class User{
    constructor(name:string,password:string,loggedIn:boolean,token:string, email:string,gender:string,id:number){
        this.name = name;
        this.password = password;
        this.loggedIn = loggedIn;
        this.token = token;
        this.email = email;
        this.gender = gender;
        this.id = id;
    }
    name:string;
    password:string;
    loggedIn:boolean;
    token:string;
    email:string;
    gender:string;
    id:number
}