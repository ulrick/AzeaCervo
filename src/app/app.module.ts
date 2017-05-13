import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home-page/home-page';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { Offers } from '../pages/offers/offers-page';
import { Requests } from '../pages/requests/requests-page';
import { AnnouncementComponent } from '../pages/announcement/announcement.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AnnouncementDetail } from "../pages/announcement/announcement-detail";
import { AddAnnouncement } from '../pages/add-announcement/add-announcement';
import { Camera } from "@ionic-native/camera";
import { FilePath } from "@ionic-native/file-path";
import { Transfer } from "@ionic-native/transfer";
import { File } from "@ionic-native/file";
import { SpinnerDialog } from '@ionic-native/spinner-dialog';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ItemDetailsPage,
    ListPage,
    Offers,
    Requests,
    AnnouncementComponent,
    AnnouncementDetail,
    //AddAnnouncement
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
        backButtonIcon: 'arrow-round-back',
        iconMode: 'ios',
        modalEnter: 'modal-slide-in',
        modalLeave: 'modal-slide-out',
        tabsPlacement: 'top',
        pageTransition: 'ios-transition',
        tabsHighlight: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ItemDetailsPage,
    ListPage,
    Offers,
    Requests,
    AnnouncementComponent,
    AnnouncementDetail,
    //AddAnnouncement
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    FilePath,
    File,
    Transfer,
    SpinnerDialog,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}