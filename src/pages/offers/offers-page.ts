import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';
import { Http }               from '@angular/http';

import { AnnouncementComponent } from '../announcement/announcement.component';
import { IAnnouncement } from "../../model/interfaces";
import { ADS } from "../../model/consts";
import { Announcement } from '../announcement/announcement';
import { Requests } from "../requests/requests-page";
import { AnnouncementDetail } from "../announcement/announcement-detail";

/*const ADS: Announcement[] = [
  { id: 1, category: 'Mr. Nice', type: 'offers', title: 'Robe style asiatique', message: 'Je vends une robe asiatique en bon état', price: 10, date: 'Mr. Nice', photo: 'Mr. Nice'  }
];*/


@Component({
  selector: 'offers-page',
  templateUrl: 'offers-page.html'
})
export class Offers extends AnnouncementComponent {

  public offersAds: Announcement[] = ADS;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public http : Http) {
    super(navCtrl, navParams, http);
    
    console.log("new here params offer ", this.navParams.data);
    let pageName = this.navParams.get("pageName");
    let district = this.navParams.get("district");


    //console.log("page en cours ", pageName, district);

    //console.log("new tabs ", navCtrl.parent);
    //this.navParams.data = {"id":"001"}

    //this.tab = this.navCtrl.parent;
    //let id = navParams.get('id');
    //let name = navParams.get('pageName');

    //console.log(this.navCtrl.id);
    //console.log("page en cours ", name);
  }

  public getOffersAds():Promise<Announcement[]>{

    return Promise.resolve(this.offersAds);
    //return this.offersAds;
  }

  public onSelect(event: any, announcement: Announcement): void {
    
    this.navCtrl.push(AnnouncementDetail, {
        //announcement: announcement
    });
    this.selectedAnnouncement = announcement;
  }

}