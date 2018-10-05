import { Component, OnInit } from '@angular/core';
import {RoomService} from "../../shared/room/room.service";

@Component({
  selector: 'app-join-room-form',
  templateUrl: './join-room-form.component.html',
  styleUrls: ['./join-room-form.component.css']
})
export class JoinRoomFormComponent {

  model = {
    name: '',
    roomName: ''
  };

  constructor(private roomService: RoomService) { }

  onSubmit() {
    this.roomService.register(this.model.name, this.model.roomName);
  }

}
