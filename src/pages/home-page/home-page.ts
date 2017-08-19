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
import { NetworkManager } from "../../providers/network-manager";
import { SpinnerDialog } from "@ionic-native/spinner-dialog";
import { NotificationManager } from "../../providers/notification-manager";
import { User } from "../user/user";
import { Location } from "../location/location";
import { UserService } from "../../providers/user-service";
import { LocationService } from "../../providers/location-service";


@Component({
  selector: 'home-page',
  templateUrl: 'home-page.html',
  providers: [AnnouncementService, NetworkManager, NotificationManager]
})
export class HomePage implements OnInit, IHomePage {

    private announcementsBackup: Announcement[];
    private lastRecordParam: any;
    private announcements: Announcement[];
    private users: User[];
    private locations: Location[];
    private ads : any[];

    constructor(public navCtrl: NavController,
                public http   : Http,
                private announcementService : AnnouncementService,
                private userService : UserService,
                private locationService : LocationService,
                private network : NetworkManager,
                private spinnerDialog : SpinnerDialog) {
    }

    ngOnInit(): void {
        //this.getAnnouncements();
    }

    ionViewDidEnter() {
        this.network.onConnect();
        this.network.onDisconnect();
        //this.network.onChange();
    }

    ionViewWillEnter() {
        this.getAnnouncements();
    }

    public getAnnouncements(): void {
        if(this.network.isConnected()){
            this.spinnerDialog.show("", "Chargements des données...");
            
            this.announcementService.read().then(
                data => {       
                    data.forEach(element => {
                        let user : User = {id : null, username:"", email : "", telephone : ""};
                        let location : Location = {id : null, city:"", region : ""};

                        element.imgThumb = element.photo != "" ? Utils.buildPhotoPathThumb(element.photo) : "img/default-thumb.png";

                        user.username = element.username;
                        user.email = element.email;
                        user.telephone = element.telephone;
                        location.city = element.city;
                        location.region = element.region;

                        element.user = user;
                        element.location = location;
                    });
                    
                    this.announcements = data;
                    this.announcementsBackup = data;
                    this.spinnerDialog.hide();
                });
        }
        else{
            this.offlineGetAnnouncements();
        }
    }

    private offlineGetAnnouncements() : void{

        if(this.announcementsBackup.length  > 0){
                this.announcements = this.announcementsBackup;
                this.network.onDisconnect();
        }
        else{
            this.network.onDisconnect();
        }
    }

    public getUsers(): void {
        if(this.network.isConnected()){
        //this.spinnerDialog.show("", "Chargements des données...");
        this.userService.read().then(
            data => {        
                this.users = data;
                console.log("Users ",this.users);
                //this.announcementsBackup = data;
                this.spinnerDialog.hide();
            }
        );
            
      }
      else{
        //this.offlineGetAnnouncements();
      }
    }

    public addAnnouncement(): void {
        let lastRecord = {};
        lastRecord = _.maxBy(this.announcements, 'id'); // Return object containing the last max ID
        this.lastRecordParam = lastRecord != undefined ? lastRecord : {id : 0};
        this.navCtrl.push('AddAnnouncement', this.lastRecordParam); //Go to add announcement page
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
