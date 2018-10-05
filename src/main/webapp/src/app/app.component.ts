import {Component, OnDestroy, OnInit} from '@angular/core';
import {Participant} from './shared/participant/participant';
import {RoomService} from './shared/room/room.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  submitted = false;

  participantsListSubscription: Subscription;
  participantsList: Participant[];

  constructor(private roomService: RoomService) {
    this.participantsList = [];
  }

  ngOnInit() {
    this.participantsListSubscription = this.roomService
      .participantsList$.subscribe((participants) => {
        this.participantsList = participants;
        this.submitted = true;
      });
  }

  ngOnDestroy() {
    this.participantsListSubscription.unsubscribe();
  }
}
