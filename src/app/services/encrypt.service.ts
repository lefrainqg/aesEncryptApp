import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

const SecureStorage = require('secure-web-storage');
//const SECRET_KEY = 'key';
@Injectable({
  providedIn: 'root',
})
export class EncryptService {
  constructor() {}

  aesEncrypt(data: any, key: string) {
    data = CryptoJS.AES.encrypt(data, key);
    data = data.toString();
    return data;
  }

  aesDecrypt(data: any, key: string) {
    data = CryptoJS.AES.decrypt(data, key);
    data = data.toString(CryptoJS.enc.Utf8);
    return data;
  }

  passEncoder(data: any) {
    data = CryptoJS.SHA384(data);
    return data;
  }
}
