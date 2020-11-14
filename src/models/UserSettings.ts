export default class UserSettings{
    constructor(settingsID:number,viewers:Array<number>,editors:Array<number>){
        this.settingsID = settingsID;
        this.viewers = viewers;
        this.editors = editors;
    }
    settingsID:number;
    viewers:Array<number>;
    editors:Array<number>;

}
