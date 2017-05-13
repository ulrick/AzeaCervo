import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'requests-page',
  templateUrl: 'requests-page.html'
})
export class Requests {
  constructor(public navCtrl: NavController, public navParams: NavParams) {
     console.log("Passed params", navParams.data);
  }
}