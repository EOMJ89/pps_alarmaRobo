import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SmartAudioService } from 'src/app/services/smartAudio/smart-audio.service';
import { Router } from '@angular/router';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { PopoverController } from '@ionic/angular';
import { PopoverPage } from '../popover/popover.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  // tslint:disable: variable-name
  private _message = '';
  private _sourceImg: string;
  private _active: boolean;

  private _horizontal = true;
  private _vertical = true;
  private _derecha = true;
  private _izquierda = true;

  private _analizarMovimiento: Subscription;

  private _e: Event;

  constructor(
    private _spinnerServ: SpinnerService,
    private _authServ: AuthService,
    private _smartServ: SmartAudioService,
    private _popCtrl: PopoverController,
    private _router: Router,
    private _deviceMotion: DeviceMotion,
    private _flash: Flashlight,
    private _vibrator: Vibration,
  ) { }

  ngOnInit() {
    this._active = false;
    this.manejarBoton();
  }

  private manejarBoton() {
    if (this._active) {
      this._sourceImg = '../../../assets/logo_transparent_button_closed.png';
      this._message = 'Desactivar';
    } else {
      this._sourceImg = '../../../assets/logo_transparent_button_open.png';
      this._message = 'Activar';
    }
  }

  ionViewDidEnter() {
    this._spinnerServ.hideSpinner();
  }

  public async cerrarSesion() {
    this._spinnerServ.showSpinner();
    if (this._active) {
      await this.activarAlarma(this._e);
    }

    this._authServ.cerrarSesion().then(() => {
      this._router.navigate(['login']);
      this._spinnerServ.hideSpinner();
    });
  }

  public async activarAlarma(e: Event) {
    this._e = e;

    // Si tenía la alarma activada, la desactiva, deja de escuchar los cambios en el movimiento
    // y la orientación del dispositivo y frena todos los audios que haya en curso
    if (this._active === true) {
      this.mostrarPop(this._e)
        .then((pop: HTMLIonPopoverElement) => {
          pop.present();
          pop.onDidDismiss().then((r) => {
            if (r.data.apagar) {
              this._active = false;
              this.manejarBoton();
              this._analizarMovimiento.unsubscribe();

              // this.pararSonidos();
              this._vibrator.vibrate(0);
              if (this._flash.isSwitchedOn()) {
                this._flash.switchOff();
              }
            } else {
              console.log('Se canceló');
              this._spinnerServ.mostrarToast('Clave Incorrecta.');
            }
          });
        });
    } else {
      // Si la alarma estaba desactivada, la activa
      this._active = true;
      this.manejarBoton();

      this._analizarMovimiento = this._deviceMotion
        .watchAcceleration({ frequency: 50 })
        .subscribe((acceleration: DeviceMotionAccelerationData) => {
          if (acceleration.x > 8.0) {
            if (this._izquierda === true) {
              this._izquierda = false;
              this._smartServ.reproducirAudio('izquierda', 1);
              setTimeout(() => {
                this._derecha = true;
              }, 1000);
            }
          } else if (acceleration.x < -8.0) {
            if (this._derecha === true) {
              this._derecha = false;
              this._smartServ.reproducirAudio('derecha', 1);
              setTimeout(() => {
                this._izquierda = true;
              }, 1000);
            }
          } else if (acceleration.x > -3.0 && acceleration.x < 3.0 && acceleration.y > 8.5) {
            if (this._vertical === true) {
              this._vertical = false;
              this._horizontal = false;
              this._vibrator.vibrate(0);
              this._flash.switchOn();
              setTimeout(() => {
                this._flash.switchOff();
                this._vertical = true;
              }, 5000);
              this._smartServ.reproducirAudio('vertical', 5);
            }
          } else if (acceleration.x > -3.0 && acceleration.x < 3.0 && acceleration.y < 1.0 && acceleration.y > -1) {
            if (this._horizontal === false) {
              this._horizontal = true;
              if (this._flash.isSwitchedOn() === true) {
                this._flash.switchOff();
              }
              this._smartServ.reproducirAudio('horizontal', 5);
              this._vibrator.vibrate(5000);
            }
          }
        });
    }
  }

  public mostrarPop(e: Event) {
    return this._popCtrl.create({
      component: PopoverPage,
      event: e,
      backdropDismiss: false,
    });
  }
}
