export class Note {
  constructor(id: number, title: string, desc: string, content: string, owner: number, viewers: number[], editors: number[]) {
    this.id = id;
    this.title = title;
    this.desc = desc;
    this.content = content;
    this.owner = owner;
    this.viewers = viewers;
    this.editors = editors;
  }
  id: number;
  title: string;
  desc: string;
  content: string;
  owner: number;
  viewers: number[];
  editors: number[]
}
