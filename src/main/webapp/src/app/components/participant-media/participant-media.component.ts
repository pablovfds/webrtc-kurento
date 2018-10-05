import {Component, Input, OnInit} from '@angular/core';
import {Participant} from "../../shared/participant";

@Component({
  selector: 'app-participant-media',
  templateUrl: './participant-media.component.html',
  styleUrls: ['./participant-media.component.css']
})
export class ParticipantMediaComponent implements OnInit {

  @Input() participant: Participant;

  constructor() { }

  ngOnInit() {
  }

}
