import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { ILocationService } from "../model/interfaces";
import { Location } from "../pages/location/location";
import { SpinnerDialog } from "@ionic-native/spinner-dialog";
import { BASE_URI } from "../model/consts";

/*
  Generated class for the LocationService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocationService implements ILocationService{

  private location: Location[] = [];
  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});

  constructor(public http: Http, private spinnerDialog : SpinnerDialog) {
    console.log('Hello LocationService Provider');
  }


  /**
   * Add new location into the database
   * 
   * @param {Location} location 
   * @returns {Promise<any>} 
   * 
   * @memberof LocationService
   */
  create(location: Location): Promise<any> {
    let locationInfo = {id: "", notification:""};
    let body     : string   = "key=create&city=" + location.city + "&region=" + location.region;
    return new Promise(resolve => {
      this.http.post(BASE_URI + "/manage-location.php", body, {headers: this.headers})
      .map(res => res.json())
      .subscribe(data =>{
        locationInfo.id = data.locationId;
        locationInfo.notification = data.message;
        resolve(locationInfo);
      });
    }).catch(this.handleError);
  }


  read(): Promise<Location[]> {
    throw new Error("Method not implemented.");
  }
  update(location: Location): Promise<Location> {
    throw new Error("Method not implemented.");
  }
  delete(location: Location): Promise<Location> {
    throw new Error("Method not implemented.");
  }

  private handleError(error: any = "Une erreur est survenue!"): Promise<any> {
    //let notification = this.toastCtrl.sendNotification(error);
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
