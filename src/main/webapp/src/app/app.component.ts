import {Component, OnInit} from '@angular/core';
import {Participant} from "./shared/participant";
import {RoomService} from "./shared/room.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  participants: Participant[];

  participantsListSubscription: Subscription;
  submmited: boolean = false;

  constructor(private roomService: RoomService) {
    this.participants = [];
  }

  ngOnInit(): void {
    this.participantsListSubscription = this.roomService.participantsList$.subscribe((participants) => {
      this.participants = participants;
      this.submmited = true;
    })
  }
}
