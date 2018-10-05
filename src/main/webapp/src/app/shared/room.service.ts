import { Injectable } from '@angular/core';
import {Participant} from "./participant";
import {Observable, Subject} from "rxjs";

import {WebRtcPeer} from 'kurento-utils';
import {ParticipantMedia} from "./participant-media";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private ws: WebSocket;

  private _roomName: string;

  private _me: Participant;
  private _participantsList: Participant[];
  private _participantsMedia: ParticipantMedia[];
  private _myInfo$: Subject<Participant>;
  private _participantsList$: Subject<Participant[]>;

  constructor() {
    this.initWebSocket();
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

    const rtcPeer = WebRtcPeer.WebRtcPeerSendonly(options,
      function (error) {
        if(error) {
          return console.error(error);
        }
        console.info(this_._me);
        const offerToReceiveVideoData = { roomService: this_, name: this_._me.name};
        this.generateOffer (offerToReceiveVideo.bind(offerToReceiveVideoData));
        this_._participantsMedia.push(new ParticipantMedia(this_._me.name, rtcPeer))
      });
  }

  setParticipantStream(participant: Participant, nativeElement: any) {
    console.log('\n\nsetParticipantStream: {}', participant.name);

    const onIceCandidateData = {
      roomService: this,
      name: participant.name
    };

    const options = {
      remoteVideo: nativeElement,
      onicecandidate: onIceCandidate.bind(onIceCandidateData)
    };

    let this_ = this;

    const rtcPeer = WebRtcPeer.WebRtcPeerRecvonly(options,
      function (error) {
        if (error) {
          return console.error(error);
        }

        const offerToReceiveVideoData = { roomService: this_, name: participant.name};

        this.generateOffer(offerToReceiveVideo.bind(offerToReceiveVideoData));
        this_._participantsMedia.push(new ParticipantMedia(participant.name, rtcPeer));
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

  private initWebSocket() {
    this.ws = new WebSocket("ws://localhost:8080/room");

    this._participantsList = [];
    this._participantsMedia = [];
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

        case 'receiveVideoAnswer':
          this.receiveVideoResponse(parsedMessage);
          break;

        case 'iceCandidate':
          this.addIceCandidate(parsedMessage);
          break;

        case 'newParticipantArrived':
          this.onNewParticipant(parsedMessage);
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

  private receiveVideoResponse(data) {
    console.log('\n\nreceiveVideoResponse');

    const media = this.getParticipantMedia(data.name);

    if (media) {
      media.rtcPeer.processAnswer(data.sdpAnswer, function (error) {
        if (error) {
          return console.error(error);
        }
      });
    } else {
      console.error('Media not found1!');
    }
  }

  private addIceCandidate(parsedMessage: any) {
    console.log('\n\naddIceCandidate: {}', parsedMessage.name);

    const participant = this.getParticipantMedia(parsedMessage.name);

    if (participant) {
      participant.rtcPeer.addIceCandidate(parsedMessage.candidate, function (error) {
        if (error) {
          console.error('Error adding candidate: ' + error);
          return;
        }
      });
    } else {
      console.error('Media not found!');
    }
  }

  private onNewParticipant(data) {
    console.log('\n\nonNewParticipant');

    const participant = new Participant(data.name);
    this._participantsList.push(participant);
    this._participantsList$.next(this._participantsList);
  }

  private getParticipantMedia(name: string): ParticipantMedia {

    console.info("Searching for: {}", name);
    console.info("Participants: {}", this._participantsList);

    for (let index = 0; index < this._participantsMedia.length; index++) {
      const element = this._participantsMedia[index];

      if (element.id === name) {
        return element;
      }
    }
    return null;
  }
}

function onIceCandidate(this: { roomService: RoomService, name: string }, candidate, wp) {
  // console.log('Local candidate' + JSON.stringify(candidate));

  const message = {
    id: 'onIceCandidate',
    candidate: candidate,
    name: this.name
  };
  this.roomService.sendMessage(message);
}

function offerToReceiveVideo(this: { roomService: RoomService, name: string}, error, offerSdp, wp) {
  if (error) {
    return console.error('sdp offer error');
  }
  // console.log('Invoking SDP offer callback function');
  const msg = {
    id : "receiveVideoFrom",
    sender : this.name,
    sdpOffer : offerSdp
  };
  this.roomService.sendMessage(msg);
}
