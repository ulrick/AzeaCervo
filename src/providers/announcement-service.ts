import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


import { Announcement } from "../pages/announcement/announcement";
import { BASE_URI } from "../model/consts";
import { SpinnerDialog } from "@ionic-native/spinner-dialog";

/*
  Generated class for the AnnouncementService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AnnouncementService {

  private announcements: Announcement[] = [];
  private getDataUrl = BASE_URI + "/retrieve-data.php";

  constructor(public http: Http, private spinnerDialog : SpinnerDialog) {
    //this.getAnnouncements();
  }

  public getAnnouncements(): Promise<Announcement[]>{

    if(this.announcements){
      // Already loaded data?
      //return Promise.resolve(this.announcements);
    }
    this.spinnerDialog.show("", "chargements...");
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http.get(this.getDataUrl)
        .map(res => res.json())
        .subscribe(data =>{
          this.announcements = data;
          //resolve(this.announcements);
          // Simulate latency with 2 second delay
          
          setTimeout(() => {
            resolve(this.announcements);
          }, 1000);
          this.spinnerDialog.hide();
        });
    });
  }

}
