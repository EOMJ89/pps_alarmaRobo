import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { AuthService, User } from 'src/app/services/auth/auth.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {
  private formGroup: FormGroup;

  // tslint:disable: variable-name
  constructor(
    private _popCtrl: PopoverController,
    private _formBuilder: FormBuilder,
    private _authServ: AuthService,
    private _spinnerServ: SpinnerService,
  ) { }

  //#region Inicializador
  ngOnInit() {
    this.inicializarForm();
  }

  public inicializarForm() {
    this.formGroup = this._formBuilder.group({
      clave: new FormControl('', [Validators.required])
    });
  }
  //#endregion

  public async manejarRetorno(hayClave: boolean) {
    let apagar = false;
    if (hayClave) {
      // console.log('Reviso el firebase para ver si es correcto:', this.formGroup.value);
      this._spinnerServ.showSpinner();
      await this._authServ.verificarPassword()
        .then((r: User | boolean) => {
          if (r !== false) {
            if ((r as User).clave === this.formGroup.value.clave) {
              apagar = true;
            }
          }
        });
      this._spinnerServ.hideSpinner();
      this._popCtrl.dismiss({
        apagar
      });
    } else {
      // console.log('Cancelo');
      this._popCtrl.dismiss({
        apagar
      });
    }
  }
}
