
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
//import * as jwt from 'jsonwebtoken';
//import { JwtHelper } from 'angular2-jwt';
import { JwtHelperService } from '@auth0/angular-jwt'
import 'rxjs/Rx';

class DecodedToken {
  exp: number = 0;
  username: string =  '';
}

@Injectable()
export class AuthService {
  private decodedToken;
  jwt = new JwtHelperService();
  
  constructor (private http: HttpClient){
    this.decodedToken = JSON.parse(localStorage.getItem('bwm-meta')) || new DecodedToken();
  }

  private saveToken(token: string): string{
    this.decodedToken = this.jwt.decodeToken(token);

    localStorage.setItem('bwm-auth', token);
    localStorage.setItem('bwm-meta', JSON.stringify(this.decodedToken));

    return token;
  }

  private getExpiration(){
    return this.jwt.isTokenExpired(localStorage.getItem('bwm-auth'));
  }

  public register(userData: any): Observable<any> {
    return this.http.post('/api/v1/users/register', userData);
  }

  public login(userData: any): Observable<any> {
    return this.http.post('/api/v1/users/auth', userData).pipe(map(
      (token: string) => {
        return this.saveToken(token);
      }
    ));
  }

  public logOut(){
    localStorage.removeItem('bwm-auth');
    localStorage.removeItem('bwm-meta');

    this.decodedToken = new DecodedToken();
  }

  public isExpired(): boolean{

    if(localStorage.getItem('bwm-auth')){  
      return this.jwt.isTokenExpired(localStorage.getItem('bwm-auth'));
    }else{
      return true;
    }
  }

  public getAuthToken(): string {
    return localStorage.getItem('bwm-auth');
  }

  public getUsername(){
    return this.decodedToken.username;
  }
  
}
