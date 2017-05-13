import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { File } from '@ionic-native/file';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { SpinnerDialog } from '@ionic-native/spinner-dialog';

import { Announcement } from "../announcement/announcement";

import 'rxjs/add/operator/map';


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
})
export class AddAnnouncement {

  // Define FormBuilder /model properties
  public form                   : FormGroup;
  public announcementTitle      : any;
  public announcementMessage    : any;
  public announcementPhoto      : string;
  public announcement           : Announcement;
  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited               : boolean = false;
  // Flag to hide the form upon successful completion of remote operation
  public hideForm               : boolean = false;
  // Property to help ste the page title
  public pageTitle              : string;
  // Property to store the recordID for when an existing entry is being edited
  public recordID               : any     = null;
  private baseURI               : string  = "http://www.manasse-yawo.com/azea-cervo/";
  private targetFolder          : string  = this.baseURI+"uploads/";
  // Destination URL
  private uploadURL             : string  = "http://www.manasse-yawo.com/azea-cervo/upload.php";

  private lastImage: string = null;
  private hideBtn : boolean = true;
  private images: string[] = [];
  private loading: Loading;
  private lastRecordID : number;
  private currentAdsID: number;


  // Initialise module classes
   constructor(public navCtrl           : NavController,
               public http              : Http,
               public navParams         : NavParams,
               public formBuilder       : FormBuilder,
               public toastCtrl         : ToastController,
               public camera            : Camera,
               public actionSheetCtrl   : ActionSheetController, 
               public platform          : Platform, 
               public loadingCtrl       : LoadingController, 
               public filePath          : FilePath, 
               public file              : File,
               private transfer         : Transfer,
               private spinnerDialog    : SpinnerDialog)
   {
       this.announcement = {
            id: null,
            category: "",
            type: "", 
            title: "", 
            message: "", 
            price: null, 
            photo: "",
            date: ""
       };

        // Create form builder validation rules
        this.form = formBuilder.group({
            "title"                  : ["", Validators.required],
            "message"                : ["", Validators.required],
            "price"                  : [""]
        });

        if(this.images.length == 1)
            this.hideBtn = false;
   }


   // Determine whether we adding or editing a record
   // based on any supplied navigation parameters
   ionViewWillEnter()
   {
       //console.log(this.navParams);
      this.resetFields();

      if(this.navParams.get("record"))
      {
         this.isEdited      = true;
         this.selectEntry(this.navParams.get("record"));
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
    selectEntry(item){
        let tmpImg = [];
        this.announcement.id = this.recordID        = item.id;
        this.announcement.title                     = item.title;
        this.announcement.message                   = item.message;
        this.announcement.price                     = item.price;
        this.announcement.date                      = item.date;
        this.announcement.photo                     = item.photo;

    
        this.images =  this.announcement.photo != "" ? this.splitImageString(this.announcement.photo):[];
        /*if(tmpImg && tmpImg.length <= 2){
            for (var i = 0; i < tmpImg.length; i++) {
                this.images[i] = this.targetFolder + tmpImg[i];
            }
        }
        else{
            this.images = [];
        }*/
                
    }


   // Save a new record that has been added to the page's HTML form
   // Use angular's http post method to submit the record data
   // to our remote PHP script (note the body variable we have created which
   // supplies a variable of key with a value of create followed by the key/value pairs
   // for the record data
   createEntry(announcement: Announcement){
    
        if(this.images.length != 0){
            announcement.photo = this.images.join();
            for(var i=0; i<= this.images.length; i++){
                this.uploadImage(this.images[i]);
            }
        }
        else{
            announcement.photo = "";
        }

        let body     : string   = "key=create&title=" + announcement.title + "&message=" + announcement.message + "&price=" + announcement.price + "&date=" + announcement.date + "&photo=" + announcement.photo,
            type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
            headers  : any      = new Headers({ 'Content-Type': type}),
            options  : any      = new RequestOptions({ headers: headers }),
            url      : any      = this.baseURI + "manage-data.php";

        this.http.post(url, body, options)
        .subscribe((data) =>
        {
            // If the request was successful notify the user
            if(data.status === 200)
            {
                this.hideForm   = true;
                this.sendNotification(`Congratulations the technology: ${announcement.title} was successfully added`);
            }
            // Otherwise let 'em know anyway
            else
            {
                this.sendNotification('Something went wrong!');
            }
        });
   }



    // Update an existing record that has been edited in the page's HTML form
    // Use angular's http post method to submit the record data
    // to our remote PHP script (note the body variable we have created which
    // supplies a variable of key with a value of update followed by the key/value pairs
    // for the record data
    updateEntry(announcement : Announcement)
    {
        announcement.id = this.recordID;
        let body       : string = "key=update&title=" + announcement.title + "&message=" + announcement.message + "&price=" + announcement.price + "&date=" + announcement.date + "&recordID=" + announcement.id,
          type       : string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers    : any     = new Headers({ 'Content-Type': type}),
          options    : any     = new RequestOptions({ headers: headers }),
          url        : any     = this.baseURI + "manage-data.php";

      this.http.post(url, body, options)
      .subscribe(data =>
      {
         // If the request was successful notify the user
         if(data.status === 200)
         {
            this.hideForm  =  true;
            this.sendNotification(`Congratulations the technology: ${announcement.title} was successfully updated`);
         }
         // Otherwise let 'em know anyway
         else
         {
            this.sendNotification('Something went wrong!');
         }
      });
   }


    // Handle data submitted from the page's HTML form
    // Determine whether we are adding a new record or amending an
    // existing record
    saveEntry()
    {
        
        this.announcement = this.form.value;
        this.announcement.date = this.getDateToRegister();

        if(this.isEdited){
            //console.log(this.announcement);
            this.updateEntry(this.announcement);
        }
        else{
            this.createEntry(this.announcement);
        }
    }


   // Remove an existing record that has been selected in the page's HTML form
   // Use angular's http post method to submit the record data
   // to our remote PHP script (note the body variable we have created which
   // supplies a variable of key with a value of delete followed by the key/value pairs
   // for the record ID we want to remove from the remote database
   deleteEntry()
   {
      let title       : string = this.form.controls["title"].value,
          body       : string    = "key=delete&recordID=" + this.recordID,
          type       : string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers    : any    = new Headers({ 'Content-Type': type}),
          options    : any    = new RequestOptions({ headers: headers }),
          url        : any    = this.baseURI + "manage-data.php";

      this.http.post(url, body, options)
      .subscribe(data =>
      {
         // If the request was successful notify the user
         if(data.status === 200)
         {
            this.hideForm     = true;
            this.sendNotification(`Congratulations the technology: ${title} was successfully deleted`);
         }
         // Otherwise let 'em know anyway
         else
         {
            this.sendNotification('Something went wrong!');
         }
      });
   }


    // Clear values in the page's HTML form fields
    resetFields() : void
    {
        this.announcement.title      = "";
        this.announcement.message    = "";
        this.announcement.photo      = "";
        this.announcement.price     = null;
    }


    // Manage notifying the user of the outcome
    // of remote operations
    private sendNotification(message)  : void {

        let notification = this.toastCtrl.create({
            message       : message,
            duration      : 3000,
            position: 'top'
        });
        notification.present();
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

    public takePicture(sourceType) {
        // Create options for the Camera Dialog
        var options = {
            quality: 50,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: false,
            allowEdit: true,
            targetWidth: 250,
            targetHeight: 250
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
        }, (err) => {
            this.sendNotification('Error while selecting image.');
        });
    }


    // Create a new name for the image
    private createFileName() {
        var d = new Date(),
        n = d.getTime(),
        //imgName = "photo_annonce_"+this.currentAdsID+"_", 
        newFileName = n + ".jpg";
        return newFileName;
    }
    
    // Copy the image to a local folder
    private copyFileToLocalDir(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
            this.lastImage = newFileName;
            this.images.push(this.lastImage);
            this.hideBtn = this.images.length == 1 ? false : true;
        }, error => {
            this.sendNotification('Error while storing file.');
        });
    }
 
    
    // Always get the accurate path to your apps folder
    public pathForImage(img) {
        
        if(this.isEdited){
            //this.images = [];
            this.lastImage = img;
            this.hideBtn = this.images.length == 1 ? false : true;
            return img !== null ? this.targetFolder + img : '';
            
        }
        else{
           return img !== null ? cordova.file.dataDirectory + img : '';
        }
    }


    public uploadImage(img : string) {
        
        // File for Upload
        var targetPath = this.pathForImage(img);
        
        // File name only
        var filename = img;
        
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
        fileTransfer.upload(targetPath, this.uploadURL, options).then(data => {
            this.loading.dismissAll()
            //this.sendNotification('Image succesful uploaded.');
        }, err => {
            this.loading.dismissAll()
            this.sendNotification('Error while uploading file.');
        });
    }

    public deletePhoto(img){

        var index = this.images.indexOf(img);
        if (index > -1) {
            this.images.splice(index, 1);
        }

        if(this.images.length == 0)
            this.lastImage = null;
        
        this.hideBtn = this.images.length == 1 ? false : true;
            
    }


    /**
     *  Converts current date to format YYYY-MM-DD hh:mm:ss to register into the database
     */
    private getDateToRegister() {
        let dateNow = new Date().toISOString(); // Date is converted to the following format 2017-05-08T17:13:24.852Z format
        let parts = dateNow.split('.')[0].split('T').join(' ');
      
        return parts;
	}


    /**
     * Split images string get from database into an array if there are many.
     */
    private splitImageString(img: string) : string[]{
        let images : string[] = [];
        if(img.indexOf(",") != -1){
            images = img.split(",");
        } 
        else{
            images[0] = img;
        }

        return images;
    }

}
