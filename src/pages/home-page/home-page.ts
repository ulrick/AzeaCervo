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
import { IAnnouncementService, IHomePage } from "../../model/interfaces";
import { TARGET_PHOTO_FOLDER } from "../../model/consts";
import { Utils } from "../../model/utils";


@Component({
  selector: 'home-page',
  templateUrl: 'home-page.html',
  providers: [AnnouncementService]
})
export class HomePage implements OnInit, IAnnouncementService, IHomePage {

    private lastRecordParam: any;
    private announcements: Announcement[];
    private ads = {};
    private adsTemp: any = {};

    constructor(public navCtrl: NavController,
                public http   : Http,
                private announcementService : AnnouncementService){
    }

    ngOnInit(): void {
        //this.getAnnouncements();
    }

    ionViewWillEnter(){
        this.getAnnouncements();
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
                
            }
        );
    }

    public addAnnouncement(): void {
        let lastRecord = {};
        lastRecord = _.maxBy(this.announcements, 'id'); // Return object containing the last max ID
        this.lastRecordParam = lastRecord != undefined ? lastRecord : {id : 0};
        this.navCtrl.push('AddAnnouncement', this.lastRecordParam);
    }


    public showAnnouncements(param): void {
        //this.navCtrl.push('AddAnnouncement', param);
        this.navCtrl.push('AnnouncementDetail', param);
    }

    public doRefresh(refresher) {

        setTimeout(() => {
            this.getAnnouncements();
            refresher.complete();
        }, 1000);
    }
}
