export class ParticipantMedia {

  private _id: string;
  private _rtcPeer: any;

  constructor(id, rtcPeer) {
    this._id = id;
    this._rtcPeer = rtcPeer;
  }


  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get rtcPeer(): any {
    return this._rtcPeer;
  }

  set rtcPeer(value: any) {
    this._rtcPeer = value;
  }
}
