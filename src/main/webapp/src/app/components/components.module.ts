import {NgModule} from '@angular/core';
import {ParticipantMediaComponent} from "./participant-media/participant-media.component";
import {SharedModule} from "../shared/shared.module";
import { JoinRoomFormComponent } from './join-room-form/join-room-form.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [ParticipantMediaComponent, JoinRoomFormComponent],
  exports: [ParticipantMediaComponent, JoinRoomFormComponent]

})
export class ComponentsModule { }
