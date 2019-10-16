import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SmartAudioService } from './services/smartAudio/smart-audio.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public showSplash = true;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    // tslint:disable: variable-name
    private _smartAudioServ: SmartAudioService,
  ) { this.initializeApp(); }

  public initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackOpaque();

      setTimeout(() => {
        this.splashScreen.hide();
      }, 3000);

      setTimeout(() => {
        this.showSplash = false;
      }, 8000);

      this._smartAudioServ.cargarAudios();
    });
  }
}
