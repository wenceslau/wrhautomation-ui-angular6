import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthorizerService {

  oauthTokenUrl;
  jwtPayload: any;  // Armazena o json do token, o payload

  constructor(
    private http: Http,
    private jwtHelper: JwtHelper
  ) {
    this.loadToken();
  }

  login(user: string, password: string): Promise<void> {
    this.trace('login');

    this.oauthTokenUrl = environment.apuUrl + '/oauth/token'
    this.trace('oauthTokenUrl: '+this.oauthTokenUrl)
    
    const headers = new Headers();

    // enviado como post, preciso do content typ para ler o body como um query string
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // clientd e security da aplicacao em base64, angular:@angul@r0
    headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');

    const body = `username=${user}&password=${password}&grant_type=password`;

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        this.storeToken(response.json().access_token);
      })
      .catch(response => {
        if (response.status === 400) {
          if (response.json().error === 'invalid_grant') {
            return Promise.reject('Usuario ou senha invalidos');
          }
        }
        return Promise.reject(response);
      });
  }

  isAccessTokenInvalid() {
    const token = localStorage.getItem('token');
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  clearToken() {
    this.trace('clearToken');
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  private storeToken(token: string) {
    this.trace('storeToken');
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private loadToken() {
    this.trace('loadToken');
    const token = localStorage.getItem('token');
    if (token) {
      this.storeToken(token);
    }
  }

  // Verifica se a permissao contem nos authorities do toekn
  hasPermission(permission: string) {
    if (this.jwtPayload) {
      return this.jwtPayload && this.jwtPayload.authorities.includes(permission);
    }

  }

  // Verifica nas roles se tem alguma que tem permissao
  hasAnyPermission(roles) {
    for (const role of roles) {
      if (this.hasPermission(role)) {
        return true;
      }
    }
    return false;
  }

  private trace(value: string) {
    console.log('AuthorizerService:' + value);
  }
}
