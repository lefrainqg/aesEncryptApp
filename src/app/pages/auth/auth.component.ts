import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthSesionService } from 'src/app/services/auth-sesion.service';
import { StorageService } from 'src/app/services/storage.service';
import { EncryptService } from '../../services/encrypt.service';
import { Sesion } from '../../shared/Sesion.interface';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  providers: [MessageService],
})
export class AuthComponent implements OnInit {
  password: string = '';
  username: string = '';

  idUser: any = localStorage.getItem('user');
  isLogin: boolean = false;
  userSesion: Sesion | undefined;

  constructor(
    private wsMsg: MessageService,
    private wsEncryp: EncryptService,
    public wsStorage: StorageService,
    private wsAutentication: AuthSesionService
  ) {}

  ngOnInit(): void {
    this.verifySesion();
  }

  verifySesion() {
    if (this.idUser && this.idUser != undefined) {
      this.isLogin = true;
      this.getPerfil();
    } else {
      this.userSesion = undefined;
      this.isLogin = false;
    }
  }

  auth() {
    const valida = this.validar();
    if (valida === true) {
      this.wsAutentication.getByUsername(this.username).subscribe(
        (res) => {
          if (!res) {
            this.msgError('Usuario y contraseña incorrectos');
            return;
          }
          this.password = this.wsEncryp.passEncoder(this.password);
          this.wsAutentication
            .getAutentication(res.sesId!, this.username, this.password)
            .subscribe(
              (res) => {
                if (!res) {
                  this.msgError('Usuario y contraseña incorrectos');
                  return;
                }
                res.sesLastAccess = new Date();
                this.updateDateAccess(res);
                this.wsStorage.setItem('user', res.sesId!.toString());
                this.msgSuccess('Usuario autenticado de forma correcta');
                this.verifySesion();
                this.username = '';
                this.password = '';
              },
              (err) => {
                this.msgError(
                  'No se pudo iniciar la sesión, intente mas tarde'
                );
              }
            );
        },
        (err) => {
          this.msgError('No se pudo iniciar la sesión, intente mas tarde');
        }
      );
    } else {
      this.msgError(valida.toString());
    }
  }

  updateDateAccess(user: Sesion) {
    this.wsAutentication.update(user).subscribe(
      (res) => {
        if (!res) {
          return;
        }
        this.msgSuccess('Ultimo acceso actualizado');
      },
      (err) => {
        return;
      }
    );
  }

  getPerfil() {
    if (!this.idUser) {
      return;
    }
    this.wsAutentication.getById(this.idUser).subscribe(
      (res) => {
        if (!res) {
          this.msgError('Error al obtener datos del usuario');
          return;
        }
        this.userSesion = {
          sesId: res.sesId,
          sesLastAccess: res.sesLastAccess,
          sesUser: res.sesUser,
        };
      },
      (err) => {
        this.msgError('Error al obtener datos del usuario');
      }
    );
  }

  logout() {
    this.wsStorage.clearItems();
    this.verifySesion();
    this.isLogin = false;
    this.userSesion = undefined;
  }

  validar(): string | boolean {
    if (this.username.trim().length === 0) {
      return 'Ingrese la cuenta de usuario de forma correcta';
    }
    if (this.password.trim().length === 0) {
      return 'Ingrese la contraseña de forma correcta';
    }
    return true;
  }

  msgError(msg: string) {
    this.wsMsg.add({
      severity: 'error',
      summary: 'ERROR',
      detail: msg,
    });
  }

  msgSuccess(msg: string) {
    this.wsMsg.add({
      severity: 'success',
      summary: 'ÉXITO',
      detail: msg,
    });
  }
}
