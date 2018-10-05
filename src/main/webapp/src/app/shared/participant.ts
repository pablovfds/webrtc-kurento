export class Participant {
  private _name: string;
  private _isPresenter: boolean;

  constructor(name: string, isPresenter: boolean) {
    this.name = name;
    this.isPresenter = isPresenter;
  }

  public set name(v: string) {
    this._name = v;
  }

  public get name(): string {
    return this._name;
  }

  public set isPresenter(v: boolean) {
    this._isPresenter = v;
  }

  public get isPresenter(): boolean {
    return this._isPresenter;
  }
}
