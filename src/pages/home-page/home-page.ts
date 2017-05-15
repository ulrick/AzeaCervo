import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, Tabs, NavController, NavParams } from "ionic-angular";
import { Http } from '@angular/http';
import _ from "lodash";

//import { Offers } from '../offers/offers-page';
//import { Requests } from '../requests/requests-page';
import { AnnouncementComponent } from '../announcement/announcement.component';
import { Announcement } from "../announcement/announcement";
import 'rxjs/add/operator/map';
import { AnnouncementService } from "../../providers/announcement-service";
import { IAnnouncementService } from "../../model/interfaces";
import { TARGET_PHOTO_FOLDER } from "../../model/consts";
import { Utils } from "../../model/utils";


@Component({
  selector: 'home-page',
  templateUrl: 'home-page.html',
  providers: [AnnouncementService]
})
export class HomePage implements OnInit, IAnnouncementService {

    private lastRecordParam: any;
    private announcements: Announcement[];
    private ads = {};
    private adsTemp: any = {};

    constructor(public navCtrl: NavController,
                public http   : Http,
                private announcementService : AnnouncementService){
        //this.getAnnouncements();
    }

    ngOnInit(): void {
        //this.getAnnouncements();
    }

    public getAnnouncements(): void{
        this.announcementService.getAnnouncements().then(
            data => {

                data.forEach(element => {
                    
                    let photoTemp = Utils.buildPhotoPathThumb(element.photo);
                    element.imgThumb = photoTemp;
                    //this.adsTemp.thumbnail = photoTemp;
                    //data = element;
                });
                this.announcements = data;
                console.log("tata ",data);
                
            }
        );
    }


    ionViewWillEnter(){
        this.getAnnouncements();
    }

    // Allow navigation to the AddTechnology page for creating a new entry
    addEntry(){
        let lastRecord = {};
        lastRecord = _.maxBy(this.announcements, 'id'); // Return object containing the last max ID
        this.lastRecordParam = lastRecord != undefined ? lastRecord : {id : 0};
        this.navCtrl.push('AddAnnouncement', this.lastRecordParam);
    }


    // Allow navigation to the AddTechnology page for amending an existing entry
    // (We supply the actual record to be amended, as this method's parameter,
    // to the AddTechnology page
    viewEntry(param){
        this.navCtrl.push('AddAnnouncement', param);
    }
}
