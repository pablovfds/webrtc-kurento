import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Participant} from "../../shared/participant";
import {RoomService} from "../../shared/room.service";

@Component({
  selector: 'app-participant-media',
  templateUrl: './participant-media.component.html',
  styleUrls: ['./participant-media.component.css']
})
export class ParticipantMediaComponent implements OnInit {

  @Input() participant: Participant;

  @ViewChild('mediaElement') mediaElement: ElementRef;

  constructor(private roomService: RoomService) {
  }

  ngOnInit() {

    if (this.participant.name == this.roomService.myInfo.name) {
      console.log('\n\nMy Name: {}', this.roomService.myInfo.name);
      this.roomService.setMyStream(this.mediaElement.nativeElement)
    } else {
      console.log('\n\nParticipantName: {}', this.participant.name);
      this.roomService.setParticipantStream(this.participant, this.mediaElement.nativeElement);
    }
  }

}
