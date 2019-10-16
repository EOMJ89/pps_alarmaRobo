import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  clave: string;
  correo: string;
  perfil: string;
  sexo: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    // tslint:disable: variable-name
    private _auth: AngularFireAuth,
    private _db: AngularFirestore
  ) { }

  public get authState(): Observable<firebase.User> {
    return this._auth.authState;
  }

  public iniciarSesion(credenciales: { correo: string, clave: string }) {
    return this._auth.auth.signInWithEmailAndPassword(credenciales.correo, credenciales.clave)
      .then((user: firebase.auth.UserCredential) => {
        console.log('Logueo exitoso');
      });
  }

  public cerrarSesion() {
    return this._auth.auth.signOut()
      .catch((error: any) => {
        console.log(error);
      });
  }

  public get username(): string {
    return this._auth.auth.currentUser.email;
  }

  public verificarPassword() {
    return this._db.collection('users').ref.where('correo', '==', this.username).get()
      .then((snap: QuerySnapshot<any>) => {
        if (snap.docs.length > 0) {
          const auxReturn = snap.docs[0].data() as User;
          auxReturn.id = snap.docs[0].data();
          // console.log(snap);
          return auxReturn;
        } else {
          return false;
        }
      });
  }
}
