import {NgModule} from '@angular/core';
import {ParticipantMediaComponent} from "./participant-media/participant-media.component";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [ParticipantMediaComponent],
  exports: [ParticipantMediaComponent]

})
export class ComponentsModule { }
