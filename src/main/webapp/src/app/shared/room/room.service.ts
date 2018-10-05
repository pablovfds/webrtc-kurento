import { Injectable } from '@angular/core';

import { Room } from './room';
import {Subject, Observable} from 'rxjs';

import { WebRtcPeer } from 'kurento-utils';
import {Participant} from "../participant/participant";
import {ParticipantMedia} from "../participant/participant-media";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private ws: WebSocket;

  private _me: Participant;

  private _room: Room;

  private _participantsList$: Subject<Participant[]>;
  private _myInfo$: Subject<Participant>;

  private _participantsMedia: ParticipantMedia[];

  constructor() {
    this.initSocket();
    this._participantsList$ = new Subject<Participant[]>();
    this._myInfo$ = new Subject<Participant>();
    this._participantsMedia = [];
  }

  register(name, room) {
    const message = {
      id: 'joinRoom',
      name: name,
      room: room,
    };

    this._me = new Participant(name, false);
    this._room = new Room(room);

    this.sendMessage(message);
  }

  setMyStream(mediaElement) {
    console.log('\n\nsetMyStream:' + this._me.name);
    const constraints = {
      audio: true,
      video: true
    };

    const onIceCandidateData = { roomService: this, participantName: this._me.name, candidateName: this._me.name };

    const options = {
      localVideo: mediaElement,
      mediaConstraints: constraints,
      onicecandidate: onIceCandidate.bind(onIceCandidateData)
    };
    const this_ = this;
    const rtcPeer = WebRtcPeer.WebRtcPeerSendonly(options,
      function (error) {
        if (error) {
          return console.error(error);
        }

        const offerToReceiveVideoData = { roomService: this_, sender: this_._me.name, participantName: this_._me.name };

        this.generateOffer(offerToReceiveVideo.bind(offerToReceiveVideoData));
        const participantMedia = new ParticipantMedia(this_._me.name, rtcPeer);
        this_._participantsMedia.push(participantMedia);
      });
  }

  setParticipantStream(participant: Participant, mediaElement) {
    console.log('\n\nsetParticipantStream: {}', participant.name);
    const onIceCandidateData = {
      roomService: this,
      participantName: participant.name,
      candidateName: this._me.name
    };

    const options = {
      remoteVideo: mediaElement,
      onicecandidate: onIceCandidate.bind(onIceCandidateData)
    };
    const this_ = this;
    const rtcPeer = WebRtcPeer.WebRtcPeerRecvonly(options,
      function (error) {
        if (error) {
          return console.error(error);
        }

        const offerToReceiveVideoData = { roomService: this_, sender: participant.name, participantName: this_._me.name };

        this.generateOffer(offerToReceiveVideo.bind(offerToReceiveVideoData));
        const participantMedia = new ParticipantMedia(participant.name, rtcPeer);
        this_._participantsMedia.push(participantMedia);
      });
  }

  sendMessage(message) {
    if (!this.ws && this.ws.readyState !== this.ws.OPEN) {
      this.initSocket();
    }

    const jsonMessage = JSON.stringify(message);
    console.log('Sending message: ' + jsonMessage);
    this.ws.send(jsonMessage);
  }

  get participantsList$(): Observable<Participant[]> {
    return this._participantsList$.asObservable();
  }

  get myInfo(): Participant {
    return this._me;
  }

  private initSocket() {
    this.ws = new WebSocket('wss://localhost:8443/groupcall');

    this.ws.onopen = (event) => {
      console.log(event);
      console.log('Connected');
    };

    this.ws.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data);
      console.log('Received message: ' + message.data);

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
        default:
          break;
      }
    };
  }

  private onExistingParticipants(msg) {
    console.log('\n\nonExistingParticipants');
    console.log(this._me.name + ' registered in room ' + this._room.name);

    this._me.isPresenter = msg.isPresenter;

    msg.data.forEach((element) => {
      const participant = new Participant(element.name, element.isPresenter);
      this._room.participants.push(participant);
    });

    this._room.participants.push(this._me);

    this._participantsList$.next(this._room.participants);
    this._myInfo$.next(this._me);
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
      console.error('Media not found!');
    }
  }

  private addIceCandidate(data) {
    console.log('\n\naddIceCandidate');

    const media = this.getParticipantMedia(data.name);

    if (media) {
      media.rtcPeer.addIceCandidate(data.candidate, function (error) {
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

    const participant = new Participant(data.name, data.isPresenter);
    this._room.participants.push(participant);
    this._participantsList$.next(this._room.participants);
  }

  private getParticipantMedia(name: string): ParticipantMedia {
    for (let participantMedia of this._participantsMedia) {
      if (participantMedia.id === name) return participantMedia;
    }
    return null;
  }
}

function onIceCandidate(this: { roomService: RoomService, candidateName: string, participantName: string }, candidate, wp) {
  console.log('Local candidate' + JSON.stringify(candidate));

  const message = {
    id: 'onIceCandidate',
    candidate: candidate,
    candidateName: this.participantName,
    participantName: this.participantName
  };
  this.roomService.sendMessage(message);
}

function offerToReceiveVideo(this: { roomService: RoomService, sender: string, participantName: string }, error, offerSdp, wp) {
  if (error) {
    return console.error('sdp offer error');
  }
  console.log('Invoking SDP offer callback function');
  const msg = {
    id: 'receiveVideoFrom',
    sender: this.sender,
    participantName: this.participantName,
    sdpOffer: offerSdp
  };
  this.roomService.sendMessage(msg);
}
