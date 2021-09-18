import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Sesion } from '../shared/Sesion.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthSesionService {
  private baseURL: string = environment.baseURL;
  constructor(private http: HttpClient) {}

  getById(sesId: number): Observable<Sesion> {
    return this.http.get<Sesion>(`${this.baseURL}/sesion/${sesId}`);
  }

  getByUsername(username: string): Observable<Sesion> {
    return this.http.get<Sesion>(
      `${this.baseURL}/sesion/find?username=${username}`
    );
  }

  getAutentication(
    sesId: number,
    username: string,
    password: string
  ): Observable<Sesion> {
    return this.http.get<Sesion>(
      `${this.baseURL}/sesion/autenticacion?id=${sesId}&username=${username}&password=${password}`
    );
  }

  create(data: Sesion): Observable<Sesion> {
    return this.http.post<Sesion>(`${this.baseURL}/sesion`, data);
  }

  update(data: Sesion): Observable<Sesion> {
    return this.http.put<Sesion>(`${this.baseURL}/sesion/${data.sesId!}`, data);
  }

  delete(id: number): Observable<Boolean> {
    return this.http.delete<Boolean>(`${this.baseURL}/sesion/${id}`);
  }
}
