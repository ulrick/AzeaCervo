import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { User } from "../pages/user/user";
import { BASE_URI } from "../model/consts";
import { SpinnerDialog } from "@ionic-native/spinner-dialog";
import { IUserService } from "../model/interfaces";
import { ToastController } from "ionic-angular";


/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService implements IUserService{
  

  private users: User[] = [];
  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});

  constructor(public http: Http, private spinnerDialog : SpinnerDialog) {
  }


  /**
   * Add new user into the database
   * 
   * @param {User} user 
   * @returns {Promise<User>}
   * 
   * @memberof UserService
   */
  public create(user : User) : Promise<any>{
    let userInfo = {id: "", notification:""};
    let body     : string   = "key=create&username=" + user.username + "&password=" + user.password + "&email=" + user.email + "&telephone=" + user.telephone;
    return new Promise(resolve => {
      this.http.post(BASE_URI + "/manage-user.php", body, {headers: this.headers})
      .map(res => res.json())
      .subscribe(data =>{
        userInfo.id = data.userId;
        userInfo.notification = data.message;
        resolve(userInfo);
      });
    }).catch(this.handleError);
  }


  read(): Promise<any> {
    
    return new Promise(resolve => {
      this.http.get(BASE_URI + "/retrieve-users.php")
        .map(res => res.json())
        .subscribe(data =>{
          this.users = data;
          setTimeout(() => {
            resolve(this.users);
            this.spinnerDialog.hide();
          }, 1000);
        });
    }).catch(error => {
      this.handleError("Une erreur s'est produite. Vérifier la connexion!");
      this.spinnerDialog.hide();
    });
  }


  update(user: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
  delete(user: User): Promise<User> {
    throw new Error("Method not implemented.");
  }


  private handleError(error: any = "Une erreur est survenue!"): Promise<any> {
    //let notification = this.toastCtrl.sendNotification(error);
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
