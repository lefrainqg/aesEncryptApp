import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Mensaje } from 'src/app/shared/Mensaje.interface';
import { EncryptService } from '../../services/encrypt.service';

@Component({
  selector: 'app-basic-enc',
  templateUrl: './basic-enc.component.html',
  styleUrls: ['./basic-enc.component.css'],
})
export class BasicEncComponent implements OnInit {
  msgEmisor: Mensaje = { blnExito: false, txtKey: '', txtMensaje: '' };
  msgReceptor: Mensaje = { blnExito: false, txtKey: '', txtMensaje: '' };

  encrypted: any | undefined;

  constructor(
    private wsMsg: MessageService,
    private wsEncryp: EncryptService
  ) {}

  ngOnInit(): void {}

  cifrarEnviarMsg() {
    let validar = this.validarEnvio();
    if (validar === true) {
      this.encrypted = this.wsEncryp.aesEncrypt(
        this.msgEmisor.txtMensaje,
        this.msgEmisor.txtKey!
      );
      this.wsMsg.add({
        severity: 'success',
        summary: 'ÉXITO',
        detail: 'El encrypted se ha cifrado y enviado correctamente',
      });
      this.msgEmisor = { blnExito: true, txtKey: '', txtMensaje: '' };
    } else {
      this.wsMsg.add({
        severity: 'error',
        summary: 'ERROR',
        detail: validar.toString(),
      });
    }
  }

  validarEnvio(): string | boolean {
    if (
      !this.msgEmisor.txtMensaje ||
      this.msgEmisor.txtMensaje.trim().length === 0
    ) {
      return 'Ingrese el texto del mensaje correctamente';
    }
    if (
      !this.msgEmisor.txtKey ||
      this.msgEmisor.txtKey.trim().length === 0 ||
      this.msgEmisor.txtKey.trim().length < 8
    ) {
      return 'La clave de cifrado debe tener al menos 8 caracteres';
    }
    return true;
  }

  decifrarVerMsg() {
    if (
      !this.msgReceptor.txtKey ||
      this.msgReceptor.txtKey.trim().length === 0
    ) {
      this.msgReceptor = {
        blnExito: false,
        txtKey: '',
        txtMensaje: 'Ingrese la clave de forma correcta para decifrar',
      };
    }
    try {
      const decrypted = this.wsEncryp.aesDecrypt(
        this.encrypted,
        this.msgReceptor.txtKey!
      );
      if (decrypted) {
        this.msgReceptor = {
          blnExito: true,
          txtKey: '',
          txtMensaje: decrypted,
        };
      } else {
        this.wsMsg.add({
          severity: 'error',
          summary: 'ERROR',
          detail: 'Error al obtener el mensaje',
        });
      }
    } catch (error) {
      this.wsMsg.add({
        severity: 'error',
        summary: 'ERROR',
        detail: 'Error al obtener el mensaje, intente de nuevo',
      });
    }
  }

  reset() {
    this.msgEmisor = { blnExito: false, txtKey: '', txtMensaje: '' };
    this.msgReceptor = { blnExito: false, txtKey: '', txtMensaje: '' };
    this.encrypted = undefined;
  }
}
