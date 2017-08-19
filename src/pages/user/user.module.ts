import { NgModule } from '@angular/core';
import { IonicModule, IonicPageModule } from 'ionic-angular';
import { User } from './user';

@NgModule({
  declarations: [
    User,
  ],
  imports: [
    IonicPageModule.forChild(User)
  ],
  exports: [
    User
  ]
})
export class UserModule {}
