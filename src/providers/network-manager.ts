import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Network } from '@ionic-native/network';
import { SpinnerDialog } from "@ionic-native/spinner-dialog";
import 'rxjs/add/operator/map';

/*
  Generated class for the NetworkManager provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NetworkManager {

  private networkState = this.network.type;
  
  constructor(public http: Http, private network: Network, private spinnerDialog : SpinnerDialog) {

  }

  public onConnect(){
    this.network.onConnect().subscribe( data => {
      this.spinnerDialog.show("Connexion!", "Connexion "+this.checkConnection()), error => console.log(error);
      setTimeout(() => {
        this.spinnerDialog.hide();
      }, 3000);
    });
  }

  public onDisconnect() {
    /*this.network.onDisconnect().subscribe( data => {
        this.displayNetworkUpdate(data.type);
    }, error => console.error(error))*/
    
    this.network.onDisconnect().subscribe(data => {
      this.spinnerDialog.show("Connexion!", "Vous n'êtes pas connectés!"), error => console.log(error);
      setTimeout(() => {
        this.spinnerDialog.hide();
      }, 3000);
      
    });
  }


  public onChange(){
    this.network.onchange().subscribe(data => {
      this.spinnerDialog.show("Connexion!", "Tentative de connexion "+this.checkConnection()), error => console.log(error);
      setTimeout(() => {
        //if (this.network.type != "none") {
          this.spinnerDialog.hide();
        //}
      }, 3000);
    });
  }

  public isConnected() : boolean{
    return (this.networkState != ("none" || "unknown" || "cellular") );
  }

  private checkConnection() : string {

    let connection = "";
    switch (this.networkState) {
      case "unknown":
        connection = "AUTRE";
        break;
      case "ethernet":
        connection = "ETHERNET";
        break;
      case "wifi":
        connection = "WIFI";
        break;
      case "2g":
        connection = "2G";
        break;
      case "3g":
        connection = "3G";
        break;
      case "4g":
        connection = "4G";
        break;
      case "cellular":
        connection = "CELLULAIRE";
        break;
      case "none":
        connection = "PAS DE SIGNAL RESEAUX";
        break;
    
      default:
        connection = "AUTRE";
        break;
    }

    return connection;
  }

}
