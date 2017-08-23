import { NgModule } from '@angular/core';
import { HomePage} from './home-page';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [HomePage],
  imports: [IonicPageModule.forChild(HomePage)],
})
export class HomePageModule { }
