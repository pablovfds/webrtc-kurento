export class Participant {
  private _name: string;
  private _rtcPeer: any;

  constructor(name: string) {
    this.name = name;
  }


  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }


  get rtcPeer(): any {
    return this._rtcPeer;
  }

  set rtcPeer(value: any) {
    this._rtcPeer = value;
  }
}
