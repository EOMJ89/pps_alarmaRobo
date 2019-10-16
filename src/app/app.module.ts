import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';

// Firebase Auth
import { AngularFireAuthModule } from '@angular/fire/auth';

// Popover page
import { PopoverPageModule } from './pages/popover/popover.module';

// Providers
import { DeviceMotion } from '@ionic-native/device-motion/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports:
    [BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      // Forms
      FormsModule,
      ReactiveFormsModule,
      // Firebase
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFirestoreModule,
      // Firebase Auth
      AngularFireAuthModule,
      // Popover
      PopoverPageModule,
    ],
  providers: [
    StatusBar,
    SplashScreen,
    DeviceMotion,
    NativeAudio,
    Flashlight,
    Vibration,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {} },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
