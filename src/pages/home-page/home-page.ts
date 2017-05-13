import { Component, ViewChild } from '@angular/core';
import { Offers } from '../offers/offers-page';
import { Requests } from '../requests/requests-page';
import { AnnouncementComponent } from '../announcement/announcement.component';
import { ModalController, Tabs, NavController, NavParams } from "ionic-angular";
import { Http } from '@angular/http';
import _ from "lodash";
import 'rxjs/add/operator/map';

@Component({
  selector: 'home-page',
  templateUrl: 'home-page.html'
})
export class HomePage{

  private lastRecordParam: any;

  public items : any = [];
   constructor(public navCtrl: NavController,
               public http   : Http)
   {
   }


   ionViewWillEnter()
   {
      this.load();
   }

   // Retrieve the JSON encoded data from the remote server
   // Using Angular's Http class and an Observable - then
   // assign this to the items array for rendering to the HTML template
   load()
   {
      this.http.get('http://www.manasse-yawo.com/azea-cervo/retrieve-data.php')
      .map(res => res.json())
      .subscribe(data =>
      {
         this.items = data;
      });
   }

   // Allow navigation to the AddTechnology page for creating a new entry
   addEntry()
   {
      let lastRecord = {};
      lastRecord = _.maxBy(this.items, 'id'); // Return object containing the last max ID
      this.lastRecordParam = lastRecord != undefined ? lastRecord : {id : 0};
      this.navCtrl.push('AddAnnouncement', this.lastRecordParam);
   }


   // Allow navigation to the AddTechnology page for amending an existing entry
   // (We supply the actual record to be amended, as this method's parameter,
   // to the AddTechnology page
   viewEntry(param)
   {
      this.navCtrl.push('AddAnnouncement', param);
   }





  /*@ViewChild('myTabs') tabRef: Tabs;

  tabOffers : any;
  tabRequests : any;
  tabHome : any;

  public homeParams = {
    pageName: "home"
  };

  public offerParams = {
    pageName: "offers",
    district: "maritime"
  };

  public requestParams = {
    pageName: "requests"
  };

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams) {
    this.tabOffers = Offers;
    this.tabRequests = Requests;
    this.tabHome = AnnouncementComponent;
  }

  // Allow navigation to the AddAnouncement page for creating a new entry
  public addEntry(){
      this.navCtrl.push('AddAnnouncement');
  }*/

}
