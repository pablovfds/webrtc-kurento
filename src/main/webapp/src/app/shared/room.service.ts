import { Injectable } from '@angular/core';
import {Participant} from "./participant";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private ws: WebSocket;

  private _me: Participant;
  private _participantsList: Participant[];
  private _myInfo$: Subject<Participant>;
  private _participantsList$: Subject<Participant[]>;

  constructor() {
    this.initWebSocket();
  }

  private initWebSocket() {
    this.ws = new WebSocket("ws://localhost:8080/room");

    this._participantsList = [];
    this._myInfo$ = new Subject();
    this._participantsList$ = new Subject();

    this.ws.onopen = (event) => {
      console.info("SOCKET OPENED");
      console.info(event);
    };

    this.ws.onclose = (event) => {
      console.info("SOCKET CLOSED");
      console.info(event);
    };

    this.ws.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data);
      console.info("Received message: {}", message.data);

      switch (parsedMessage.id) {
        case 'existingParticipants':
          this.onExistingParticipants(parsedMessage);
          break;
      }
    }
  }

  private onExistingParticipants(parsedMessage: any) {
    parsedMessage.participants.forEach(participantName => {
      this._participantsList.push(new Participant(participantName));
    });
    this._me = new Participant(parsedMessage.participantInfo.name);
    this._participantsList.push(this._me);
    console.log(this._participantsList);
    this._participantsList$.next(this._participantsList);
  }

  register(name, roomName) {
    this.sendMessage({
      id: "joinRoom",
      name: name,
      room: roomName
    });
  }


  get participantsList$(): Observable<Participant[]> {
    return this._participantsList$.asObservable();
  }

  private sendMessage(message) {
    if (!this.ws || this.ws.readyState != this.ws.OPEN) {
      this.initWebSocket();
      console.error("Connection reopened!")
    } else {

      this.ws.send(JSON.stringify(message));
    }

  }
}
