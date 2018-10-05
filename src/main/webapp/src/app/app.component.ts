import { Component } from '@angular/core';
import {Participant} from "./shared/participant";
import {RoomService} from "./shared/room.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  participants: Participant[];

  constructor(private roomService: RoomService) {}
}
