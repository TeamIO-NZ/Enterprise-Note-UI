export class Note {
    constructor(id: string, title: string, desc: string, content: string, owner: number, viewers: number[], editors: number[]) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.content = content;
        this.owner = owner;
        this.viewers = viewers;
        this.editors = editors;
    }
    id: string;
    title: string;
    desc: string;
    content: string;
    owner: number;
    viewers: number[];
    editors: number[]
}

export class Notes {
    constructor(id:string, notes:Note[]){
        this.id = id;
        this.notes = notes;
    }
    id:string;
    notes:Note[];
}