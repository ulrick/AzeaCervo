import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ToastController } from "ionic-angular";
import 'rxjs/add/operator/map';

/*
  Generated class for the NotificationManager provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NotificationManager {

  constructor(public http: Http, private toastCtrl: ToastController) {
    console.log('Hello NotificationManager Provider');
  }

  // Manage notifying the user of the outcome
  // of remote operations
  public sendNotification(message)  : void {

      let notification = this.toastCtrl.create({
          message       : message,
          duration      : 3000,
          position: 'bottom'
      });
      notification.present();
  }

}
