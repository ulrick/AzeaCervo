// Ctrl + Alt + D twice to comment
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, LoadingController, Loading } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { File } from '@ionic-native/file';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { SpinnerDialog } from '@ionic-native/spinner-dialog';

import { Announcement } from "../announcement/announcement";

import 'rxjs/add/operator/map';
import { AnnouncementService } from "../../providers/announcement-service";
import { Utils } from "../../model/utils";
import { TARGET_PHOTO_FOLDER } from "../../model/consts";
import { AddAnnouncement } from "../add-announcement/add-announcement";
import { NotificationManager } from "../../providers/notification-manager";
import { UserService } from "../../providers/user-service";
import { LocationService } from "../../providers/location-service";


declare var cordova: any;


/**
 * Generated class for the AddAnnouncement page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'announcement-detail',
  templateUrl: 'announcement-detail.html'
})
export class AnnouncementDetail extends AddAnnouncement {

    // Initialise module classes
    constructor(
                public navCtrl              : NavController,
                public http                 : Http,
                public navParams            : NavParams,
                public formBuilder          : FormBuilder,
                public toastCtrl            : NotificationManager,
                public camera               : Camera,
                public actionSheetCtrl      : ActionSheetController, 
                public platform             : Platform, 
                public loadingCtrl          : LoadingController,
                public filePath             : FilePath, 
                public file                 : File,
                public transfer             : Transfer,
                public spinnerDialog        : SpinnerDialog,
                protected announcementService : AnnouncementService,
                protected userService : UserService,
                protected locationService : LocationService
          )
    {
      super( navCtrl, http, navParams, formBuilder, toastCtrl, camera, actionSheetCtrl, platform, loadingCtrl, filePath, file, transfer, spinnerDialog, announcementService, userService, locationService);
    }

    public editAnnouncement(announcement): void {

      //announcement.user = this.user;
      //this.user.username = announcement.username;
      
      this.navCtrl.push('AddAnnouncement', announcement);
      console.log("param ", announcement);
        
    }

}
