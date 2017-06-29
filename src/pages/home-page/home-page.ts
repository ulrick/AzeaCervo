import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, Tabs, NavController, NavParams, ToastController } from "ionic-angular";
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
import { NetworkManager } from "../../providers/network-manager";
import { SpinnerDialog } from "@ionic-native/spinner-dialog";


@Component({
  selector: 'home-page',
  templateUrl: 'home-page.html',
  providers: [AnnouncementService, NetworkManager]
})
export class HomePage implements OnInit, IHomePage {
    
    private announcementsBackup: Announcement[];
    private lastRecordParam: any;
    private announcements: Announcement[];
    private ads = {};
    private adsTemp: any = {};

    constructor(public navCtrl: NavController,
                public http   : Http,
                private announcementService : AnnouncementService,
                private network : NetworkManager,
                private spinnerDialog : SpinnerDialog) {
    }

    ngOnInit(): void {
        //this.getAnnouncements();
    }

    ionViewDidEnter(){
        this.network.onConnect();

        if(this.announcements.length == 0){
            this.getAnnouncements();
        }
        this.network.onDisconnect();
        //this.network.onChange();
    }

    ionViewWillEnter() {
        this.getAnnouncements();
    }

    public getAnnouncements(): void {
      if(this.network.isConnected()){
        this.announcementService.read().then(
            data => {       
                data.forEach(element => {
                    element.imgThumb = Utils.buildPhotoPathThumb(element.photo);
                });
                
                this.announcements = data;
                this.announcementsBackup = data;
            });
      }
      else{
        this.offlineGetAnnouncements();
      }
    }

    private offlineGetAnnouncements(){

        if(this.announcementsBackup.length  > 0){
                this.announcements = this.announcementsBackup;
                this.network.onDisconnect();
        }
        else{
            this.network.onDisconnect();
        }
    }

    public addAnnouncement(): void {
        let lastRecord = {};
        lastRecord = _.maxBy(this.announcements, 'id'); // Return object containing the last max ID
        this.lastRecordParam = lastRecord != undefined ? lastRecord : {id : 0};
        this.navCtrl.push('AddAnnouncement', this.lastRecordParam);
    }


    public showAnnouncementDetail(param): void {
        this.navCtrl.push('AnnouncementDetail', param);
    }

    public doRefresh(refresher) {

        setTimeout(() => {
            this.getAnnouncements();
            refresher.complete();
        }, 1000);
    }
}
