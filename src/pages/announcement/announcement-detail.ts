import { Component, Input }             from '@angular/core';
import { NavController, NavParams } from "ionic-angular";
import { Announcement } from "./announcement";

@Component({
  selector: 'announcement-detail',
  templateUrl: 'announcement-detail.html'
})
export class AnnouncementDetail{
    
    @Input() announcement : Announcement;
    selectedAnnouncement : any;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
      // If we navigated to this page, we will have an item available as a nav param
      //this.selectedAnnouncement = navParams.get('announcement');
      //console.log(this.selectedAnnouncement);
    }
}