import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncryptService } from 'src/app/services/encrypt.service';
import { Mensaje } from 'src/app/shared/Mensaje.interface';

@Component({
  selector: 'app-file-enc',
  templateUrl: './file-enc.component.html',
  styleUrls: ['./file-enc.component.css'],
})
export class FileEncComponent implements OnInit {
  msgEmisor: Mensaje = { blnExito: false, txtKey: '', txtMensaje: '' };
  msgReceptor: Mensaje = { blnExito: false, txtKey: '', txtMensaje: '' };

  encrypted: any | undefined;

  uploadedFiles: any[] = [];

  constructor(
    private wsMsg: MessageService,
    private wsEncryp: EncryptService
  ) {}

  ngOnInit(): void {}

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      const fileTarget = this.uploadedFiles[0];
      if (!fileTarget) {
        this.wsMsg.add({
          severity: 'error',
          summary: 'Seleccione el archivo correctamente',
          detail: '',
        });
        return;
      }
      this.getFileContent(fileTarget);
    }
    this.wsMsg.add({
      severity: 'success',
      summary: 'Archivo cargado correctamte',
      detail: '',
    });
  }

  getFileContent(file: any) {
    var reader = new FileReader();
    const aux = this;
    reader.onload = function (e) {
      aux.msgEmisor.txtMensaje = e.target!.result?.toString();
    };
    reader.readAsText(file);
  }

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
      return 'Seleccione el archivo con contenido para enviar el mensaje';
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
