// Ctrl + Alt + D twice to comment
// npm install --save --save-exact ionic@3.7.0 to go back to previous version
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { File } from '@ionic-native/file';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { GooglePlus } from '@ionic-native/google-plus';

import { Announcement } from "../announcement/announcement";
import { User } from "../user/user";
import { Location } from "../location/location";

import { AnnouncementService } from "../../providers/announcement-service";
import { UserService } from "../../providers/user-service";
import { LocationService } from "../../providers/location-service";
import { NotificationManager } from "../../providers/notification-manager";
import { Utils } from "../../model/utils";
import { TARGET_PHOTO_FOLDER, BASE_URI, UPLOAD_IMG_URL, DISTRICT } from "../../model/consts";
import 'rxjs/add/operator/map';
import { IDistrict } from "../../model/interfaces";
import { HomePage } from "../home-page/home-page";


declare var cordova: any;


/**
 * Generated class for the AddAnnouncement page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-announcement',
  templateUrl: 'add-announcement.html',
  providers: [AnnouncementService, UserService, LocationService, NotificationManager, GooglePlus]
})
export class AddAnnouncement {

    // Define FormBuilder /model properties
    public form                   : FormGroup;
    public announcement           : Announcement;
    public user                   : User;
    public location               : Location;
    // Flag to be used for checking whether we are adding/editing an entry
    public isEdited               : boolean = false;
    // Flag to hide the form upon successful completion of remote operation
    public hideForm               : boolean = false;
    // Property to help ste the page title
    public pageTitle              : string;
    // Property to store the recordID for when an existing entry is being edited
    public recordID               : any     = null;

    public lastImage: string = null;
    public hideBtn : boolean = true;
    public images: string[] = [];
    public imagesToDelete: string[] = [];
    public loading: Loading;
    public lastRecordID : number;
    public currentAdsID: number;
    public isNewPhoto: boolean = false;
    public district: IDistrict[] = DISTRICT;
    public selectOptions: any;


    // Initialise module classes
    

    /**
     * Creates an instance of AddAnnouncement.
     * @param {NavController} navCtrl 
     * @param {Http} http 
     * @param {NavParams} navParams 
     * @param {FormBuilder} formBuilder 
     * @param {NotificationManager} toastCtrl 
     * @param {Camera} camera 
     * @param {ActionSheetController} actionSheetCtrl 
     * @param {Platform} platform 
     * @param {LoadingController} loadingCtrl 
     * @param {FilePath} filePath 
     * @param {File} file 
     * @param {Transfer} transfer 
     * @param {SpinnerDialog} spinnerDialog 
     * 
     * @memberof AddAnnouncement
     */
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
                public transfer            : Transfer,
                public spinnerDialog       : SpinnerDialog,
                protected announcementService : AnnouncementService,
                protected userService : UserService,
                protected locationService : LocationService,
                protected googlePlus: GooglePlus)
    {
    
        this.user = {
            id: null,
            username: "",
            password:"",
            email: "", 
            telephone: ""
       };

       this.location = {
            id: null,
            city:"",
            region:""
       }

       this.announcement = {
            id: null,
            category: "",
            type: "", 
            title: "", 
            message: "", 
            price: null, 
            photo: "",
            date: "",
            city:"",
            user: this.user,
            location : this.location
       };

        // Create form builder validation rules
        this.form = formBuilder.group({
            "title"                  : ["", Validators.required],
            "message"                : ["", Validators.required],
            "price"                  : ["", Validators.required],
            "city"                   : ["", Validators.required],
            "username"               : ["", Validators.required],
            "email"                  : ["", Validators.required],
            "telephone"              : ["", Validators.required]      
            //"location"               : ["", Validators.required]
        });

        this.district = DISTRICT;

        this.selectOptions = {
            title: 'Selectionner une ville',
            //subTitle: 'Selectionner une ville',
            mode: 'md'
        };      

        if(this.images.length == 1)
            this.hideBtn = false;

    }


   /**
    * Determine whether we adding or editing a record
    * based on any supplied navigation parameters
    * 
    * @memberof AddAnnouncement
    */
   ionViewWillEnter()
   {
       //console.log(this.navParams);
      this.resetFields();

      let adsParam = this.navParams.get("record");
      
      console.log("toto11 ", adsParam);

      if(adsParam)
      {
         this.isEdited      = true;
         this.selectEntry(adsParam);
         this.pageTitle     = 'Modifier';
      }
      else
      {
         this.isEdited      = false;
         this.pageTitle     = 'Créer';
         //if(this.lastRecordID != NaN)
            //this.currentAdsID = this.lastRecordID + 1;
      }
   }


   
   


    // Assign the navigation retrieved data to properties
    // used as models on the page's HTML form
    selectEntry(item : Announcement) {
    
        this.announcement.id = this.recordID        = item.id;
        this.announcement.title                     = item.title;
        this.announcement.message                   = item.message;
        this.announcement.price                     = item.price;
        this.announcement.date                      = item.date;
        this.announcement.city                      = item.city;
        this.announcement.photo                     = item.photo;
        this.announcement.location                  = item.location;
        this.announcement.user                      = item.user;

        this.user.username                          = item.user.username;
        this.user.email                             = item.user.email;
        this.user.telephone                         = item.user.telephone;
        this.location.city                          = item.location.city;
        this.location.region                        = item.location.region;

        this.images =  this.announcement.photo != "" ? Utils.buildPhotosPath(this.announcement.photo):[];

        Utils.buildPhotosPath(item.photo).forEach(element => {
            this.imagesToDelete.push(element);
            //this.copyFileToLocalDir(TARGET_PHOTO_FOLDER + element, element, element);
        });
                
    }


    /**
     *  Save a new announcement that have been added in the form
        Use angular's http post method to submit the record data to our remote PHP server.
     * 
     * @protected
     * @param {Announcement} announcement 
     * @returns 
     * 
     * @memberof AddAnnouncement
     */
    protected addAnnouncement(announcement: Announcement) {

        if (!announcement) { return; }

        this.user.username = this.form.value.username;
        this.user.email = this.form.value.email;
        this.user.telephone = this.form.value.telephone;
        announcement.user = this.user;

        this.location.city = this.form.value.location;
        announcement.location = this.location;
    
        this.userService.create(this.user).then(user => {

            this.locationService.create(this.location).then(location => {

                announcement.photo = this.images.length != 0 ? Utils.splitImages(this.images) : "";
                announcement.user.id = parseInt(user.id);
                announcement.location.id = parseInt(location.id);
               
                this.announcementService.create(announcement).then(add => {
                    if(this.images.length != 0){
                        this.uploadImage(this.images);
                    }
                    this.hideForm   = true;
                    this.toastCtrl.sendNotification(`Annonce : ${announcement.title} ajouté avec succès!`);
                })

            })
        })     
    }

    /**
     * Update an existing announcement that has been edited in form page
     * 
     * @protected
     * @param {Announcement} announcement 
     * 
     * @memberof AddAnnouncement
     */
    protected modifyAnnouncement(announcement: Announcement) : void {

        announcement.id = this.recordID;
        announcement.photo = this.images.length != 0 ? Utils.splitImages(this.images) : "";
        this.announcementService.update(announcement).then(add => {
            if(this.images.length != 0){
                this.uploadImage(this.images);
            }
            this.hideForm  =  true;
            this.toastCtrl.sendNotification(`Annonce: ${announcement.title} modifiée avec succès`);
            
        })
    }

    /**
     * Remove announcement and related photo from server
     * 
     * @param {Announcement} announcement 
     * 
     * @memberof AddAnnouncement
     */
    public deleteAnnouncement(announcement: Announcement) : void {
        announcement.id = this.recordID;
        this.announcementService.delete(announcement).then(add => {

            let images = Utils.buildPhotosPath(announcement.photo);
            if(images && images.length > 0){
                images.forEach(elt=>{
                    this.deletePhoto(elt);
                });
                this.deletePhotoFromServer(images);
            }

            this.hideForm     = true;
            this.toastCtrl.sendNotification(`Annonce: ${announcement.title} supprimée avec succès!`);
        });
    }


    // Handle data submitted from the page's HTML form
    // Determine whether we are adding a new record or amending an
    // existing record
    public saveEntry() {

        this.announcement.title         = this.form.value.title;
        this.announcement.message       = this.form.value.message;
        this.announcement.photo         = this.form.value.photo;
        this.announcement.price         = this.form.value.price;
        this.announcement.date          = Utils.getDateToRegister();
        this.announcement.city          = this.form.value.city;
        
        if(this.isEdited){
            this.modifyAnnouncement(this.announcement);
        }
        else{
            this.addAnnouncement(this.announcement);
        }
        this.navCtrl.popToRoot();
    }


    // Clear values in the page's HTML form fields
    protected resetFields() : void {
        this.announcement.title      = "";
        this.announcement.message    = "";
        this.announcement.photo      = "";
        this.announcement.city       = "";
        this.announcement.price      = null;
        this.announcement.user       = null;
        this.announcement.location   = null;
    }


    public presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
        title: "Sectionner l'image",
        buttons: [
            {
                text: 'Prendre une photo',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.CAMERA);
                }
            },
            {
                text: 'Choisir dans la galerie',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
            {
                text: 'Cancel',
                role: 'cancel'
            }
        ]
        });
        actionSheet.present();
    }

    protected takePicture(sourceType) {
        // Create options for the Camera Dialog
        var options = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true,
            allowEdit: true,
            targetWidth: 300,
            targetHeight: 300
        };

        // Get the data of an image
        this.camera.getPicture(options).then((imagePath) => {
            // Special handling for Android library
            if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
                this.filePath.resolveNativePath(imagePath)
                .then(filePath => {
                    let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                    let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                    this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                });
            } else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            }
            this.isNewPhoto = true;
        }, (err) => {
            this.toastCtrl.sendNotification('Une erreur est survenue!');
        });
    }


    // Create a new name for the image
    protected createFileName() {
        var d = new Date(),
        n = d.getTime(),
        //imgName = "photo_annonce_"+this.currentAdsID+"_", 
        newFileName = n + ".jpg";
        return newFileName;
    }
    
    // Copy the image to a local folder
    protected copyFileToLocalDir(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
            this.lastImage = newFileName;
            this.images.push(this.lastImage);
            this.hideBtn = this.images.length == 1 ? false : true;
        }, error => {
            this.toastCtrl.sendNotification('Une erreur est survenue!');
        });
    } 
    

    // Always get the accurate path to your apps folder
    public pathForImage(img: string): string {
        
        if(img != "") {

            if(this.isEdited ) {
                this.lastImage = img;
                this.hideBtn = this.images.length == 1 ? false : true;

                return TARGET_PHOTO_FOLDER + img;    
            }
        
            return cordova.file.dataDirectory + img;
        }
        else{
            return '';
        }
    }

    

    protected uploadImage(images : string[]) {
        
        images.forEach((element)=>{
            // File for Upload
            var targetPath = this.pathForImage(element);
            
            // File name only
            var filename = element;
            
            var options = {
                fileKey: "file",
                fileName: filename,
                chunkedMode: false,
                mimeType: "multipart/form-data",
                params : {'fileName': filename}
            };
            
            this.loading = this.loadingCtrl.create({
                content: 'Uploading...',
            });
            this.loading.present();
            
            // Use the FileTransfer to upload the image
            const fileTransfer: TransferObject = this.transfer.create();
            fileTransfer.upload(targetPath, UPLOAD_IMG_URL, options).then(data => {
                this.loading.dismissAll()
                //this.sendNotification('Image succesful uploaded.');
            }, err => {
                this.loading.dismissAll()
                this.toastCtrl.sendNotification('Erreur lors du chargement...');
            });
        })
    }


    protected downloadImage(img : string){

        if(img != ""){

            var targetPath = this.file.dataDirectory + img;

            const fileTransfer: TransferObject = this.transfer.create();
            fileTransfer.download(TARGET_PHOTO_FOLDER, targetPath , true).then(data =>{
                console.log('download complete: ' + data.toURL());
            }, err =>{
                this.toastCtrl.sendNotification('Erreur lors du téléchargement');
            });
        }
    }
    

    /**
     * Deletes photos from form
     * 
     * @param {string} img 
     * 
     * @memberof AddAnnouncement
     */
    public deletePhoto(img : string) : void{
        
        let imgToDel = [];
        let index = this.images.indexOf(img);

        if(this.isEdited){
            if(this.imagesToDelete!=null && this.imagesToDelete.length !=0){
                this.imagesToDelete.forEach(element => {
                    if(element == img) 
                        imgToDel.push(img);
                });
                //this.deletePhotoFromServer(imgToDel);
            }
            
        }
        
        if (index > -1) {
            this.images.splice(index, 1);
        }

        if(this.images.length == 0)
            this.lastImage = null;
        
        this.hideBtn = this.images.length == 1 ? false : true;
    }


    /**
     * Deletes images from server upload folder
     * 
     * @protected
     * @param {string[]} img 
     * @returns {Promise<string>} 
     * 
     * @memberof AddAnnouncement
     */
    protected deletePhotoFromServer(img : string[]) : Promise<string> {

        //let img
        let photoToDelete = Utils.splitImages(img);
        return new Promise(resolve =>{

            let
            body       : string    = "key=deletephotos&photos="+photoToDelete,
            type       : string = "application/x-www-form-urlencoded; charset=UTF-8",
            headers    : any    = new Headers({ 'Content-Type': type}),
            options    : any    = new RequestOptions({ headers: headers }),
            url        : any    = BASE_URI + "/manage-data.php";

            this.http.post(url, body, options)
            .subscribe(data => {
                // If the request was successful notify the user
                if(data.status === 200)
                {
                    resolve(photoToDelete);
                }
                // Otherwise let 'em know anyway
                else
                {
                    this.toastCtrl.sendNotification('Une erreur est survenue!');
                }
            });
        })    
    }

}
