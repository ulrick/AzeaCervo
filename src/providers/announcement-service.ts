import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


import { Announcement } from "../pages/announcement/announcement";
import { BASE_URI } from "../model/consts";
import { SpinnerDialog } from "@ionic-native/spinner-dialog";
import { IAnnouncementService } from "../model/interfaces";
import { ToastController } from "ionic-angular";
import { NotificationManager } from "./notification-manager";

/*
  Generated class for the AnnouncementService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AnnouncementService implements IAnnouncementService{

  private announcements: Announcement[] = [];
  //private dataUrl = BASE_URI + "/retrieve-data.php";
  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});

  constructor(public http: Http, private spinnerDialog : SpinnerDialog, public toastCtrl: NotificationManager) {
  }


  /**
   * Add new announcement into the database
   * 
   * @param {Announcement} announcement
   * @returns {Promise<Announcement>} 
   * 
   * @memberof AnnouncementService
   */
  public create(announcement : Announcement) : Promise<Announcement>{

    let body     : string   = "key=create&title=" + announcement.title + "&message=" + announcement.message + "&price=" + announcement.price + "&date=" + announcement.date + "&city=" + announcement.city + "&photo=" + announcement.photo + "&user=" + announcement.user.id+ "&location=" + announcement.location.id;
    return this.http
      .post(BASE_URI + "/manage-data.php", body, {headers: this.headers})
      .toPromise()
      .then(res => res.json().data as Announcement)
      .catch(this.handleError);
  }


  /**
   * Gets and renders announcement from remote server
   * 
   * @returns {Promise<Announcement[]>}
   * 
   * @memberof AnnouncementService
   */
  public read(): Promise<any> {

    //this.spinnerDialog.show("", "Chargements des données...");
    return new Promise(resolve => {
      this.http.get(BASE_URI + "/retrieve-data.php")
        .map(res => res.json())
        .subscribe(data =>{
          this.announcements = data;
          setTimeout(() => {
            resolve(this.announcements);
            this.spinnerDialog.hide();
          }, 1000);
        });
    }).catch(error => {
      this.handleError("Une erreur s'est produite. Vérifier la connexion!");
      this.spinnerDialog.hide();
    });
  }


  /**
   * Update announcement service
   * 
   * @param {Announcement} announcement 
   * @returns {Promise<Announcement>} 
   * 
   * @memberof AnnouncementService
   */
  public update(announcement: Announcement): Promise<Announcement> {
    
    let body       : string  = "key=update&title=" + announcement.title + "&message=" + announcement.message + "&price=" + announcement.price + "&date=" + announcement.date + "&city=" + announcement.city + "&recordID=" + announcement.id + "&photo=" + announcement.photo;
    return this.http
      .post(BASE_URI + "/manage-data.php", body, {headers: this.headers})
      .toPromise()
      .then(res => res.json().data as Announcement)
      .catch(this.handleError);
  }


  /**
   * Remove announcement from server
   * 
   * @param {Announcement} announcement 
   * @returns {Promise<Announcement>} 
   * 
   * @memberof AnnouncementService
   */
  public delete(announcement: Announcement): Promise<Announcement> {
    
    let body       : string    = "key=delete&recordID=" + announcement.id;

    return this.http
      .post(BASE_URI + "/manage-data.php", body, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }


  private handleError(error: any = "Une erreur est survenue!"): Promise<any> {
    //let notification = this.toastCtrl.sendNotification(error);
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
