import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.model)
  }

}
