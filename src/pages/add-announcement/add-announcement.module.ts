import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAnnouncement } from "./add-announcement";

@NgModule({
  declarations: [
    AddAnnouncement,
  ],
  imports: [
    IonicPageModule.forChild(AddAnnouncement)
  ],
  exports: [
    AddAnnouncement
  ]
})
export class AddAnnouncementModule {}
