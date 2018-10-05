import { Component, OnInit } from '@angular/core';
import {RoomService} from "../../shared/room.service";

@Component({
  selector: 'app-join-room-form',
  templateUrl: './join-room-form.component.html',
  styleUrls: ['./join-room-form.component.css']
})
export class JoinRoomFormComponent implements OnInit {

  model = {
    name: '',
    roomName: ''
  }

  constructor(private roomService: RoomService) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.model)
    this.roomService.register(this.model.name, this.model.roomName);
  }

}
