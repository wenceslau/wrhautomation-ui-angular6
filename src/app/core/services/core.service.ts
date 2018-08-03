import { HandlerService } from './handler.service';
import { Injectable } from '@angular/core';
import { Headers, URLSearchParams, Http, ResponseContentType } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { environment } from '../../../environments/environment';

export class Parameters {
  private _path: string;
  private _object: any;
  private _search: URLSearchParams;

  get path(): string {
    return this._path;
  }
  set path(p: string) {
    this._path = p;
  }
  get object(): any {
    return this._object;
  }
  set object(p: any) {
    this._object = p;
  }
  get search(): URLSearchParams {
    return this._search;
  }
  set search(p: URLSearchParams) {
    this._search = p;
  }
}

@Injectable()
export class CoreService {

  private _url;
  private useOauth = true;

  constructor(
    private baseHppp: Http,
    private http: AuthHttp,
    private handler: HandlerService) {
    this._url = environment.apuUrl;
    this.trace('URL: ' + this._url)
  }

  list(pars: Parameters): Promise<any> {
    this.trace('list');
    const headers = this.header();
    this.handler.block();
    return this.http.get(`${this._url}${pars.path}`,
      { headers, search: pars.search })
      .toPromise()
      .then(response => {
        this.handler.unblock();
        try {
          return response.json();
        } catch{
          return null;
        }
      });
  }

  save(pars: Parameters): Promise<any> {
    this.trace('save');
    const headers = this.header();
    this.handler.block();
    return this.http.post(`${this._url}${pars.path}`, JSON.stringify(pars.object), { headers })
      .toPromise()
      .then(response => {
        this.handler.unblock();
        return response.json();
      });
  }

  edit(pars: Parameters): Promise<any> {
    this.trace('edit');
    const headers = this.header();
    this.handler.block();
    return this.http.put(`${this._url}${pars.path}/${pars.object.code}`, JSON.stringify(pars.object), { headers })
      .toPromise()
      .then(response => {
        this.handler.unblock();
        return response.json();
      });
  }

  findByCode(pars: Parameters, code: number): Promise<any> {
    this.trace('findByCode');
    const headers = this.header();
    this.handler.block();
    return this.http.get(`${this._url}${pars.path}/${code}`, { headers })
      .toPromise()
      .then(response => {
        this.handler.unblock();
        return response.json();
      });
  }

  delete(pars: Parameters, code: number): Promise<void> {
    this.trace('delete');
    const headers = this.header();
    this.handler.block();
    return this.http.delete(`${this._url}${pars.path}/${code}`, { headers })
      .toPromise()
      .then(() => {
        this.handler.unblock();
      });
  }

  get(completePath: string) {
    this.trace('get');
    const headers = this.header();
    this.handler.block();
    return this.http.get(this._url + completePath,
      { headers })
      .toPromise()
      .then(response => {
        this.handler.unblock();
        return response.json();
      });
  }

  report(completePath: string) {
    this.trace('report');
    this.handler.block();
    return this.http.get(this._url + completePath,
      { responseType: ResponseContentType.Blob })
      .toPromise()
      .then(response => {
        this.handler.unblock();
        return response.blob()
      });
  }

  post(completePath: string): Promise<any> {
    this.trace('post');
    const headers = this.header();
    this.handler.block();
    return this.http.post(this._url + completePath,
      { headers })
      .toPromise()
      .then(response => {
        this.handler.unblock();
        return response.json();
      });
  }

  put(completePath: string): Promise<any> {
    this.trace('put');
    const headers = this.header();
    this.handler.block();
    return this.http.put(this._url + completePath,
      { headers })
      .toPromise()
      .then(() => {
        this.handler.unblock();
      });
  }


  header(): Headers {
    this.trace('header');
    if (this.useOauth) {
      return null;
    } else {
      const headers = new Headers();
      headers.append('Authorization', 'Basic ZGV2OmQzdjM=');
      headers.append('Content-Type', 'application/json');
      return headers;
    }
  }

  url(): string {
    return this._url;
  }

  private test() {
    this.trace('test');
    return this.http.get(this._url)
      .toPromise()
      .then(response => response.json());
  }

  private trace(value: string) {
    console.log('CoreService:' + value);
  }
}
