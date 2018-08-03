import { Datasource } from './../../core/model';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Parameters, CoreService } from '../../core/services/core.service';

@Injectable()
export class DatasourceService {

  private path = '/datasource';

  constructor(private service: CoreService) { }

  list(): Promise<any> {
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.list(pars);
  }

  save(object: Datasource): Promise<Datasource> {
    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Datasource): Promise<Datasource> {

    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.edit(pars);
  }

  findByCode(code: number): Promise<Datasource> {
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }

}
