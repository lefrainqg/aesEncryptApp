import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  setItem(token: any, data: string) {
    localStorage.setItem(token, data);
  }

  getItem(token: any) {
    return localStorage.getItem(token);
  }

  clearItems() {
    localStorage.clear();
  }
}
