import { Injectable } from '@angular/core';
import {Participant} from "./participant";
import {Observable, Subject} from "rxjs";

import {WebRtcPeer} from 'kurento-utils';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private ws: WebSocket;

  private _roomName: string;

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
    this._myInfo$.next(this._me);
    this._participantsList$.next(this._participantsList);
  }

  register(name, roomName) {
    this._roomName = roomName;
    this.sendMessage({
      id: "joinRoom",
      name: name,
      room: roomName
    });
  }

  setMyStream(mediaElement) {
    let constraints = {
      audio : true,
      video : {
        mandatory : {
          maxWidth : 320,
          maxFrameRate : 15,
          minFrameRate : 15
        }
      }
    };
    console.log(this._me.name + " registered in room " + this._roomName);

    const onIceCandidateData = { roomService: this, name: this._me.name };

    const options = {
      localVideo: mediaElement,
      mediaConstraints: constraints,
      onicecandidate: onIceCandidate.bind(onIceCandidateData)
    };

    let this_ = this;

    this._me.rtcPeer = WebRtcPeer.WebRtcPeerSendonly(options,
      function (error) {
        if(error) {
          return console.error(error);
        }
        console.info(this_._me)
        const offerToReceiveVideoData = { roomService: this_, name: this_._me.name};
        this.generateOffer (offerToReceiveVideo.bind(offerToReceiveVideoData));
      });
  }


  get participantsList$(): Observable<Participant[]> {
    return this._participantsList$.asObservable();
  }


  get myInfo(): Participant {
    return this._me;
  }



  sendMessage(message) {
    if (!this.ws || this.ws.readyState != this.ws.OPEN) {
      this.initWebSocket();
      console.error("Connection reopened!")
    } else {

      this.ws.send(JSON.stringify(message));
    }

  }
}

function onIceCandidate(this: { roomService: RoomService, name: string }, candidate, wp) {
  console.log('Local candidate' + JSON.stringify(candidate));

  const message = {
    id: 'onIceCandidate',
    candidate: candidate,
    name: name
  };
  this.roomService.sendMessage(message);
}

function offerToReceiveVideo(this: { roomService: RoomService, name: string}, error, offerSdp, wp) {
  if (error) {
    return console.error('sdp offer error');
  }
  console.log('Invoking SDP offer callback function');
  const msg = {
    id : "receiveVideoFrom",
    sender : this.name,
    sdpOffer : offerSdp
  };
  this.roomService.sendMessage(msg);
}
