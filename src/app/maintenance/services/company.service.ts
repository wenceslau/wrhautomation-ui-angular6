import { Company } from './../../core/model';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Parameters, CoreService } from '../../core/services/core.service';
import { ParseSourceFile } from '@angular/compiler';

@Injectable()
export class CompanyService {

  private path = '/company';

  constructor(private service: CoreService) { }

  list(status: Boolean): Promise<any> {

    var pars = new Parameters();


    const serach = new URLSearchParams();
    if (status) {
      serach.set('status', status + '');
    } else {
      serach.set('status', null);
    }
    pars.search = serach;


    pars.path = this.path;
    return this.service.list(pars);
  }

  save(object: Company): Promise<Company> {
    var pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Company): Promise<Company> {

    var pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.edit(pars);
  }

  findByCode(code: number): Promise<Company> {
    var pars = new Parameters();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }

}
