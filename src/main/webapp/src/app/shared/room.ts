import {Participant} from "./participant";

export class Room {
  private _name: string;
  private _participants: Participant[];

  constructor(name: string) {
    this.name = name;
    this._participants = [];
  }

  public set name(v: string) {
    this._name = v;
  }

  public get name(): string {
    return this._name;
  }

  public get participants(): Participant[] {
    return this._participants;
  }
}
