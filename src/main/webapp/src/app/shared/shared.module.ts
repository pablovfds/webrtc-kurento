import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RoomService} from "./room.service";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [],
  providers: [RoomService]
})
export class SharedModule { }
