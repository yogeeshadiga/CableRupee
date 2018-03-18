import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { CollectPage } from '../pages/collect/collect';
import { SyncPage } from '../pages/sync/sync';

import { IonicStorageModule } from'@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';

import { DatabaseProvider } from '../providers/database/database';
import {FaIconComponent} from "../components/fa-icon/fa-icon.component";

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    CollectPage,
    SyncPage,
    FaIconComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    CollectPage,
    SyncPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    SQLitePorter,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider
  ]
})
export class AppModule {}
